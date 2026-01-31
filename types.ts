// Language Types
export type SupportedLanguageCode = 
  | 'hi' | 'bn' | 'te' | 'mr' | 'ta' | 'gu' | 'ur' | 'kn' | 'or' | 'ml' 
  | 'pa' | 'as' | 'mai' | 'sa' | 'kok' | 'mni' | 'ne' | 'brx' | 'doi' 
  | 'ks' | 'sat' | 'sd' | 'en';

export interface LanguageConfig {
  code: SupportedLanguageCode;
  name: string;
  nativeName: string;
  bhashiniCode: string;
}

// Bhashini Service Types
export interface TranscribeResponse {
  transcription: string;
  language: string;
}

export interface TranslateResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface BatchTranslateResponse {
  translations: Record<string, string>; // language code -> translated text
}

export interface SynthesisResponse {
  audioContent: string; // Base64 encoded audio
  language: string;
}

// Gemini AI Types
export interface ListingData {
  produceName: string;
  quantity: number;
  unit: string; // e.g., kg, quintal, ton
  pricePerUnit: number;
  currency: string;
  quality: string; // low, medium, high
  description: string;
}

export interface NegotiationIntent {
  type: 'offer' | 'counter_offer' | 'accept' | 'reject' | 'inquiry' | 'casual' | 'deal_closure';
  price?: number;
  unit?: string;
  confidence: number;
}

export interface ModerationResult {
  flagged: boolean;
  reason?: string; // 'inappropriate', 'price_deviation', 'scam_risk'
  priceDeviationPct?: number; // Percentage difference from market price
  advisory?: string; // Advice for the user
}

// User Types
export enum UserRole {
  SELLER = 'seller',
  BUYER = 'buyer',
}

export interface UserProfile {
  id: string;
  name: string;
  state: string;
  phoneNumber: string;
  role: UserRole | null;
  language: SupportedLanguageCode;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
}

// Onboarding Types
export type OnboardingStep = 'welcome' | 'language' | 'role' | 'details';

export interface VoiceState {
  isSpeaking: boolean;
  isListening: boolean;
  isProcessing: boolean;
  lastTranscript: string;
}

// Marketplace Types
export interface Listing extends ListingData {
  id: string;
  sellerId: string;
  sellerName: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  imageUrl?: string; // Main image (legacy support)
  images?: string[]; // Gallery images
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  translation?: string; // Translated text for the viewer
  timestamp: number;
  isAudio?: boolean;
}

// Mandi Data Types
export interface MandiRecord {
  commodity: string;
  market: string;
  modalPrice: number; // Average price
  minPrice: number;
  maxPrice: number;
  lastUpdated: string;
  trend?: 'up' | 'down' | 'stable';
  change?: number; // Percentage change
}

export interface PriceInsight {
  marketPrice: number;
  deviationPercentage: number;
  status: 'fair' | 'high' | 'low';
}

// Deal & Invoice Types
export interface Deal {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  finalPrice: number;
  finalQuantity: number;
  totalAmount: number;
  status: 'pending' | 'completed';
  timestamp: number;
  invoiceUrl?: string;
  produceName?: string;
  unit?: string;
}

// Conversation History Types
export interface ConversationHistory {
  id: string;
  listingId: string;
  listing: Listing;
  messages: Message[];
  participants: {
    buyerId: string;
    buyerName: string;
    sellerId: string;
    sellerName: string;
  };
  lastMessageAt: number;
  dealStatus: 'active' | 'completed' | 'cancelled';
  deal?: Deal;
}

// Support Chat Types
export interface SupportMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
}

// Analytics Types
export interface AnalyticsEvent {
  eventName: string;
  userId?: string;
  properties?: Record<string, any>;
  timestamp: number;
}

// Web Speech API Types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}