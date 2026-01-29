# .kiro Directory

This directory contains Kiro AI configuration, steering files, and feature specifications for the Mandi Mitra project.

## About Mandi Mitra

Mandi Mitra (Market Friend) is a voice-first multilingual agricultural trade platform that connects farmers (sellers) and buyers in India. The platform enables seamless agricultural commodity trading with support for 23 Indian languages plus English, powered by real-time AI and voice recognition.

## Structure

### `/steering`
Steering files provide context-aware guidance to Kiro AI when working on specific parts of the codebase.

- **project-overview.md**: High-level project description, tech stack, and architecture
- **coding-standards.md**: TypeScript, React, and code organization standards
- **testing-guidelines.md**: Testing philosophy and best practices
- **voice-features.md**: Voice assistant and speech integration guide
- **multilingual-support.md**: Translation and language support guide (24 languages)
- **marketplace-features.md**: Marketplace and trading features guide
- **ai-services.md**: Gemini AI service integration patterns

### `/specs`
Feature specifications following the spec-driven development methodology. Each spec contains:
- `requirements.md`: User stories and acceptance criteria
- `design.md`: Technical design and correctness properties
- `tasks.md`: Implementation task list

Currently, all initial features have been implemented. Future specs will be added here as new features are developed.

### `/settings`
Configuration files for Kiro AI features (MCP servers, hooks, etc.)

## Key Features Implemented

✅ **Voice-First Interface**: Multi-language voice recognition with automatic language detection
✅ **AI-Powered Listing Creation**: Gemini AI extracts structured data from natural language
✅ **Image Upload**: Real-time image upload with preview
✅ **Multilingual Support**: 24 languages with real-time translation
✅ **Seller Dashboard**: Create and manage listings with voice or text
✅ **Buyer Dashboard**: Browse, filter, and negotiate deals
✅ **AI Negotiation**: Real-time negotiation with AI moderation
✅ **Live Market Data**: Real-time mandi price ticker
✅ **Support Chatbot**: AI-powered customer support

## Usage

### Steering Files
Steering files are automatically included when working on matching files. For example:
- Working on `hooks/useVoiceAssistant.ts` → includes `voice-features.md`
- Working on `utils/translations.ts` → includes `multilingual-support.md`
- Working on `components/BuyerDashboard.tsx` → includes `marketplace-features.md`
- Working on `services/geminiService.ts` → includes `ai-services.md`

### Creating Specs
To create a new feature spec:
```
Ask Kiro: "Create a spec for [feature name]"
```

Kiro will guide you through:
1. Requirements gathering
2. Design documentation
3. Task breakdown
4. Implementation

### Executing Specs
To work on spec tasks:
```
Ask Kiro: "Execute task [task number] from [spec name]"
```

Or run all tasks:
```
Ask Kiro: "Run all tasks for [spec name]"
```

## Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **AI/ML**: Google Gemini AI (@google/genai) - Real-time AI everywhere
- **Speech**: Browser Web Speech API (recognition & synthesis)
- **Styling**: Tailwind CSS (utility-first)
- **State Management**: React hooks
- **Build Tool**: Vite

## Best Practices

1. **Keep steering files focused**: Each file should cover a specific domain
2. **Update steering files**: When patterns change, update the relevant steering file
3. **Use file matching**: Set `fileMatchPattern` to auto-include steering files
4. **Document decisions**: Use specs to document feature decisions and trade-offs
5. **Iterate on specs**: Refine requirements and design before implementation
6. **Real AI Only**: No mock services - all AI features use real Gemini API

## Environment Setup

Required environment variables in `.env.local`:
```
VITE_GEMINI_API_KEY=your_api_key_here
```

The app will throw a clear error on startup if the API key is missing.
