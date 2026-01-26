# Mandi Mitra - Project Overview

## Project Description
Mandi Mitra (Market Friend) is a voice-first multilingual agricultural trade platform that connects farmers (sellers) and buyers in India. The platform enables seamless agricultural commodity trading with support for 23 Indian languages plus English.

## Core Features
- **Voice-First Interface**: Voice assistant for hands-free interaction
- **Multilingual Support**: 23 Indian languages + English with real-time translation
- **Dual Dashboards**: Separate interfaces for sellers (farmers) and buyers
- **Live Market Data**: Real-time mandi (agricultural market) price information
- **AI-Powered Negotiation**: Gemini AI for intent detection and moderation
- **Image Gallery**: Multi-image support for product listings
- **Offline Support**: Works with limited connectivity
- **Session Management**: 24-hour session persistence
- **Support Chatbot**: AI-powered customer support

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
- Mobile-first responsive design
- Accessibility compliance
- Minimal, clean UI with floating pill navigation
- Gradient backgrounds (orange-emerald theme)
- Error boundaries for graceful error handling
