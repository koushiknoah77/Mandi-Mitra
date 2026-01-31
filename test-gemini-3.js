import { GoogleGenAI } from "@google/genai";

const apiKey = "AIzaSyBi8H08aS7OHerZuR5eZsSePXI_cQuE5Wg";

async function test() {
    const client = new GoogleGenAI({ apiKey });

    try {
        console.log(`Testing model: gemini-3-flash-preview`);
        const response = await client.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: "Hi",
        });
        console.log(`✅ Success: ${response.text}`);
    } catch (e) {
        console.log(`❌ Failed: ${e.message}`);
    }
}

test();
