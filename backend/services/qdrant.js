const { QdrantClient } = require('@qdrant/js-client-rest');
const {QdrantVectorStore} = require('@langchain/qdrant')
const { Document } = require('@langchain/core/documents')
const { GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai')

const embeddings = new OpenAIEmbeddings({
  modelName: "text-embedding-3-small",
});

class QDrantService{
    constructor(){
        this.client = new QdrantClient({
            url: process.env.QDRANT_URL,
        })

        this.embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey: process.env.GEMINI_API_KEY,
            model: 'embedding-001'
        })

        this.collectionName = 'pdf-documents';

        this.initializeCollection();
    }
}