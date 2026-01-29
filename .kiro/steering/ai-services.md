---
inclusion: fileMatch
fileMatchPattern: "services/**/*"
---

# AI Services Integration Guide

## Gemini AI Service
**File**: `services/geminiService.ts`

### Capabilities
- **Listing data extraction**: Extracts structured data from natural language in ANY Indian language
- **Automatic language detection**: Detects which language was spoken (hi, bn, te, ta, mr, gu, etc.)
- **Multi-script support**: Handles Devanagari, Bengali, Telugu, Tamil, Gujarati, and other scripts
- **Negotiation intent detection**: Analyzes negotiation messages for intent
- **Content moderation**: Flags inappropriate content and price deviations
- **Price deviation analysis**: Compares prices against market rates
- **Support chatbot**: Multilingual AI customer support responses

### Latest Implementation: Multi-Language Extraction
The Gemini service now automatically detects and processes ANY Indian language:

```typescript
// Extract listing from natural language in ANY language
const listing = await geminiService.extractListingData(transcript);
// Returns: { produceName, quantity, unit, pricePerUnit, detectedLanguage, ... }
```

**Key Features**:
- Automatically detects language from text (no language parameter needed)
- Translates produce names to English (e.g., "চাল" → "Rice", "प्याज" → "Onion")
- Extracts numbers from any script (Devanagari, Bengali, Telugu, Tamil, etc.)
- Handles units in any language (quintal/क्विंटल/কুইন্টাল, kg/किलो/কেজি)
- Returns detected language code for tracking

**Supported Languages**: Hindi, Bengali, Telugu, Tamil, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Urdu, English, and 10+ more

### Usage Patterns
```typescript
// Extract listing from natural language (auto-detects language)
const listing = await geminiService.extractListingData(transcript);

// Detect negotiation intent
const intent = await geminiService.detectNegotiationIntent(message, context);

// Moderate content
const moderation = await geminiService.moderateContent(message, marketPrice);

// Support chat in specific language
const response = await geminiService.getSupportResponse(query, language);
```

### Error Handling
- Always wrap Gemini calls in try-catch
- Provide fallback responses for failures
- Log errors with context for debugging
- Handle rate limiting gracefully
- Show user-friendly error messages in their language

## Speech Services
**File**: `services/bhashiniService.ts`

### Browser Web Speech API
- Uses native browser speech recognition and synthesis
- Excellent support for Indian languages
- No external API calls needed for speech
- Works offline for speech recognition

### Capabilities
- **Speech-to-text**: 23 Indian languages via browser
- **Text-to-speech synthesis**: Browser voices in multiple languages
- **Real-time voice recognition**: Instant transcription
- **Language-specific voice selection**: Automatically selects best voice
- **Multi-alternative transcription**: Gets multiple options with confidence scores

### Usage Patterns
```typescript
// Browser speech recognition is handled in useVoiceAssistant hook
// Text-to-speech uses browser's SpeechSynthesis API
// No mock implementations - uses real browser APIs
```

### Real AI Only
- No mock services - all AI features use real Gemini API
- App requires `VITE_GEMINI_API_KEY` environment variable
- Throws clear error on startup if API key is missing
- All responses are generated in real-time by Gemini AI

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
