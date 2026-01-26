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
      const response = await this.ai.models.generateContent({
        model: this.MODEL,
        contents: `Extract the user's Name and State from the following voice transcript.
        The input might be in English, Hindi, or any Indian language.
        Translate the State name to English if it is in native script (e.g. 'महाराष्ट्र' -> 'Maharashtra').
        
        Input: "${text}"
        
        Respond in JSON format with keys: name, state, detectedLanguage`,
        config: {
          responseMimeType: "application/json",
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
      const response = await this.ai.models.generateContent({
        model: this.MODEL,
        contents: `Extract agricultural listing details from the following text. 
        The text may be in English or any Indian language.
        Focus on produce name, quantity, unit, and price. 
        Infer quality if mentioned. 
        Default currency to INR if not specified.
        Translate produce name to English for standardization (e.g. 'Pyaaz' -> 'Onion').
        
        Text: "${text}"
        
        Respond in JSON format with keys: produceName, quantity, unit, pricePerUnit, currency, quality, description`,
        config: {
          responseMimeType: "application/json",
        },
      });

      const result = response.text;
      if (!result) throw new Error("Empty response from Gemini");
      return JSON.parse(result) as ListingData;
    } catch (error) {
      console.error("Gemini Extraction Error:", error);
      throw new Error("Failed to extract listing data. Please try again.");
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
    const humanRole = userRole === UserRole.BUYER ? 'Buyer' : 'Seller';
    const languageName = SUPPORTED_LANGUAGES[language]?.name || "English";
    const languageCode = SUPPORTED_LANGUAGES[language]?.code || "en";

    try {
      // Get the last user message
      const lastUserMessage = history.filter(m => m.senderId !== 'system').slice(-1)[0];
      const userMessage = lastUserMessage?.text || "Hello";

      const prompt = `You are a ${aiRole} in a negotiation for ${listing.produceName}.

PRODUCT DETAILS:
- Item: ${listing.produceName}
- Listed Price: ₹${listing.pricePerUnit} per ${listing.unit}
- Quantity Available: ${listing.quantity} ${listing.unit}
- Location: ${listing.location}

YOUR ROLE: ${aiRole === 'Seller' ? 'You are selling this product. Your minimum price is ₹' + Math.round(listing.pricePerUnit * 0.85) : 'You want to buy this product. Your maximum price is ₹' + Math.round(listing.pricePerUnit * 1.15)}.

USER SAID: "${userMessage}"

INSTRUCTIONS:
1. Respond in ${languageName} language
2. When asked about price, ALWAYS state: "₹${listing.pricePerUnit} per ${listing.unit}"
3. Be specific with numbers - NO vague responses
4. Keep response under 25 words
5. If user says "deal" or "yes", set status to "agreed"

RESPOND IN JSON:
{
  "text": "your ${languageName} response with specific price",
  "status": "ongoing",
  "proposedPrice": ${lastOffer.price},
  "proposedQuantity": ${lastOffer.quantity}
}`;

      console.log("🤖 Negotiation request to Gemini...");
      console.log("📝 User message:", userMessage);
      
      const response = await this.ai.models.generateContent({
        model: this.MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
          maxOutputTokens: 200,
        },
      });

      console.log("✅ Received response from Gemini");
      
      const result = response.text;
      if (!result) {
        console.error("❌ Empty response from Gemini");
        throw new Error("Empty response from Gemini");
      }
      
      console.log("📝 Raw response:", result);
      
      let parsed;
      try {
        parsed = JSON.parse(result);
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        console.error("Raw text was:", result);
        // Fallback: use the text directly
        return {
          text: result || `The price is ₹${listing.pricePerUnit} per ${listing.unit}. Interested?`,
          status: 'ongoing',
          proposedPrice: lastOffer.price,
          proposedQuantity: lastOffer.quantity
        };
      }
      
      console.log("✅ Parsed response:", parsed);
      
      return {
        text: parsed.text || `The price is ₹${listing.pricePerUnit} per ${listing.unit}. Interested?`,
        status: parsed.status || 'ongoing',
        proposedPrice: parsed.proposedPrice || lastOffer.price,
        proposedQuantity: parsed.proposedQuantity || lastOffer.quantity
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
      const response = await this.ai.models.generateContent({
        model: this.MODEL,
        contents: `Analyze the following message for inappropriate content (toxicity, hate speech) or scam risks in an agricultural trade context.
        
Message: "${message}"

Respond in JSON format with keys: flagged (boolean), reason (inappropriate/scam_risk/null), advisory (string or null)`,
        config: {
          responseMimeType: "application/json",
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
