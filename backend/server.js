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
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { PromptTemplate } = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { RunnableSequence } = require("@langchain/core/runnables");
const auth = require('./auth/auth.js');
const pool = require('./config/db.js')
const cookieParser = require("cookie-parser");
const verifyToken = require("./middlewares/authmiddleware.js");



dotenv.config();

const app = express()
app.use(cookieParser());
const PORT = process.env.PORT || 5000;

// CORS - It will allow the Backend to communicate with the frontend.
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

// Middlewares to parse incoming data. First is for data sent using post requests and second is for form data.
app.use(express.json());
app.use(cookieParser());
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

// This will filter any files that are not PDFs.
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

// Initialize LLM
const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0,
    apiKey: process.env.GOOGLE_API_KEY,
});

// Initialize embeddings
const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001",
    apiKey: process.env.GOOGLE_API_KEY
});

app.post('/api/upload', verifyToken, upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.json({
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
                    source: req.file.originalname,
                    userId: req.user.id,
                    email: req.user.email
                }
            }));

        const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
            url: process.env.QDRANT_URL,
            collectionName: "langchainjs-testing",
        });

        await vectorStore.addDocuments(documents);

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.json({
            success: true,
            message: "PDF uploaded and processed successfully"
        });

    } catch (error) {
        console.log("[ERROR] Upload Failed:", error)

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            success: false,
            error: "Failed to process the pdf",
            details: error.message
        })
    }
});

// Simple RAG chain setup
const promptTemplate = PromptTemplate.fromTemplate(
    `You are a helpful assistant answering questions based on the provided context from a PDF document.

Context from the document:
{context}

Question: {question}

Instructions:
- Answer the question based ONLY on the context provided above
- If the context doesn't contain relevant information, say "I couldn't find that information in the document. Did you upload a document related to your query?"
- Be concise and accurate
- Do not make up information

Answer:`
);

app.post('/api/ask', verifyToken, async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ success: false, error: "Message is required" });
        }

        console.log("Question:", message);

        // Get vector store
        const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
            url: process.env.QDRANT_URL,
            collectionName: "langchainjs-testing",
        });

        // Retrieve relevant documents
        const retriever = vectorStore.asRetriever({
            k: 4,
            filter: {
                must: [
                {
                    key: "userId",
                    match: {
                    value: req.user.id
                    }
                }
            ]
        }
        });

        const docs = await retriever.invoke(message);
        
        console.log(`Retrieved ${docs.length} documents`);

        // Combine document contents
        const context = docs.map(doc => doc.pageContent).join("\n\n");

        // Create the chain
        const chain = RunnableSequence.from([
            promptTemplate,
            llm,
            new StringOutputParser(),
        ]);

        // Get answer
        const answer = await chain.invoke({
            context: context,
            question: message,
        });

        console.log("Answer:", answer);

        res.json({
            success: true,
            answer: answer.trim(),
        });

    } catch (error) {
        console.error("Error in /ask:", error);
        res.status(500).json({ 
            success: false, 
            error: "Failed to generate answer",
            details: error.message 
        });
    }
});

app.get('/api/listdocs', verifyToken, async (req, res)=>{
    try{
        const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
            url: process.env.QDRANT_URL,
            collectionName: "langchainjs-testing",
        });

        const client = vectorStore.client
        const collectionName = "langchainjs-testing"

        
    } catch(error){

    }
})

app.get("/test", async (req,res)=>{
    const result = await pool.query("SELECT current_database()");
    res.send(`the database name is ${result.rows[0].current_database}`)
})

app.use("/auth", auth);

app.listen(PORT, async () => {
    console.log(`Server started on port ${PORT}...`)
})