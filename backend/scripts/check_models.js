const dotenv = require('dotenv');
dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
    console.error("Error: GOOGLE_API_KEY not found in .env");
    process.exit(1);
}

async function listModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", data.error);
            return;
        }

        console.log("--- Available Models ---");
        // Filter specifically for "generateContent" support (chat models)
        const chatModels = data.models.filter(m => 
            m.supportedGenerationMethods.includes("generateContent")
        );

        chatModels.forEach(model => {
            console.log(`Name: ${model.name}`); // e.g., "models/gemini-1.5-flash"
            console.log(`Display Name: ${model.displayName}`);
            console.log("-------------------------");
        });

    } catch (error) {
        console.error("Network Error:", error);
    }
}

listModels();