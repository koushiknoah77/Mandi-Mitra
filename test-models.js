import { GoogleGenAI } from "@google/genai";

const apiKey = "";

const modelsToTest = [
    "gemini-1.5-flash",
    "gemini-2.0-flash-exp",
    "gemini-2.0-flash",
    "gemini-3-flash-preview"
];

async function test() {
    const client = new GoogleGenAI({ apiKey });

    for (const modelName of modelsToTest) {
        try {
            console.log(`Testing model: ${modelName}`);
            const response = await client.models.generateContent({
                model: modelName,
                contents: "Hi",
            });
            console.log(`✅ Success for ${modelName}: ${response.text.substring(0, 20)}...`);
        } catch (e) {
            console.log(`❌ Failed for ${modelName}: ${e.message}`);
        }
    }
}

test();
