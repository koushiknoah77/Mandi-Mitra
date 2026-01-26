// Test with CORRECT model names from official docs
import { GoogleGenAI } from "@google/genai";

const apiKey = "AIzaSyDMgg-oi-oKIZnL7Gk_AapakePuryQZmFI";

const models = [
  'gemini-3-flash-preview',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
];

async function testModel(modelName) {
  try {
    console.log(`\n🧪 Testing: ${modelName}`);
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: modelName,
      contents: 'Respond with JSON: {"message": "Hello from Gemini!", "model": "' + modelName + '"}',
      config: {
        responseMimeType: "application/json",
      },
    });
    
    console.log(`✅ SUCCESS!`);
    console.log(`Response:`, response.text);
    return modelName;
  } catch (error) {
    console.error(`❌ FAILED:`, error.error?.message || error.message);
    if (error.error) {
      console.error(`   Status: ${error.error.status}, Code: ${error.error.code}`);
    }
    return null;
  }
}

async function findWorkingModel() {
  console.log('🚀 Testing CORRECT Gemini model names from official docs...\n');
  
  for (const model of models) {
    const working = await testModel(model);
    if (working) {
      console.log(`\n✨ Found working model: ${working}`);
      console.log(`\n📝 Update your geminiService.ts to use this model!`);
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n❌ No working models found.');
  console.log('⚠️  Possible issues:');
  console.log('   1. API key quota exceeded (check https://aistudio.google.com/)');
  console.log('   2. API key invalid or expired');
  console.log('   3. Billing not enabled for your project');
}

findWorkingModel();
