# 🌾 Mandi Mitra (Market Friend)


  **Voice-First Multilingual Agricultural Trade Platform**
  
  Connecting farmers and buyers across India with AI-powered negotiations in 24 languages
</div>

---

## 🎯 Overview

Mandi Mitra is a revolutionary agricultural marketplace that enables seamless commodity trading between farmers (sellers) and buyers across India. Built with voice-first interaction and multilingual support, it breaks down language barriers and makes agricultural trade accessible to everyone.

### ✨ Key Features

- 🎤 **Voice-First Interface** - Hands-free interaction using browser speech recognition
- 🌍 **24 Languages** - Support for 23 Indian languages + English
- 🤖 **AI-Powered Negotiation** - Real-time negotiation assistance using Google Gemini AI
- 📊 **Live Market Data** - AI-powered real-time mandi price fetching with 1-hour caching
- 💬 **Smart Moderation** - AI content moderation and price deviation detection
- 📸 **Image Gallery** - Multi-image support for product listings
- 📱 **Mobile-First Design** - Responsive design optimized for mobile devices
- 🔒 **Offline Support** - Works with limited connectivity and offline queue
- 📄 **Invoice Generation** - Automatic invoice creation with PDF export
- 📜 **Profile & History** - Transaction and conversation history for buyers and sellers
- 🔄 **Shared Listings** - Real-time sync between sellers and buyers with global state management
- ⭐ **Rating System** - Rate users after deals (1-5 stars with reviews)
- ❤️ **Favorites** - Save and filter favorite listings
- 📤 **Share Listings** - Share via WhatsApp, SMS, or native share
- 📊 **Analytics Dashboard** - View deals, revenue, and activity charts
- 🗑️ **Delete Listings** - Remove your own listings with confirmation
- ⬅️ **Back Navigation** - Navigate back from all chat views
- 🔢 **Bengali Numerals** - Support for Bengali and Devanagari numerals
- 🛡️ **Fallback Systems** - Work without AI using pattern matching

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v20 or later)
- **Google Gemini API Key** - Get yours at [Google AI Studio](https://aistudio.google.com/app/apikey)
- **Microphone** - For voice features (optional but recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mandilink-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

---

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **AI/ML**: Google Gemini AI (@google/genai)
- **Speech**: Browser Web Speech API (recognition & synthesis)
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Build Tool**: Vite

---

## 📁 Project Structure

```
mandilink-ai/
├── components/          # React components
│   ├── BuyerDashboard.tsx
│   ├── SellerDashboard.tsx
│   ├── NegotiationView.tsx
│   ├── OnboardingFlow.tsx
│   ├── ProfileHistory.tsx         # Profile & history dashboard
│   ├── ProfileHistoryWrapper.tsx  # Context wrapper for history
│   ├── LiveMarketTicker.tsx       # AI-powered live prices
│   └── ...
├── services/           # External service integrations
│   ├── geminiService.ts      # Google Gemini AI
│   ├── mandiService.ts       # AI-powered market data
│   ├── invoiceService.ts     # Invoice generation
│   └── ...
├── contexts/           # React Context providers
│   └── ListingsContext.tsx   # Global state for listings
├── hooks/              # Custom React hooks
│   ├── useVoiceAssistant.ts  # Voice features
│   └── useOnlineStatus.ts
├── utils/              # Utility functions
│   ├── translations.ts       # Multilingual support (24 languages)
│   └── location.ts
├── data/               # Mock data
│   └── mockData.ts
├── types.ts            # TypeScript type definitions
├── constants.ts        # App constants
└── App.tsx             # Main app component
```

---

## 🎤 Voice Features

### Supported Languages

**Indian Languages** (23):
Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Urdu, Kannada, Odia, Malayalam, Punjabi, Assamese, Maithili, Sanskrit, Konkani, Manipuri, Nepali, Bodo, Dogri, Kashmiri, Santali, Sindhi

**Plus**: English

### Voice Capabilities

- **Voice Input**: Speak to create listings, negotiate deals, and navigate
- **Voice Output**: AI responses in your language
- **Real-time Translation**: Automatic translation between languages
- **Offline Support**: Voice recognition works without internet

### Microphone Setup

1. When prompted, click **Allow** to grant microphone access
2. If blocked, click the 🔒 lock icon in the address bar
3. Change Microphone permission to **Allow**
4. Refresh the page

---

## 🤖 AI Features

### Powered by Google Gemini AI

1. **Listing Extraction** - Convert voice/text to structured listing data in any Indian language
2. **Negotiation Assistant** - AI-powered negotiation in any language
3. **Content Moderation** - Detect inappropriate content and scams
4. **Price Analysis** - Compare with market prices and flag deviations
5. **Support Chatbot** - AI-powered customer support
6. **Live Price Fetching** - AI searches web for current mandi prices from reliable sources (AGMARKNET, government portals)

### API Configuration

The app uses **Google Gemini 2.5 Flash** model for optimal performance and quota limits.

Current version: `v3.0.9-SIMPLE`

### Live Price System

- **AI-Powered**: Gemini AI searches Google for current wholesale mandi prices
- **Smart Caching**: Prices cached for 1 hour to minimize API calls
- **Reliable Sources**: Fetches from AGMARKNET, government portals, agricultural market websites
- **Fallback Chain**: AI fetch → Cached data → Mock data (always works)
- **No Extra Keys**: Uses existing Gemini API key

---

## 👥 User Roles

### 🌾 Seller (Farmer)
- Create product listings (voice or manual)
- Upload product images
- View AI-powered live market prices
- Negotiate with buyers
- Track active deals
- View listing history and past conversations
- Access profile dashboard via navbar avatar

### 🛒 Buyer
- Browse available listings (mock + user-created)
- Filter by commodity, location, price
- View AI-powered market trends and live prices
- Negotiate with sellers
- Complete purchases
- Generate invoices
- View transaction history and past conversations
- Reopen and continue previous negotiations
- Access profile dashboard via navbar avatar

---

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key | ✅ Yes |

---

## 🐛 Troubleshooting

### Common Issues

**1. Old version loading (v3.0.3-FINAL instead of v3.0.9-SIMPLE)**
- Stop dev server (Ctrl+C)
- Delete `dist/` folder
- Restart: `npm run dev`
- Hard refresh browser: Ctrl+Shift+R

**2. 429 API Quota Exceeded**
- Free tier: 20 requests/day for gemini-2.5-flash
- Price caching (1 hour) minimizes API calls
- Wait for quota reset or upgrade to paid tier
- App falls back to cached/mock data automatically
- Or get a new API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

**3. Microphone not working**
- Check browser permissions (click lock icon in address bar)
- Verify microphone is connected and enabled in Windows settings
- Try a different browser (Chrome/Edge recommended)

**4. "Let's continue" responses from AI**
- Make sure you're running v3.0.9-SIMPLE (check console)
- Restart dev server to load latest code
- Clear browser cache

---

## 📝 Recent Updates

### Latest Features (January 31, 2026)
- ✅ **Delete Listings** - Sellers can remove their own listings with confirmation
- ✅ **Back Navigation** - Back buttons in all chat and negotiation views
- ✅ **Bengali Numeral Support** - Extract Bengali (৩০০০) and Devanagari (०१२) numerals
- ✅ **Fallback Systems** - Chat and deal completion work without AI
- ✅ **Enhanced Error Handling** - Better error messages in user's language

### Previous Updates (January 2026)
- ✅ **Rating System** - Rate users after deals (1-5 stars with reviews)
- ✅ **Favorites/Bookmarks** - Save and filter favorite listings
- ✅ **Share Listings** - Share via WhatsApp, SMS, or native share
- ✅ **PDF Export** - Download invoices as PDF
- ✅ **Analytics Dashboard** - View deals, revenue, and activity charts
- ✅ **Offline Queue** - Queue actions when offline, auto-sync when online
- ✅ **AI-Powered Live Prices** - Real-time mandi price fetching using Gemini AI with Google Search
- ✅ **Smart Price Caching** - 1-hour cache to minimize API calls and improve performance
- ✅ **Profile & History Dashboard** - Transaction and conversation history for all users
- ✅ **Shared Listings System** - Global state management with React Context API
- ✅ **Conversation Reopening** - Continue previous negotiations from history
- ✅ **Navbar Profile Access** - Click avatar (showing phone digits) to access profile

### v3.0.9-SIMPLE
- ✅ Simplified to single Gemini model (`gemini-2.5-flash`)
- ✅ Removed complex fallback logic
- ✅ Improved negotiation prompts
- ✅ Better error handling
- ✅ Enhanced debugging logs

### v3.0.8-PROMPT-SIMPLIFY
- Simplified AI prompts (60% shorter)
- Better JSON parsing with fallbacks
- Enhanced debugging visibility

### v3.0.6-QUOTA-FIX
- Fixed quota/model issues
- Added exponential backoff for errors
- Improved error messages

---

## 📊 Project Status

- **Version**: 1.5.0
- **Build Size**: 638 KB (168 KB gzipped)
- **TypeScript Errors**: 0
- **Production Ready**: ✅ Yes
- **Features Complete**: 14/21 (67% - all client-side features)
- **Last Updated**: January 31, 2026

### Feature Completion

**✅ Implemented (14 features)**
1. Voice Interface (24 languages)
2. AI Negotiation
3. Live Market Prices
4. Listings Management
5. Profile & History
6. Rating System
7. Favorites/Bookmarks
8. Share Listings
9. PDF Export
10. Analytics Dashboard
11. Offline Queue
12. Delete Listings
13. Back Navigation
14. Bengali Numerals
15. Fallback Systems


---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Follow the coding standards in `.kiro/steering/coding-standards.md`
4. Test your changes thoroughly
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🔗 Links

- **Google Gemini API**: https://ai.google.dev/gemini-api/docs
- **Get API Key**: https://aistudio.google.com/app/apikey

---

## 💡 Support

For issues, questions, or feature requests:
1. Check the troubleshooting section above
2. Review the documentation in `.kiro/steering/`
3. Open an issue on GitHub

---

<div align="center">
  Made with ❤️ for Indian farmers and agricultural traders
  
  **Mandi Mitra** - Your Market Friend
</div>
