# .kiro Directory

This directory contains Kiro AI configuration, steering files, and feature specifications for the MandiLink AI project.

## Structure

### `/steering`
Steering files provide context-aware guidance to Kiro AI when working on specific parts of the codebase.

- **project-overview.md**: High-level project description and architecture
- **coding-standards.md**: TypeScript, React, and code organization standards
- **testing-guidelines.md**: Testing philosophy and best practices
- **voice-features.md**: Voice assistant and speech integration guide
- **multilingual-support.md**: Translation and language support guide
- **marketplace-features.md**: Marketplace and trading features guide
- **ai-services.md**: AI service integration patterns

### `/specs`
Feature specifications following the spec-driven development methodology. Each spec contains:
- `requirements.md`: User stories and acceptance criteria
- `design.md`: Technical design and correctness properties
- `tasks.md`: Implementation task list

### `/settings`
Configuration files for Kiro AI features (MCP servers, hooks, etc.)

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
