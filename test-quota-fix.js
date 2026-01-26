// Test gemini-2.5-flash (stable model with better quota)
import { GoogleGenAI } from "@google/genai";

const apiKey = "AIzaSyDMgg-oi-oKIZnL7Gk_AapakePuryQZmFI";

async function testStableModel() {
  try {
    console.log('🧪 Testing gemini-2.5-flash (stable model)...\n');
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Say "Hello from Gemini 2.5 Flash!" in JSON format with key "message"',
      config: {
        responseMimeType: "application/json",
      },
    });
    
    console.log('✅ SUCCESS! gemini-2.5-flash is working!');
    console.log('Response:', response.text);
    console.log('\n📝 This model has better quota limits than gemini-3-flash-preview');
    
  } catch (error) {
    console.error('❌ FAILED:', error.error?.message || error.message);
    if (error.error?.code === 429) {
      console.error('\n⚠️  QUOTA EXCEEDED - All models exhausted!');
      console.error('Solutions:');
      console.error('1. Wait 24 hours for quota reset');
      console.error('2. Get a new API key from https://aistudio.google.com/');
      console.error('3. Upgrade to paid tier for higher limits');
    }
  }
}

testStableModel();
