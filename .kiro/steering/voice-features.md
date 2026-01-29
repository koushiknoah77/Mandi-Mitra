---
inclusion: fileMatch
fileMatchPattern: "{hooks/useVoiceAssistant.ts,components/VoiceIndicator.tsx,services/bhashiniService.ts}"
---

# Voice Features Guide

## Voice Assistant Hook
**File**: `hooks/useVoiceAssistant.ts`

### Core Functionality
- Voice recording and transcription with automatic language detection
- Text-to-speech synthesis in multiple languages
- Multi-language processing with confidence scoring
- State management for voice interactions

### Latest Implementation: Multi-Language Auto-Detection
The voice assistant now automatically detects ANY Indian language without requiring pre-selection:

- **Automatic Language Detection**: Detects 23+ Indian languages automatically
- **Confidence Scoring**: Uses `maxAlternatives: 3` to get multiple transcription options
- **Best Transcript Selection**: Selects transcript with highest confidence score
- **Automatic Fallback**: Falls back to Hindi if primary language unsupported
- **Gemini AI Integration**: AI detects language from transcribed text

### Voice States
```typescript
interface VoiceState {
  isSpeaking: boolean;    // TTS is playing
  isListening: boolean;   // Recording audio
  isProcessing: boolean;  // Transcribing/processing
  lastTranscript: string; // Last recognized text
}
```

### Usage Pattern
```typescript
const {
  state: voiceState,
  speak,
  listen,
  cancel
} = useVoiceAssistant(language);

// Listen for voice input (auto-detects language)
const transcript = await listen();

// Speak text in specified language
await speak("Hello farmer", language);

// Cancel ongoing speech/listening
cancel();
```

### Multi-Language Detection Flow
1. User clicks microphone → Recording starts
2. User speaks in ANY language → Browser captures audio
3. Speech recognition → Converts to text with confidence scores
4. Best transcript selected → Highest confidence score wins
5. Gemini AI processes → Detects language and extracts data
6. Result displayed → Normalized data shown in UI

## Voice Indicator Component
**Component**: `components/VoiceIndicator.tsx`

### Visual Feedback
- Animated microphone icon when listening
- Pulsing effect during processing
- Speaker icon when speaking
- Color-coded states (green=listening, blue=speaking, orange=processing)

### Accessibility
- ARIA labels for screen readers
- Keyboard shortcuts
- Visual and audio feedback
- Status announcements

## Speech Recognition

### Browser Support
- Chrome/Edge: Excellent support
- Firefox: Limited support
- Safari: Good support on iOS
- Fallback to text input if unavailable

### Language Detection
- Uses `SPEECH_LANG_MAP` for BCP 47 tags
- Automatic language switching
- Fallback languages for unsupported scripts

### Best Practices
- Request microphone permission early
- Provide clear visual feedback
- Handle permission denials gracefully
- Test across browsers
- Implement timeout for long silences

## Text-to-Speech

### Browser Web Speech API
- Uses native browser speech synthesis
- Excellent support for Indian languages
- Language-specific voice selection
- Works offline
- No external API calls needed

### Voice Selection
- Automatically selects best voice for language
- Adjustable speech rate and pitch
- Handles voice availability gracefully
- Falls back to default voice if needed

### Audio Playback
```typescript
// Play audio from base64
const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
await audio.play();
```

## Voice Commands

### Onboarding
- Language selection by voice
- Role selection (buyer/seller)
- Profile information input

### Listing Creation
- Describe product by voice
- Specify quantity and price
- Add quality details

### Negotiation
- Voice offers and counter-offers
- Accept/reject deals
- Ask questions

### Navigation
- Voice commands for navigation (future)
- Search by voice
- Filter listings by voice

## Error Handling

### Common Issues
- Microphone permission denied
- No speech detected
- Network errors during transcription
- TTS service unavailable
- Unsupported language

### Recovery Strategies
- Prompt for permission again
- Provide text input alternative
- Show error messages in user's language
- Retry with exponential backoff
- Fall back to browser APIs

## Performance Optimization

### Audio Processing
- Use Web Audio API for better control
- Implement noise cancellation
- Compress audio before upload
- Stream long audio responses

### Latency Reduction
- Start processing while recording
- Preload TTS voices
- Cache common phrases
- Use WebSocket for real-time transcription

## Testing Voice Features

### Manual Testing
- Test with different accents
- Verify language switching
- Check background noise handling
- Test on mobile devices
- Verify offline behavior

### Automated Testing
- Mock Web Speech API
- Test state transitions
- Verify error handling
- Test permission flows
- Validate audio playback

## Accessibility Considerations

### Visual Impairment
- Screen reader announcements
- Audio feedback for actions
- Voice-first navigation
- Descriptive error messages

### Hearing Impairment
- Visual indicators for voice states
- Text alternatives for audio
- Captions for voice messages
- Vibration feedback (mobile)

### Motor Impairment
- Hands-free operation
- Voice commands for all actions
- Large touch targets
- Adjustable timing

## Privacy and Security

### Audio Data
- Don't store raw audio unnecessarily
- Encrypt audio in transit
- Clear audio buffers after processing
- Respect user privacy preferences

### Permissions
- Request only when needed
- Explain why permission is needed
- Respect denial gracefully
- Allow permission revocation
