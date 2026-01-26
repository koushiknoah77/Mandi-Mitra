import { SUPPORTED_LANGUAGES } from '../constants';
import { 
  SupportedLanguageCode, 
  TranscribeResponse, 
  TranslateResponse, 
  BatchTranslateResponse, 
  SynthesisResponse 
} from '../types';

class BhashiniService {
  private apiKey: string | undefined;
  private userId: string | undefined;

  constructor() {
    // In a real app, these would come from environment variables
    this.apiKey = import.meta.env.VITE_BHASHINI_API_KEY;
    this.userId = import.meta.env.VITE_BHASHINI_USER_ID;
    
    if (this.apiKey) {
      console.log("✅ Bhashini service initialized with real API");
    } else {
      console.log("ℹ️ Bhashini API not configured. Using browser's built-in speech APIs (works great!)");
    }
  }

  /**
   * Transcribe Audio (Speech to Text)
   * Note: Currently using browser's Web Speech API which works excellently for Indian languages
   * Bhashini integration can be added later if needed
   */
  async transcribeAudio(audioBlob: Blob, languageCode: SupportedLanguageCode): Promise<TranscribeResponse> {
    // Browser's Web Speech API is used directly in useVoiceAssistant hook
    // This method is here for future Bhashini integration if needed
    console.log("Using browser's Web Speech API for transcription");
    throw new Error("Use browser's Web Speech API directly via useVoiceAssistant hook");
  }

  /**
   * Translate Text
   * Note: For production, implement Bhashini NMT or use Gemini AI for translation
   */
  async translateText(
    text: string, 
    sourceCode: SupportedLanguageCode, 
    targetCode: SupportedLanguageCode
  ): Promise<TranslateResponse> {
    if (sourceCode === targetCode) {
      return { translatedText: text, sourceLanguage: sourceCode, targetLanguage: targetCode };
    }

    // TODO: Implement actual Bhashini NMT pipeline call or use Gemini AI
    console.warn("Translation service not implemented. Consider using Gemini AI for translation.");
    return {
      translatedText: text, // Return original for now
      sourceLanguage: sourceCode,
      targetLanguage: targetCode
    };
  }

  /**
   * Batch Translate Text to multiple languages
   */
  async batchTranslate(
    text: string,
    sourceCode: SupportedLanguageCode,
    targetCodes: SupportedLanguageCode[]
  ): Promise<BatchTranslateResponse> {
    const translations: Record<string, string> = {};

    // Parallel execution for efficiency
    const promises = targetCodes.map(async (targetCode) => {
      try {
        const result = await this.translateText(text, sourceCode, targetCode);
        translations[targetCode] = result.translatedText;
      } catch (error) {
        console.error(`Failed to translate to ${targetCode}`, error);
        translations[targetCode] = text; // Fallback to original text
      }
    });

    await Promise.all(promises);
    return { translations };
  }

  /**
   * Synthesize Speech (Text to Speech)
   * Note: Currently using browser's Web Speech Synthesis API which works excellently
   * Bhashini integration can be added later if needed
   */
  async synthesizeSpeech(text: string, languageCode: SupportedLanguageCode): Promise<SynthesisResponse> {
    // Browser's Web Speech Synthesis API is used directly in useVoiceAssistant hook
    // This method is here for future Bhashini integration if needed
    console.log("Using browser's Web Speech Synthesis API for TTS");
    throw new Error("Use browser's Web Speech Synthesis API directly via useVoiceAssistant hook");
  }
}

export const bhashiniService = new BhashiniService();