# Mandi Mitra - Complete Features Summary

**Last Updated**: January 31, 2026  
**Version**: v3.0.9-SIMPLE

## 🎯 Core Platform Features

### 1. Voice-First Interface
- **Browser Web Speech API** for recognition and synthesis
- Hands-free interaction for farmers and buyers
- Real-time voice transcription
- Text-to-speech in 24 languages
- **Files**: `hooks/useVoiceAssistant.ts`, `components/VoiceIndicator.tsx`

### 2. Multilingual Support (24 Languages)
- **23 Indian Languages**: Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Urdu, Kannada, Odia, Malayalam, Punjabi, Assamese, Maithili, Sanskrit, Konkani, Manipuri, Nepali, Bodo, Dogri, Kashmiri, Santali, Sindhi
- **Plus English**
- Real-time translation during negotiations
- Language-specific voice selection
- RTL support for Urdu, Kashmiri, Sindhi
- **Files**: `utils/translations.ts`, `constants.ts`

### 3. AI-Powered Features (Google Gemini AI)

#### a. Listing Extraction
- Convert voice/text to structured listing data
- Supports all 24 languages automatically
- Extracts: produce name, quantity, unit, price, quality
- **Service**: `geminiService.extractListingData()`

#### b. Negotiation Assistant
- Real-time negotiation in any language
- Intent detection (offer, counter-offer, accept, reject)
- **Role-Aware Logic**: Correctly handles buyer vs seller perspectives
- Simplified prompts for better responses
- **Service**: `geminiService.negotiate()`

#### c. Content Moderation
- Detects inappropriate content
- Flags price deviations (>50% from market)
- Scam risk identification
- Advisory messages
- **Service**: `geminiService.moderateMessage()`

#### d. Support Chatbot
- AI-powered customer support
- Responds in user's language
- Context-aware assistance
- **Service**: `geminiService.generateSupportResponse()`

#### e. Live Price Fetching ⭐ NEW
- **AI searches Google** for current mandi prices
- Sources: AGMARKNET, government portals, agricultural websites
- Returns structured JSON with price data
- **Smart 1-hour caching** to minimize API calls
- **Fallback chain**: AI fetch → Cached data → Mock data
- No extra API keys needed (uses existing Gemini key)
- **Service**: `geminiService.searchAndRespond()`, `mandiService.getMarketPrice()`

### 4. Profile & History Dashboard ⭐ NEW

#### Features
- **Transaction History Tab**: All completed deals (buying/selling)
- **Conversation History Tab**: All past negotiations
- **User-Specific Filtering**: Shows only relevant data
- **Conversation Reopening**: Click to continue negotiating
- **Deal Status Tracking**: Completed, ongoing, rejected
- **Multilingual**: All labels translated

#### Access
- Click navbar avatar (shows last 2 digits of phone number)
- Or click "Profile & History" text button (desktop)

#### Files
- `components/ProfileHistory.tsx` - Main UI component
- `components/ProfileHistoryWrapper.tsx` - Context wrapper with filtering
- `types.ts` - ConversationHistory interface

### 5. Shared Listings System ⭐ NEW

#### Features
- **Global State Management**: React Context API
- **Real-Time Sync**: Seller creates → Buyer sees immediately
- **Persistent Storage**: localStorage with auto save/load
- **Combined Data**: Mock listings + User-created listings
- **Transaction Tracking**: All completed deals
- **Conversation History**: All negotiation messages

#### Data Flow
```
Seller creates listing
  ↓
addListing() called in ListingsContext
  ↓
State updates + localStorage saves
  ↓
All components re-render
  ↓
Buyer sees new listing immediately
```

#### Files
- `contexts/ListingsContext.tsx` - Global state provider
- `App.tsx` - Wrapped with ListingsProvider

### 6. Live Market Ticker ⭐ NEW

#### Features
- **AI-Powered Prices**: Fetches live prices using Gemini AI
- **Auto-Scrolling**: Infinite horizontal scroll animation
- **Price Trends**: Up/down/stable indicators with % change
- **Smart Caching**: Uses 1-hour cached data
- **Hover to Pause**: Better readability
- **Fallback**: Shows mock data if AI fails

#### Display
- Commodity name
- Market location
- Modal price (₹/quintal)
- Price range (min-max)
- Trend indicator (▲▼—)
- Percentage change

#### Files
- `components/LiveMarketTicker.tsx`
- `services/mandiService.ts`

## 📱 User Dashboards

### Seller Dashboard
**Component**: `components/SellerDashboard.tsx`

#### Features
- Create listings (voice or manual)
- View active listings (synced globally)
- Upload product images (multi-image support)
- View AI-powered live market prices
- Track negotiations
- Access profile & history via navbar avatar
- View listing history and past conversations

#### Tabs
1. **My Listings**: Active listings
2. **Negotiations**: Active deals

### Buyer Dashboard
**Component**: `components/BuyerDashboard.tsx`

#### Features
- Browse all listings (mock + user-created)
- Filter by commodity, location, price
- View AI-powered live market trends
- Initiate negotiations
- Complete purchases
- Generate invoices
- Access profile & history via navbar avatar
- View transaction history
- Reopen previous negotiations

#### Tabs
1. **Browse**: All available listings
2. **My Deals**: Active negotiations

## 🤝 Negotiation System

### Features
- Real-time messaging
- Voice message support
- Auto-translation between languages
- AI intent detection
- Price suggestions
- Deal closure
- Conversation history saved

### Flow
```
Buyer makes offer
  ↓
AI detects intent & moderates
  ↓
Seller receives translated message
  ↓
Seller counter-offers
  ↓
AI analyzes price deviation
  ↓
Buyer accepts/rejects
  ↓
Deal completed or continues
  ↓
Saved to conversation history
```

### Files
- `components/NegotiationView.tsx`
- `services/geminiService.ts`

## 📊 Market Data System

### AI-Powered Price Fetching

#### How It Works
1. **Check Cache**: Look for cached price (1-hour expiration)
2. **AI Fetch**: If expired, Gemini AI searches Google for current price
3. **Parse Response**: Extract structured JSON from AI response
4. **Cache Result**: Save for 1 hour
5. **Fallback**: Use mock data if AI fails

#### Price Sources
- AGMARKNET (agmarknet.gov.in)
- Government agriculture portals
- Major agricultural market websites
- Recent news articles

#### Expected Price Ranges (₹/quintal)
| Commodity | Min | Max |
|-----------|-----|-----|
| Onion | ₹500 | ₹3000 |
| Potato | ₹400 | ₹1500 |
| Tomato | ₹800 | ₹3000 |
| Wheat | ₹1800 | ₹2500 |
| Rice | ₹2500 | ₹5000 |
| Cotton | ₹5000 | ₹7000 |
| Soybean | ₹4000 | ₹5500 |

#### Files
- `services/mandiService.ts` - Price fetching with caching
- `services/geminiService.ts` - searchAndRespond method

## 🔧 Technical Architecture

### State Management
- **Local State**: React useState for component state
- **Global State**: React Context API (ListingsContext)
- **Persistence**: localStorage for sessions, listings, transactions
- **Session**: 24-hour expiration

### Data Storage (localStorage)

#### Keys
- `user_session` - User profile and session data
- `mandi_listings` - All listings (mock + user-created)
- `mandi_transactions` - Completed deals
- `mandi_conversations` - Negotiation history
- `mandi_price_cache` - Cached market prices (1-hour TTL)

### API Integration
- **Google Gemini AI**: All AI features (single API key)
- **Model**: gemini-2.5-flash
- **Quota**: 20 requests/day (free tier)
- **Caching**: Minimizes API calls

### Error Handling
- Try-catch for all async operations
- Graceful fallbacks (AI → Cache → Mock)
- User-friendly error messages
- Console logging for debugging
- Offline support

## 📁 File Structure

```
mandi-mitra/
├── components/
│   ├── BuyerDashboard.tsx          # Buyer interface
│   ├── SellerDashboard.tsx         # Seller interface
│   ├── NegotiationView.tsx         # Chat interface
│   ├── OnboardingFlow.tsx          # User registration
│   ├── ProfileHistory.tsx          # History dashboard ⭐
│   ├── ProfileHistoryWrapper.tsx   # Context wrapper ⭐
│   ├── LiveMarketTicker.tsx        # Live prices ⭐
│   ├── ListingCard.tsx             # Listing display
│   ├── ImageGallery.tsx            # Multi-image viewer
│   ├── VoiceIndicator.tsx          # Voice feedback
│   ├── SupportChatbot.tsx          # AI support
│   ├── AIModeratorAlert.tsx        # Moderation alerts
│   └── ErrorBoundary.tsx           # Error handling
├── contexts/
│   └── ListingsContext.tsx         # Global state ⭐
├── services/
│   ├── geminiService.ts            # Gemini AI ⭐
│   ├── mandiService.ts             # Market data ⭐
│   ├── invoiceService.ts           # Invoice generation
│   ├── analyticsService.ts         # Event tracking
│   └── cloudinaryService.ts        # Image upload
├── hooks/
│   ├── useVoiceAssistant.ts        # Voice features
│   └── useOnlineStatus.ts          # Network status
├── utils/
│   ├── translations.ts             # 24 languages ⭐
│   └── location.ts                 # Location utils
├── data/
│   └── mockData.ts                 # Mock listings
├── types.ts                        # TypeScript types
├── constants.ts                    # App constants
└── App.tsx                         # Main app
```

## 🚀 Recent Updates (January 2026)

### ✅ Completed Features
1. **AI-Powered Live Prices** - Real-time mandi price fetching with Gemini AI
2. **Smart Price Caching** - 1-hour cache to minimize API calls
3. **Profile & History Dashboard** - Transaction and conversation history
4. **Shared Listings System** - Global state with React Context
5. **Conversation Reopening** - Continue previous negotiations
6. **Navbar Profile Access** - Click avatar to access profile
7. **Live Market Ticker** - Auto-scrolling price display

### 🔧 Technical Improvements
- Simplified Gemini prompts (60% shorter)
- Better JSON parsing with fallbacks
- Enhanced error handling
- Improved caching strategy
- TypeScript type safety improvements

## 📊 API Usage & Quotas

### Gemini API (Free Tier)
- **Limit**: 20 requests per day
- **Model**: gemini-2.5-flash
- **Caching**: Reduces API calls significantly
- **Fallbacks**: Always available (cache + mock data)

### Optimization Strategies
1. **Price Caching**: 1-hour TTL reduces price fetch calls
2. **Listing Extraction**: Only on user action
3. **Negotiation**: Only during active chats
4. **Support**: Only when chatbot opened
5. **Moderation**: Only on message send

## 🎯 Future Enhancements

### Potential Features
- Payment gateway integration
- GPS-based location detection
- Push notifications for deals
- Advanced analytics dashboard
- Seller ratings and reviews
- Bulk listing upload
- Export transaction reports
- Mobile app (React Native)

### Technical Improvements
- Upgrade to paid Gemini tier for production
- Implement WebSocket for real-time updates
- Add unit and integration tests
- Set up CI/CD pipeline
- Performance monitoring
- A/B testing framework

## 📝 Documentation

### Available Docs
- `README.md` - Main project documentation
- `.kiro/steering/*.md` - Development guidelines
- `PROFILE_HISTORY_FEATURE.md` - Profile feature docs
- `PROFILE_HISTORY_USAGE.md` - Usage guide
- `SHARED_LISTINGS_FEATURE.md` - Listings system docs
- `LIVE_PRICES_SETUP.md` - Price fetching setup
- `AI_PRICE_TESTING_RESULTS.md` - Testing results
- `VOICE_MULTILANG_IMPLEMENTATION.md` - Voice features

## 🤝 Contributing

Follow the coding standards in `.kiro/steering/coding-standards.md`:
- TypeScript strict typing
- React functional components
- Tailwind CSS for styling
- Error boundaries for components
- Comprehensive error handling

---

**Made with ❤️ for Indian farmers and agricultural traders**

**Mandi Mitra** - Your Market Friend 🌾
