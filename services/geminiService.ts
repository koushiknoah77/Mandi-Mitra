import { GoogleGenAI } from "@google/genai";
import { ListingData, SupportedLanguageCode, NegotiationIntent, ModerationResult, UserRole } from '../types';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '');

class GeminiService {
    private client: GoogleGenAI | null = null;
    private modelName = 'gemini-3-flash-preview';
    private apiKeyPresent: boolean;

    constructor() {
        this.apiKeyPresent = !!apiKey;
        
        if (!apiKey) {
            console.error("❌ CRITICAL: Gemini API Key is missing!");
            console.error("📝 Set VITE_GEMINI_API_KEY in .env.local file");
            console.error("🔗 Get your key from: https://aistudio.google.com/app/apikey");
            // Don't throw - let the app start and show error in UI
        } else {
            this.client = new GoogleGenAI({
                apiKey: apiKey,
            });
            console.log("✅ Gemini AI initialized successfully");
        }
    }

    private checkApiKey(): void {
        if (!this.apiKeyPresent || !this.client) {
            throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env.local file. Get your key from: https://aistudio.google.com/app/apikey");
        }
    }

    async extractListingData(text: string, language?: SupportedLanguageCode): Promise<ListingData> {
        this.checkApiKey();
        
        try {
            const prompt = `You are a data extraction expert for Mandi Mitra, an agricultural marketplace in India. 
      Input text: "${text}" 
      Language Hint: ${language || 'auto'}

      Extract the following listing details and return as VALID JSON:
      - produceName: Specific crop name (e.g. Sona Masuri Rice, Desi Onion)
      - quantity: Numeric value
      - unit: standard units like kg, quintal, ton, bag (bori)
      - pricePerUnit: Price in INR
      - currency: default "INR"
      - quality: Quality description (e.g. Premium, Grade A, Fresh)
      - description: Brief details about variety or condition
      
      CRITICAL INSTRUCTIONS:
      1. Convert numeric values from local scripts (Hindi: १०००, Bengali: ৩০০০, etc.) to standard Arabic numerals (1000, 3000).
      2. If quantity is mentioned in "bags" (bori), assume 50kg/quintal context if obvious, otherwise just keep "bag" as unit.
      3. If specific details are missing, use null.
      4. Ensure JSON is strictly valid.`;

            const response = await this.client!.models.generateContent({
                model: this.modelName,
                contents: prompt,
                config: { responseMimeType: "application/json" },
            });

            return JSON.parse(response.text || '{}') as ListingData;
        } catch (error) {
            console.error("Error extracting listing data:", error);
            throw error;
        }
    }

    async extractUserProfile(text: string): Promise<{ name?: string; state?: string }> {
        this.checkApiKey();
        
        try {
            const prompt = `Extract user profile details from this text: "${text}". 
      Return VALID JSON with keys: 
      - name (string)
      - state (string, one of Indian states)
      
      Look for patterns like "I am Ramesh from Punjab" or "My name is Suresh and I live in Haryana".`;

            const response = await this.client!.models.generateContent({
                model: this.modelName,
                contents: prompt,
                config: { responseMimeType: "application/json" },
            });

            return JSON.parse(response.text || '{}');
        } catch (error) {
            console.error("Error extracting profile:", error);
            return {};
        }
    }

    async detectNegotiationIntent(message: string, context?: any): Promise<NegotiationIntent> {
        this.checkApiKey();
        
        try {
            const prompt = `Analyze this negotiation message: "${message}". 
      Context: ${JSON.stringify(context)}. 
      Return VALID JSON with keys: 
      - type: 'offer' | 'counter_offer' | 'accept' | 'reject' | 'inquiry' | 'casual' | 'deal_closure'
      - price: number (optional, extracted price)
      - unit: string (optional, extracted unit)
      - confidence: number (0 to 1)
      
      Role context: If sender is ${context?.role}, interpret intent from their perspective.`;

            const response = await this.client!.models.generateContent({
                model: this.modelName,
                contents: prompt,
                config: { responseMimeType: "application/json" },
            });

            return JSON.parse(response.text || '{}') as NegotiationIntent;
        } catch (error) {
            console.error("Error detecting intent:", error);
            return { type: 'casual', confidence: 0 };
        }
    }

    async moderateContent(message: string, marketPrice?: any): Promise<ModerationResult> {
        this.checkApiKey();
        
        try {
            const prompt = `Moderate this message for an agricultural marketplace: "${message}". 
      Market price reference: ${JSON.stringify(marketPrice)}. 
      Return VALID JSON with keys: 
      - flagged: boolean
      - reason: 'inappropriate' | 'price_deviation' | 'scam_risk' (optional)
      - priceDeviationPct: number (optional, % diff from market price)
      - advisory: string (optional, advice for the user)`;

            const response = await this.client!.models.generateContent({
                model: this.modelName,
                contents: prompt,
                config: { responseMimeType: "application/json" },
            });

            return JSON.parse(response.text || '{}') as ModerationResult;
        } catch (error) {
            return { flagged: false };
        }
    }

    async moderateMessage(message: string): Promise<ModerationResult> {
        return this.moderateContent(message);
    }

    async generateSupportResponse(query: string, language: SupportedLanguageCode): Promise<string> {
        this.checkApiKey();
        
        try {
            const prompt = `You are a helpful support assistant for Mandi Mitra, an agricultural marketplace. 
      User query: "${query}". Respond in language code: ${language}. Keep it brief and helpful.`;

            const response = await this.client!.models.generateContent({
                model: this.modelName,
                contents: prompt,
            });

            return response.text || "I am unable to assist at the moment.";
        } catch (error) {
            console.error("Support response error:", error);
            throw error;
        }
    }

    async searchAndRespond(prompt: string): Promise<any> {
        this.checkApiKey();
        
        try {
            // Priority 1: AI with Google Search Grounding for live data
            const response = await this.client!.models.generateContent({
                model: this.modelName,
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }]
                }
            });

            return response.text || "";
        } catch (error: any) {
            // Check for Rate Limit / Quota Exceeded (429)
            if (error?.message?.includes('429') || error?.status === 429 || error?.message?.includes('RESOURCE_EXHAUSTED')) {
                console.warn("⚠️ Grounding quota exceeded. Retrying with base model (no search)...");
                try {
                    // Priority 2: Fallback to base model if search is limited
                    const response = await this.client!.models.generateContent({
                        model: this.modelName,
                        contents: prompt
                    });
                    return response.text || "";
                } catch (retryError) {
                    console.error("❌ Base model fallback also failed:", retryError);
                    return "";
                }
            }

            console.error("Search error:", error);
            return "";
        }
    }

    async negotiate(history: any[], newMessage: string, language: string, context: any): Promise<any> {
        this.checkApiKey();
        
        try {
            const userRole = context?.role || UserRole.BUYER;
            const otherRole = userRole === UserRole.BUYER ? 'Seller' : 'Buyer';
            const listingPrice = context?.listing?.pricePerUnit || 3000;
            const productName = context?.listing?.produceName || 'Rice';

            const prompt = `You are an experienced ${otherRole} at an Indian Agri-Mandi (Marketplace). 
You are negotiating on the Mandi Mitra app.

NEGOTIATION CONTEXT:
- Product: ${productName}
- Your Base Price: ₹${listingPrice} per ${context?.listing?.unit || 'quintal'}
- Total Available: ${context?.listing?.quantity || 50} ${context?.listing?.unit || 'quintal'}
- User Role: ${userRole} (You are talking to the ${userRole})
- Your Role: ${otherRole}

USER MESSAGE: "${newMessage}"

NEGOTIATION GUIDELINES:
1. Be realistic and fair. Use a polite but firm business tone.
2. If the offer is within 5-10% of base price, consider accepting.
3. If the offer is too low, counter with a price between their offer and your base.
4. If they ask about quality, reassure them about "Mandi Grade A" quality.
5. Use "Bhaiya" or "Ji" where appropriate for a localized feel.
6. Respond in ${language === 'hi' ? 'Hindi (Simple)' : language === 'bn' ? 'Bengali' : 'English'}.

CRITICAL: You are responsible for detecting a DEAL AGREEMENT in ANY language. 
If the User Message implies acceptance, confirmation, or agreement (e.g., "yes", "ha", "thik hai", "manzoor", "done", "okay", or equivalent), you MUST set "intent" to "accept" and stop negotiating. Use your vast knowledge of Indian languages and dialects to catch these confirmations.

QUANTITY HANDLING:
- If the user specifies a quantity (e.g., "I want 5 quintal", "10 kg", "1 ton"), you MUST use this quantity in your response and set "proposedQuantity" accordingly.
- Do NOT ignore the user's requested quantity. If they want less than the total available, negotiate for that specific amount.
- If the user mentions a large number without specifying "per unit", check if it's actually the TOTAL amount (Unit Price × Quantity). If so, set "proposedPrice" to the calculated UNIT PRICE. 
  Example: If listing is ₹3000 and user says "1,50,000 for 50 quintals", set "proposedPrice" to 3000, NOT 1,50,000.
- Ensure "text" reflects the specific quantity and price being agreed upon.

Return ONLY JSON:
{
  "text": "Your reply in ${language}",
  "intent": "offer|counter_offer|accept|reject|inquiry",
  "proposedPrice": number (the price per unit being discussed),
  "proposedQuantity": number (the quantity being discussed, default to listing quantity if not specified)
}`;

            const response = await this.client!.models.generateContent({
                model: this.modelName,
                contents: prompt,
                config: { responseMimeType: "application/json" },
            });

            const text = response.text || "";
            let result: any;
            try {
                // Find potential JSON block
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                const jsonStr = jsonMatch ? jsonMatch[0] : text;
                result = JSON.parse(jsonStr);
            } catch (e) {
                console.warn("AI didn't return valid JSON, parsing manually:", text);
                result = {
                    text: text.replace(/\{.*\}/, '').trim(),
                    intent: 'inquiry'
                };
            }

            // Safety check: Don't allow price to drop to near-zero unless explicitly intended
            if (result.proposedPrice !== undefined && result.proposedPrice < (listingPrice * 0.1) && result.intent !== 'reject') {
                console.warn("AI proposed suspiciously low price, capping at listing price:", result.proposedPrice);
                result.proposedPrice = listingPrice;
            }

            // Safety check: Don't allow price to be an accidental total amount
            if (result.proposedPrice !== undefined && result.proposedQuantity !== undefined) {
                // If proposed price is suspiciously high (e.g. > 5x listing price)
                // but matches total price (approx), it's likely an error.
                if (result.proposedPrice > (listingPrice * 5)) {
                    const expectedTotal = listingPrice * result.proposedQuantity;
                    if (Math.abs(result.proposedPrice - expectedTotal) / expectedTotal < 0.1) {
                        console.info("AI returned total amount as unit price. Auto-correcting.");
                        result.proposedPrice = Math.round(result.proposedPrice / result.proposedQuantity);
                    }
                }
            }

            console.log(`✅ AI responding to ${userRole}:`, result);
            return result;
        } catch (error) {
            console.error("❌ Negotiation AI error:", error);
            throw error;
        }
    }
}

export const geminiService = new GeminiService();
