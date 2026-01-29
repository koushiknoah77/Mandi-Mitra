import { GoogleGenAI } from "@google/genai";
import { ListingData, ModerationResult, Listing, UserRole, Message, SupportedLanguageCode } from "../types";
import { SUPPORTED_LANGUAGES } from "../constants";

export interface NegotiationResponse {
  text: string;
  status: 'ongoing' | 'agreed' | 'rejected';
  proposedPrice?: number;
  proposedQuantity?: number;
}

export interface ExtractedUserProfile {
  name?: string;
  state?: string;
  detectedLanguage?: SupportedLanguageCode;
}

class GeminiService {
  private ai: GoogleGenAI;
  private readonly VERSION = '3.0.9-SIMPLE';
  private readonly MODEL = 'gemini-2.5-flash';

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error("❌ GEMINI_API_KEY is missing!");
      throw new Error("Gemini API key is required. Please add VITE_GEMINI_API_KEY to your .env.local file.");
    }
    
    this.ai = new GoogleGenAI({ apiKey });
    console.log(`✅ Gemini AI Service v${this.VERSION}`);
    console.log(`📡 Model: ${this.MODEL}`);
    console.log(`🕐 Loaded: ${new Date().toLocaleTimeString()}`);
  }

  async extractUserProfile(text: string): Promise<ExtractedUserProfile> {
    try {
      const schema = {
        type: "object",
        properties: {
          name: { type: "string", description: "User's name" },
          state: { type: "string", description: "User's state in English" },
          detectedLanguage: { type: "string", description: "Detected language code" }
        }
      };

      const response = await this.ai.models.generateContent({
        model: this.MODEL,
        contents: `Extract the user's Name and State from: "${text}". Translate state to English if needed.`,
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: schema,
        },
      });

      const result = response.text;
      if (!result) return {};
      return JSON.parse(result) as ExtractedUserProfile;
    } catch (error) {
      console.error("Gemini Profile Extraction Error:", error);
      throw new Error("Failed to extract profile. Please try again.");
    }
  }

  async extractListingData(text: string): Promise<ListingData> {
    try {
      const schema = {
        type: "object",
        properties: {
          produceName: { 
            type: "string", 
            description: "Produce name in English (e.g., Rice, Wheat, Onion, Tomato)" 
          },
          quantity: { 
            type: "number", 
            description: "Numeric quantity amount (e.g., 50, 100)" 
          },
          unit: { 
            type: "string", 
            description: "Unit of measurement (quintal, kg, ton, bag)" 
          },
          pricePerUnit: { 
            type: "number", 
            description: "Price per unit in rupees (numeric only)" 
          },
          currency: { 
            type: "string", 
            description: "Currency code (default: INR)" 
          },
          quality: { 
            type: "string", 
            description: "Quality grade (Premium, Grade A, Standard, etc.)" 
          },
          description: { 
            type: "string", 
            description: "Additional details about the produce" 
          },
          detectedLanguage: {
            type: "string",
            description: "Detected language of the input text (hi, bn, te, mr, ta, gu, etc.)"
          }
        },
        required: ["produceName", "quantity", "unit", "pricePerUnit"]
      };

      const prompt = `Extract agricultural listing details from this text in ANY INDIAN LANGUAGE: "${text}"

CRITICAL INSTRUCTIONS:
1. AUTOMATICALLY DETECT the language (Hindi, Bengali, Telugu, Tamil, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Urdu, English, or any other Indian language)
2. Translate produce name to English (e.g., "চাল" → "Rice", "प्याज" → "Onion", "వరి" → "Rice", "தக்காளி" → "Tomato")
3. Extract numeric quantity from ANY script (Devanagari, Bengali, Telugu, Tamil, etc.)
4. Identify unit in any language (quintal/क्विंटल/কুইন্টাল, kg/किलो/কেজি, ton/टन/টন, bag/बोरी/বস্তা, etc.)
5. Extract price per unit as a number from any script (e.g., "100" from "₹100" or "১০০ টাকা" or "100 रुपये")
6. Set currency to "INR" if not specified
7. Infer quality if mentioned in any language
8. Detect and return the language code (hi, bn, te, ta, mr, gu, kn, ml, pa, or, as, ur, en)

MULTI-LANGUAGE EXAMPLES:
- Hindi: "50 क्विंटल चावल 3000 रुपये" → produceName: "Rice", quantity: 50, unit: "quintal", pricePerUnit: 3000, detectedLanguage: "hi"
- Bengali: "৫০ কুইন্টাল চাল ৩০০০ টাকা" → produceName: "Rice", quantity: 50, unit: "quintal", pricePerUnit: 3000, detectedLanguage: "bn"
- Telugu: "50 క్వింటాల్ బియ్యం 3000 రూపాయలు" → produceName: "Rice", quantity: 50, unit: "quintal", pricePerUnit: 3000, detectedLanguage: "te"
- Tamil: "50 குவிண்டால் அரிசி 3000 ரூபாய்" → produceName: "Rice", quantity: 50, unit: "quintal", pricePerUnit: 3000, detectedLanguage: "ta"
- Marathi: "50 क्विंटल तांदूळ 3000 रुपये" → produceName: "Rice", quantity: 50, unit: "quintal", pricePerUnit: 3000, detectedLanguage: "mr"
- Gujarati: "50 ક્વિન્ટલ ચોખા 3000 રૂપિયા" → produceName: "Rice", quantity: 50, unit: "quintal", pricePerUnit: 3000, detectedLanguage: "gu"
- English: "50 quintal rice for 3000" → produceName: "Rice", quantity: 50, unit: "quintal", pricePerUnit: 3000, detectedLanguage: "en"

YOU MUST handle ANY Indian language automatically without being told which language it is!`;

      console.log("🤖 Extracting listing data with auto-language detection from:", text);

      const response = await this.ai.models.generateContent({
        model: this.MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: schema,
          temperature: 0.3, // Lower temperature for more consistent extraction
        },
      });

      const result = response.text;
      if (!result) {
        console.error("❌ Empty response from Gemini");
        throw new Error("Empty response from Gemini");
      }

      console.log("📝 Raw extraction result:", result);

      const parsed = JSON.parse(result) as ListingData & { detectedLanguage?: string };
      
      // Log detected language
      if (parsed.detectedLanguage) {
        console.log(`🌐 Detected language: ${parsed.detectedLanguage}`);
      }
      
      // Validate and set defaults
      if (!parsed.currency) parsed.currency = "INR";
      if (!parsed.quality) parsed.quality = "Standard";
      if (!parsed.description) parsed.description = "";
      
      // Ensure numeric values
      parsed.quantity = Number(parsed.quantity);
      parsed.pricePerUnit = Number(parsed.pricePerUnit);
      
      console.log("✅ Extracted listing data:", parsed);
      
      return parsed;
    } catch (error) {
      console.error("❌ Gemini Extraction Error:", error);
      throw new Error("Failed to extract listing data. Please try again with clear details in any Indian language!");
    }
  }

  async negotiate(
    listing: Listing,
    history: Message[],
    userRole: UserRole, 
    lastOffer: { price: number, quantity: number },
    language: SupportedLanguageCode
  ): Promise<NegotiationResponse> {
    const aiRole = userRole === UserRole.BUYER ? 'Seller' : 'Buyer';
    const languageName = SUPPORTED_LANGUAGES[language]?.name || "English";

    try {
      // Get the last user message
      const lastUserMessage = history.filter(m => m.senderId !== 'system').slice(-1)[0];
      const userMessage = lastUserMessage?.text || "Hello";

      // Simplified approach: Just get a text response, no JSON
      const prompt = `You are a ${aiRole} negotiating for ${listing.produceName}.
Price: ₹${listing.pricePerUnit}/${listing.unit}
User said: "${userMessage}"

Respond in ${languageName} in under 20 words. Mention the price clearly.`;

      console.log("🤖 Negotiation request to Gemini...");
      console.log("📝 User message:", userMessage);
      
      const response = await this.ai.models.generateContent({
        model: this.MODEL,
        contents: prompt,
        config: {
          temperature: 0.7,
          maxOutputTokens: 150,
        },
      });

      console.log("✅ Received response from Gemini");
      
      const result = response.text;
      if (!result) {
        console.error("❌ Empty response from Gemini");
        return {
          text: `The price is ₹${listing.pricePerUnit} per ${listing.unit}. What would you like to offer?`,
          status: 'ongoing',
          proposedPrice: listing.pricePerUnit,
          proposedQuantity: listing.quantity
        };
      }
      
      console.log("📝 AI Response:", result);
      
      // Simple text response - no JSON parsing needed
      // Check if user agreed to deal
      const agreedKeywords = ['deal', 'yes', 'okay', 'agreed', 'accept', 'done', 'হাঁ', 'ঠিক আছে', 'हाँ', 'ठीक है'];
      const isAgreed = agreedKeywords.some(keyword => 
        userMessage.toLowerCase().includes(keyword)
      );
      
      return {
        text: result.trim(),
        status: isAgreed ? 'agreed' : 'ongoing',
        proposedPrice: lastOffer.price,
        proposedQuantity: lastOffer.quantity
      };

    } catch (error) {
      console.error("❌ Gemini Negotiation Error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      
      // Better fallback with actual price
      return {
        text: `The price is ₹${listing.pricePerUnit} per ${listing.unit}. What would you like to offer?`,
        status: 'ongoing',
        proposedPrice: lastOffer.price,
        proposedQuantity: lastOffer.quantity
      };
    }
  }

  async moderateMessage(message: string, currentPrice: number, marketPrice: number): Promise<ModerationResult> {
    const priceDeviationPct = ((currentPrice - marketPrice) / marketPrice) * 100;

    if (Math.abs(priceDeviationPct) > 50) {
       return {
         flagged: true,
         reason: 'price_deviation',
         priceDeviationPct,
         advisory: `Price deviation is high (${Math.round(priceDeviationPct)}%). Proceed with caution.`
       };
    }

    try {
      const schema = {
        type: "object",
        properties: {
          flagged: { type: "boolean", description: "Whether content is inappropriate" },
          reason: { type: "string", description: "Reason for flagging" },
          advisory: { type: "string", description: "Advisory message" }
        },
        required: ["flagged"]
      };

      const response = await this.ai.models.generateContent({
        model: this.MODEL,
        contents: `Analyze for inappropriate content or scam risks: "${message}"`,
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: schema,
        },
      });

      const result = response.text;
      if (!result) return { flagged: false };
      const parsed = JSON.parse(result);
      
      return {
        flagged: parsed.flagged,
        reason: parsed.reason,
        priceDeviationPct,
        advisory: parsed.advisory
      };

    } catch (error) {
      console.error("Gemini Moderation Error:", error);
      return { flagged: false };
    }
  }

  async generateSupportResponse(query: string, language: SupportedLanguageCode): Promise<string> {
    const languageName = SUPPORTED_LANGUAGES[language]?.name || "English";
    
    try {
      const response = await this.ai.models.generateContent({
        model: this.MODEL,
        contents: `You are a helpful support assistant for Mandi Mitra, an agricultural marketplace platform.
        
User Language: ${languageName}
Query: "${query}"

Answer the query strictly in ${languageName} language.
Keep it under 50 words.
Be helpful and friendly.`,
      });

      return response.text || "I am unable to process your request at the moment.";
    } catch (error) {
      console.error("Gemini Support Error:", error);
      throw new Error("Failed to generate support response. Please try again.");
    }
  }
}

export const geminiService = new GeminiService();
