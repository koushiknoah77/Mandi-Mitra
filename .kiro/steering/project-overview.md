# Mandi Mitra - Project Overview

## Project Description
Mandi Mitra (Market Friend) is a voice-first multilingual agricultural trade platform that connects farmers (sellers) and buyers in India. The platform enables seamless agricultural commodity trading with support for 23 Indian languages plus English, powered by real-time AI and voice recognition.

## Core Features

### Voice-First Interface
- **Multi-language voice recognition**: Automatic detection of ANY Indian language
- **Hands-free interaction**: Complete listing creation via voice
- **Browser Web Speech API**: Native speech recognition and synthesis
- **Confidence scoring**: Selects best transcription from multiple alternatives
- **Automatic fallback**: Falls back to Hindi if primary language unsupported

### AI-Powered Features
- **Listing extraction**: Gemini AI extracts structured data from natural language
- **Language detection**: Automatically detects which Indian language was spoken
- **Negotiation assistance**: AI-powered negotiation with intent detection
- **Content moderation**: Flags inappropriate content and price deviations
- **Support chatbot**: Multilingual AI customer support
- **Real-time processing**: All AI responses generated in real-time (no mocks)

### Multilingual Support
- **24 languages**: 23 Indian languages + English
- **Real-time translation**: Automatic translation during negotiations
- **Native script support**: Devanagari, Bengali, Telugu, Tamil, Gujarati, etc.
- **RTL language support**: Urdu, Kashmiri, Sindhi
- **Voice in any language**: Speak in any supported language, AI detects automatically

### Marketplace Features
- **Seller Dashboard**: Create and manage listings with voice or text
- **Buyer Dashboard**: Browse, filter, and negotiate deals
- **Image upload**: Real-time image upload with correct preview display
- **Live market data**: Real-time mandi price ticker
- **AI negotiation**: Real-time negotiation with translation
- **Deal closure**: Invoice generation and deal tracking

## Technology Stack
- **Frontend**: React 19 + TypeScript + Vite
- **AI/ML**: Google Gemini AI (@google/genai) - Real-time AI everywhere
- **Speech**: Browser Web Speech API (speech recognition & synthesis)
- **Styling**: Tailwind CSS (utility-first)
- **State Management**: React hooks
- **Build Tool**: Vite

## Key User Roles
1. **Seller (Farmer)**: Creates listings, manages inventory, negotiates deals
2. **Buyer**: Browses listings, makes offers, completes purchases

## Project Structure
- `/components`: React components (dashboards, onboarding, chat, etc.)
- `/services`: External service integrations (Gemini, Bhashini, Cloudinary, etc.)
- `/hooks`: Custom React hooks (voice assistant, online status)
- `/utils`: Utility functions (translations, location)
- `/data`: Mock data for development
- `/types.ts`: TypeScript type definitions
- `/constants.ts`: Application constants and configuration

## Development Commands
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## Environment Variables
- `VITE_GEMINI_API_KEY`: Required for all AI features (set in .env.local)
  - App will throw error on startup if missing
  - No mock fallbacks - real AI only

## Design Principles
- **Voice-first**: Optimized for voice interaction
- **Mobile-first**: Responsive design for mobile devices
- **Accessibility**: WCAG compliance with screen reader support
- **Minimal UI**: Clean interface with floating pill navigation
- **Gradient backgrounds**: Orange-emerald theme
- **Error boundaries**: Graceful error handling
- **Offline support**: Works with limited connectivity
- **Real AI**: No mocks - all AI features use real Gemini API

## Recent Implementations

### ✅ Multi-Language Voice Detection (Latest)
- Automatic language detection for ANY Indian language
- Enhanced voice recognition with confidence scoring
- Gemini AI detects language from transcribed text
- Supports 23+ Indian languages without pre-selection

### ✅ Image Upload Fix
- Fixed bug where random images were shown instead of uploaded photos
- Now uses `URL.createObjectURL()` to display actual uploaded files
- Real-time preview of uploaded images

### ✅ Listings Display
- Added "My Listings" tab to Seller Dashboard
- Shows all created listings with images, details, and actions
- Empty state with call-to-action when no listings exist
- Auto-switches to listings tab after publishing

## Performance Characteristics
- Voice recognition latency: ~1-2 seconds
- AI processing time: ~2-3 seconds
- Total time (speak to display): ~3-5 seconds
- Accuracy: 90%+ for clear speech
- Build size: ~568 KB (gzipped: ~147 KB)

## Browser Compatibility
- ✅ Chrome/Edge: Full support (recommended)
- ✅ Safari: Good support
- ⚠️ Firefox: Limited speech recognition support

## Future Enhancements
- Offline data synchronization
- Payment gateway integration
- Advanced search and filtering
- Seller analytics dashboard
- Push notifications
- Quality verification from images
- Logistics integration
- Weather and crop advisories
