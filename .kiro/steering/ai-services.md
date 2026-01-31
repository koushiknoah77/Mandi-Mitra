---
inclusion: fileMatch
fileMatchPattern: "services/**/*"
---

# AI Services Integration Guide

## Gemini AI Service
**File**: `services/geminiService.ts`

### Capabilities
- Listing data extraction from voice/text in any Indian language
- Negotiation intent detection
- Content moderation
- Price deviation analysis
- Support chatbot responses
- **Live price fetching with Google Search** (searchAndRespond method)

### Usage Patterns
```typescript
// Extract listing from natural language (any Indian language)
const listing = await geminiService.extractListingData(transcript, language);

// Detect negotiation intent
const intent = await geminiService.detectNegotiationIntent(message, context);

// Moderate content
const moderation = await geminiService.moderateContent(message, marketPrice);

// Support chat
const response = await geminiService.getSupportResponse(query, language);

// Search and respond (for live price fetching)
const result = await geminiService.searchAndRespond(prompt);
```

### Live Price Fetching
The `searchAndRespond` method enables AI-powered web search for current mandi prices:
- Uses Gemini AI to search Google for reliable price data
- Returns structured JSON with price information
- Sources: AGMARKNET, government portals, agricultural websites
- No additional API keys needed (uses existing Gemini key)

### Error Handling
- Always wrap Gemini calls in try-catch
- Provide fallback responses for failures
- Log errors with context for debugging
- Handle rate limiting gracefully (20 requests/day free tier)
- Implement caching to minimize API calls

## Speech Services
**File**: `services/bhashiniService.ts`

### Browser Web Speech API
- Uses native browser speech recognition and synthesis
- Excellent support for Indian languages
- No external API calls needed for speech
- Works offline for speech recognition

### Capabilities
- Speech-to-text (23 Indian languages via browser)
- Text-to-speech synthesis (browser voices)
- Real-time voice recognition
- Language-specific voice selection

### Usage Patterns
```typescript
// Browser speech recognition is handled in useVoiceAssistant hook
// Text-to-speech uses browser's SpeechSynthesis API
// No mock implementations - uses real browser APIs

### Real AI Only
- No mock services - all AI features use real Gemini API
- App requires `VITE_GEMINI_API_KEY` environment variable
- Throws clear error on startup if API key is missing
- All responses are generated in real-time by Gemini AI

## Mandi Service (Market Data)
**File**: `services/mandiService.ts`

### AI-Powered Price Fetching
Uses Gemini AI to fetch live agricultural commodity prices from the web.

### Features
- **Live Price Fetching**: AI searches Google for current mandi prices
- **Smart Caching**: 1-hour cache in localStorage to minimize API calls
- **Reliable Sources**: AGMARKNET, government portals, agricultural websites
- **Fallback Chain**: AI fetch → Cached data → Mock data
- **Price Validation**: Sanity checks for reasonable price ranges

### Usage Patterns
```typescript
// Get single commodity price (with AI + caching)
const price = await mandiService.getMarketPrice('Onion', 'Maharashtra');
// Returns: { commodity, market, modalPrice, minPrice, maxPrice, lastUpdated }

// Get multiple live rates for ticker
const rates = await mandiService.getLiveRates();
// Returns array of MandiRecord with trend indicators

// Clear cache (for testing or forcing refresh)
mandiService.clearCache();

// Calculate price insight
const insight = mandiService.calculateInsight(listingPrice, marketPrice);
// Returns: { marketPrice, deviationPercentage, status: 'fair'|'high'|'low' }
```

### Caching Strategy
```typescript
// Cache structure in localStorage
{
  "mandi_price_cache": {
    "onion": {
      "data": { /* MandiRecord */ },
      "timestamp": 1706700000000
    }
  }
}
```

### Price Fetching Flow
```
1. Check cache (key: commodity.toLowerCase())
2. If cached and < 1 hour old → return cached data
3. If expired or not cached:
   a. Ask Gemini AI to search Google for current price
   b. AI returns structured JSON with price data
   c. Cache result for 1 hour
   d. Return price data
4. If AI fails → return mock data as fallback
```

### Expected Price Ranges (₹/quintal)
- Onion: ₹500 - ₹3000
- Potato: ₹400 - ₹1500
- Tomato: ₹800 - ₹3000
- Wheat: ₹1800 - ₹2500
- Rice: ₹2500 - ₹5000
- Cotton: ₹5000 - ₹7000
- Soybean: ₹4000 - ₹5500

## Voice Assistant Hook
**File**: `hooks/useVoiceAssistant.ts`

### Features
- Voice recording and transcription
- Text-to-speech playback
- Language-aware processing
- State management (listening, speaking, processing)

### Integration
```typescript
const {
  startListening,
  stopListening,
  speak,
  voiceState
} = useVoiceAssistant(language);
```

## Best Practices

### API Key Management
- Store API keys in `.env.local`
- Never commit API keys to version control
- Use environment variables in production
- Rotate keys regularly

### Performance
- Cache translation results when possible
- Debounce voice input processing
- Use streaming for long responses
- Implement request queuing for rate limits

### Error Recovery
- Retry failed requests with exponential backoff
- Provide user feedback during processing
- Fall back to text input if voice fails
- Log errors for monitoring

### Language Support
- Always pass language code to AI services
- Use `SUPPORTED_LANGUAGES` constant for validation
- Handle unsupported languages gracefully
- Provide English fallback when needed

### Testing AI Services
- Mock AI responses in tests
- Test error scenarios
- Verify language handling
- Test rate limiting behavior
- Validate response parsing
