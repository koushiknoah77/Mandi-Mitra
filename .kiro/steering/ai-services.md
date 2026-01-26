---
inclusion: fileMatch
fileMatchPattern: "services/**/*"
---

# AI Services Integration Guide

## Gemini AI Service
**File**: `services/geminiService.ts`

### Capabilities
- Listing data extraction from voice/text
- Negotiation intent detection
- Content moderation
- Price deviation analysis
- Support chatbot responses

### Usage Patterns
```typescript
// Extract listing from natural language
const listing = await geminiService.extractListingData(transcript, language);

// Detect negotiation intent
const intent = await geminiService.detectNegotiationIntent(message, context);

// Moderate content
const moderation = await geminiService.moderateContent(message, marketPrice);

// Support chat
const response = await geminiService.getSupportResponse(query, language);
```

### Error Handling
- Always wrap Gemini calls in try-catch
- Provide fallback responses for failures
- Log errors with context for debugging
- Handle rate limiting gracefully

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
