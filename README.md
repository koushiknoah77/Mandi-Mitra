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
- 📊 **Live Market Data** - Real-time mandi (agricultural market) price information
- 💬 **Smart Moderation** - AI content moderation and price deviation detection
- 📸 **Image Gallery** - Multi-image support for product listings
- 📱 **Mobile-First Design** - Responsive design optimized for mobile devices
- 🔒 **Offline Support** - Works with limited connectivity
- 📄 **Invoice Generation** - Automatic invoice creation for completed deals

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
│   └── ...
├── services/           # External service integrations
│   ├── geminiService.ts      # Google Gemini AI
│   ├── mandiService.ts       # Market data
│   ├── invoiceService.ts     # Invoice generation
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useVoiceAssistant.ts  # Voice features
│   └── useOnlineStatus.ts
├── utils/              # Utility functions
│   ├── translations.ts       # Multilingual support
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

1. **Listing Extraction** - Convert voice/text to structured listing data
2. **Negotiation Assistant** - AI-powered negotiation in any language
3. **Content Moderation** - Detect inappropriate content and scams
4. **Price Analysis** - Compare with market prices and flag deviations
5. **Support Chatbot** - AI-powered customer support

### API Configuration

The app uses **Google Gemini 2.5 Flash** model for optimal performance and quota limits.

Current version: `v3.0.9-SIMPLE`

---

## 👥 User Roles

### 🌾 Seller (Farmer)
- Create product listings (voice or manual)
- Upload product images
- View market prices
- Negotiate with buyers
- Track active deals

### 🛒 Buyer
- Browse available listings
- Filter by commodity, location, price
- View market trends
- Negotiate with sellers
- Complete purchases
- Generate invoices

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
- Wait 15-60 minutes for quota reset
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

### v3.0.9-SIMPLE (Latest)
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
