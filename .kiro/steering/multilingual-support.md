---
inclusion: fileMatch
fileMatchPattern: "{utils/translations.ts,constants.ts,components/**/*}"
---

# Multilingual Support Guide

## Supported Languages
Mandi Mitra supports 24 languages:
- 23 Indian languages (Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Urdu, Kannada, Odia, Malayalam, Punjabi, Assamese, Maithili, Sanskrit, Konkani, Manipuri, Nepali, Bodo, Dogri, Kashmiri, Santali, Sindhi)
- English

## Language Configuration
**File**: `constants.ts`

Each language has:
- `code`: ISO language code
- `name`: English name
- `nativeName`: Native script name
- `bhashiniCode`: Bhashini API language code

## Translation System
**File**: `utils/translations.ts`

### Adding New Translations
```typescript
export const TRANSLATIONS: Record<string, Record<SupportedLanguageCode, string>> = {
  'newKey': {
    en: 'English text',
    hi: 'हिन्दी पाठ',
    // ... other languages
  }
};
```

### Using Translations
```typescript
import { getLabel } from './utils/translations';

const text = getLabel('keyName', currentLanguage);
```

## Voice Support

### Speech Recognition
- Uses browser Web Speech API
- Language mapping in `SPEECH_LANG_MAP`
- Fallback to Hindi/English for unsupported languages
- BCP 47 language tags (e.g., 'hi-IN', 'en-IN')

### Text-to-Speech
- Browser Web Speech API for all languages
- Native support for Indian languages
- Language-specific voice selection
- Works offline

## Best Practices

### UI Text
- Always use `getLabel()` for user-facing text
- Never hardcode strings in components
- Provide translations for all supported languages
- Use English as fallback

### Voice Interactions
- Detect user's language preference early
- Allow language switching at any time
- Provide visual feedback during voice processing
- Handle language detection errors gracefully

### Translation Quality
- Keep translations concise for UI elements
- Use culturally appropriate terms
- Test with native speakers when possible
- Maintain consistent terminology

### RTL Language Support
- Urdu, Kashmiri, Sindhi are RTL languages
- Use CSS logical properties (start/end vs left/right)
- Test layout with RTL languages
- Mirror icons and directional elements

### Accessibility
- Provide language labels in native script
- Use `lang` attribute on HTML elements
- Support screen readers in all languages
- Ensure keyboard navigation works with all scripts

## Language Selection Flow
1. User selects language during onboarding
2. Language stored in user profile
3. All UI updates to selected language
4. Voice assistant uses selected language
5. Translations happen in real-time during negotiations

## Testing Multilingual Features
- Test with multiple language combinations
- Verify translation accuracy
- Test voice input/output in different languages
- Check UI layout with different scripts
- Validate RTL language rendering
- Test language switching during active sessions
