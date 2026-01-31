# .kiro Directory

This directory contains Kiro AI configuration, steering files, and feature specifications for the Mandi Mitra project.

## Structure

### `/steering`
Steering files provide context-aware guidance to Kiro AI when working on specific parts of the codebase.

- **project-overview.md**: High-level project description and architecture
- **coding-standards.md**: TypeScript, React, and code organization standards
- **testing-guidelines.md**: Testing philosophy and best practices
- **voice-features.md**: Voice assistant and speech integration guide
- **multilingual-support.md**: Translation and language support guide (24 languages)
- **marketplace-features.md**: Marketplace, trading, profile & history features guide
- **ai-services.md**: AI service integration patterns (Gemini AI, live prices, etc.)

### `/specs`
Feature specifications following the spec-driven development methodology. Each spec contains:
- `requirements.md`: User stories and acceptance criteria
- `design.md`: Technical design and correctness properties
- `tasks.md`: Implementation task list

### `/settings`
Configuration files for Kiro AI features (MCP servers, hooks, etc.)

## Recent Features (January 2026)

### AI-Powered Live Prices
- Real-time mandi price fetching using Gemini AI with Google Search
- Smart 1-hour caching to minimize API calls
- Fallback chain: AI → Cache → Mock data
- Sources: AGMARKNET, government portals, agricultural websites
- **Files**: `services/mandiService.ts`, `services/geminiService.ts`

### Profile & History Dashboard
- Transaction history for buyers and sellers
- Conversation history with deal status tracking
- Reopen and continue previous negotiations
- Access via navbar avatar (phone number digits)
- **Files**: `components/ProfileHistory.tsx`, `components/ProfileHistoryWrapper.tsx`

### Shared Listings System
- Global state management with React Context API
- Real-time sync: seller creates → buyer sees immediately
- Persistent storage in localStorage
- Combines mock + user-created listings
- **Files**: `contexts/ListingsContext.tsx`

### Multilingual Support
- 24 languages (23 Indian + English)
- Voice input/output in all languages
- Real-time translation during negotiations
- **Files**: `utils/translations.ts`, `constants.ts`

## Usage

### Steering Files
Steering files are automatically included when working on matching files. For example:
- Working on `hooks/useVoiceAssistant.ts` → includes `voice-features.md`
- Working on `utils/translations.ts` → includes `multilingual-support.md`
- Working on `components/BuyerDashboard.tsx` → includes `marketplace-features.md`

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

## Best Practices

1. **Keep steering files focused**: Each file should cover a specific domain
2. **Update steering files**: When patterns change, update the relevant steering file
3. **Use file matching**: Set `fileMatchPattern` to auto-include steering files
4. **Document decisions**: Use specs to document feature decisions and trade-offs
5. **Iterate on specs**: Refine requirements and design before implementation
