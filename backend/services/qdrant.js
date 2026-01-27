const {QdrantVectorStore} = require('@langchain/qdrant')

const embeddings = new GoogleGenerativeAIEmbeddings({
    model: 'text-embedding-004'
})

const vectorStore = new QdrantVectorStore.fromExistingCollection(embeddigs, {
    url: process.env.QDRANT_URL,
    collectionName: "langchainjs-testing"
})