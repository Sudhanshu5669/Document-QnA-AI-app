// I will comment heavily (or at least try to) so that I (or anyone reading this code) in the future will be able to understand anything i did. Should i continue this comment on another line? Maybe yeah.
// This might not be the best code there is out there, but i am sure by the time i end writing this, i will have learned a lot from this project.
const express = require('express');
const dotenv = require('dotenv');
const multer = require('multer');
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const { QdrantVectorStore } = require('@langchain/qdrant')
const { GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai')
const PDFService = require('./services/PDFService');
const { log } = require('console');
const z = require("zod");
const { tool } = require("@langchain/core/tools");
const {createAgent} = require('langchain')


dotenv.config();

const app = express()
const PORT = process.env.PORT || 5000;

// CORS - It will allow the Backend to communicate with the frontend.
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))


// Middlewares to parse incoming data. First is for data sent using post requests and second is for form data.
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Checks if a upload directory exists, if it doesn't, creates one.
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configures Multer Storage, the destination and filename. Using Date.now() will prevent conflicts and original name can be used to indentify easily what file is being used.
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir)
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName)
    }
})

// This will filter any files that are not PDFs. Why am i writing a comment for every single function i write...
// Well, i am not very used to writing backend code honestly, especially multer... or anything written in this file.
// I guess that is the reason I'm writing a comment before everything.
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error("Only pdfs are accepted please."), false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
})


const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001",
    apiKey: process.env.GOOGLE_API_KEY
});
        
const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
    url: process.env.QDRANT_URL,
    collectionName: "langchainjs-testing",
});


const retrieveSchema = z.object({ query: z.string() });

const retrieve = tool(
  async ({ query }) => {
    const retrievedDocs = await vectorStore.similaritySearch(query, 2);
    
    const serialized = retrievedDocs
      .map(
        (doc) => `Source: ${doc.metadata.source}\nContent: ${doc.pageContent}`
      )
      .join("\n");
      
    return [serialized, retrievedDocs];
  },
  {
    name: "retrieve",
    description: "Retrieve information related to a query.",
    schema: retrieveSchema,
    responseFormat: "content_and_artifact",
  }
);

const tools = [retrieve];
const systemPrompt = new SystemMessage(
    "You have access to a tool that retrieves context from a blog post. " +
    "Use the tool to help answer user queries."
)

const agent = createAgent({ model: "gemini-2.5-flash", tools, systemPrompt });

app.post('/api/upload', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            res.json({
                success: false,
                error: "No file uploaded"
            });
        }

        const filePath = req.file.path;
        const text = await PDFService.extractTextFromPdf(filePath)
        const cleanedText = PDFService.cleanText(text);
        const chunks = PDFService.splitTextIntoChunks(cleanedText)

        const documents = chunks
            .filter(chunk => chunk && chunk.trim().length > 0)
            .map(chunk => ({
                pageContent: chunk,
                metadata: { 
                    source: req.file.originalname 
                }
            }));

        await vectorStore.addDocuments(documents);


    } catch (error) {
        console.log("[ERROR] Upload Failed:", error)

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            success: false,
            error: "Failes to process the pdf",
            details: error.message
        })
    }
});

app.post('/api/ask', async (req, res) => {
    const query = req.body.message;
    let agentInputs = { messages: [{ role: "user", content: query }] };

    const stream = await agent.stream(agentInputs, {
        streamMode: "values",
    });

    for await (const step of stream) {
        const lastMessage = step.messages[step.messages.length - 1];
        console.log(`[${lastMessage.role}]: ${lastMessage.content}`);
        console.log("-----\n");
    }
})

app.listen(PORT, () => {
    console.log("Server started...")
})