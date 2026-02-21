// Script to clear the entire Qdrant database collection
// Run this with: node clearDatabase.js

const dotenv = require('dotenv');
const { QdrantClient } = require('@qdrant/js-client-rest');
const readline = require('readline');

dotenv.config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function clearDatabase() {
    try {
        const client = new QdrantClient({
            url: process.env.QDRANT_URL,
        });

        const collectionName = "docchat-testing";

        // Check if collection exists
        const collections = await client.getCollections();
        const collectionExists = collections.collections.some(
            col => col.name === collectionName
        );

        if (!collectionExists) {
            console.log(`Collection "${collectionName}" does not exist. Nothing to clear.`);
            rl.close();
            return;
        }

        // Get collection info to show user what will be deleted
        const collectionInfo = await client.getCollection(collectionName);
        console.log(`\n⚠️  WARNING: You are about to delete the entire collection!`);
        console.log(`Collection: ${collectionName}`);
        console.log(`Total vectors: ${collectionInfo.points_count}`);
        console.log(`Vector size: ${collectionInfo.config.params.vectors.size}`);

        // Ask for confirmation
        rl.question('\nAre you sure you want to DELETE ALL DATA? (yes/no): ', async (answer) => {
            if (answer.toLowerCase() === 'yes') {
                console.log('\nDeleting collection...');
                await client.deleteCollection(collectionName);
                console.log('✅ Collection deleted successfully!');
                
                // Optionally recreate the collection
                rl.question('\nDo you want to recreate the empty collection? (yes/no): ', async (recreate) => {
                    if (recreate.toLowerCase() === 'yes') {
                        await client.createCollection(collectionName, {
                            vectors: {
                                size: 768, // gemini-embedding-001 dimension
                                distance: 'Cosine',
                            },
                        });
                        console.log('✅ Empty collection recreated successfully!');
                    }
                    rl.close();
                });
            } else {
                console.log('❌ Operation cancelled. No data was deleted.');
                rl.close();
            }
        });

    } catch (error) {
        console.error('❌ Error clearing database:', error.message);
        rl.close();
        process.exit(1);
    }
}

clearDatabase();