import { LanguageConfig, SupportedLanguageCode } from './types';

// Supported Indian Languages + English
export const SUPPORTED_LANGUAGES: Record<SupportedLanguageCode, LanguageConfig> = {
  hi: { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', bhashiniCode: 'hi' },
  bn: { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', bhashiniCode: 'bn' },
  te: { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', bhashiniCode: 'te' },
  mr: { code: 'mr', name: 'Marathi', nativeName: 'मराठी', bhashiniCode: 'mr' },
  ta: { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', bhashiniCode: 'ta' },
  gu: { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', bhashiniCode: 'gu' },
  ur: { code: 'ur', name: 'Urdu', nativeName: 'اردو', bhashiniCode: 'ur' },
  kn: { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', bhashiniCode: 'kn' },
  or: { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', bhashiniCode: 'or' },
  ml: { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', bhashiniCode: 'ml' },
  pa: { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', bhashiniCode: 'pa' },
  as: { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', bhashiniCode: 'as' },
  mai: { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', bhashiniCode: 'mai' },
  sa: { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', bhashiniCode: 'sa' },
  kok: { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', bhashiniCode: 'kok' },
  mni: { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্', bhashiniCode: 'mni' },
  ne: { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', bhashiniCode: 'ne' },
  brx: { code: 'brx', name: 'Bodo', nativeName: 'बड़ो', bhashiniCode: 'brx' },
  doi: { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', bhashiniCode: 'doi' },
  ks: { code: 'ks', name: 'Kashmiri', nativeName: 'کٲشُر', bhashiniCode: 'ks' },
  sat: { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', bhashiniCode: 'sat' },
  sd: { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', bhashiniCode: 'sd' },
  en: { code: 'en', name: 'English', nativeName: 'English', bhashiniCode: 'en' },
};

export const DEFAULT_LANGUAGE: SupportedLanguageCode = 'hi';

// Bhashini API Configuration (Use environment variables in production)
export const BHASHINI_API_URL = 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline';

// Browser Speech API Language Mapping (BCP 47 tags)
export const SPEECH_LANG_MAP: Record<SupportedLanguageCode, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  bn: 'bn-IN',
  te: 'te-IN',
  mr: 'mr-IN',
  ta: 'ta-IN',
  gu: 'gu-IN',
  ur: 'ur-IN',
  kn: 'kn-IN',
  or: 'or-IN',
  ml: 'ml-IN',
  pa: 'pa-IN',
  as: 'as-IN', // Might fallback to hi/en in some browsers
  mai: 'hi-IN', // Fallback
  sa: 'hi-IN', // Fallback
  kok: 'gom-IN', // Konkani
  mni: 'mni-IN', 
  ne: 'ne-NP',
  brx: 'hi-IN', // Fallback
  doi: 'hi-IN', // Fallback
  ks: 'ks-IN',
  sat: 'hi-IN', // Fallback
  sd: 'sd-IN',
};