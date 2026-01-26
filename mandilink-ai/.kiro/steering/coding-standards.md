# Coding Standards

## TypeScript Guidelines
- Use strict TypeScript typing - avoid `any` types
- Define interfaces in `types.ts` for shared types
- Use type imports: `import type { TypeName } from './types'`
- Prefer interfaces over type aliases for object shapes
- Use enums for fixed sets of values (e.g., `UserRole`)

## React Best Practices
- Use functional components with hooks
- Implement error boundaries for component trees
- Use `React.memo()` for expensive components
- Keep components focused and single-responsibility
- Extract reusable logic into custom hooks

## Component Structure
```typescript
// 1. Imports (React, types, hooks, components, utils)
// 2. Interface/type definitions (props, state)
// 3. Component definition
// 4. Hooks (useState, useEffect, custom hooks)
// 5. Event handlers
// 6. Render logic
// 7. Export
```

## File Naming
- Components: PascalCase (e.g., `BuyerDashboard.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useVoiceAssistant.ts`)
- Services: camelCase with `Service` suffix (e.g., `geminiService.ts`)
- Utils: camelCase (e.g., `translations.ts`)
- Types: camelCase (e.g., `types.ts`)

## State Management
- Use `useState` for local component state
- Use `useEffect` for side effects and lifecycle
- Store user session in localStorage with expiration
- Use context sparingly - prefer prop drilling for clarity

## Styling
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use semantic color names from Tailwind palette
- Maintain consistent spacing scale (4px base unit)
- Use gradient backgrounds: `from-orange-50 via-white to-emerald-50`

## Error Handling
- Wrap components in ErrorBoundary
- Use try-catch for async operations
- Log errors to console with context
- Provide user-friendly error messages
- Graceful degradation for offline scenarios

## Accessibility
- Use semantic HTML elements
- Include ARIA labels for interactive elements
- Ensure keyboard navigation support
- Maintain sufficient color contrast
- Provide text alternatives for audio/visual content

## Performance
- Lazy load components when appropriate
- Optimize images (use Cloudinary service)
- Minimize re-renders with React.memo
- Use debouncing for expensive operations
- Implement offline caching strategies

## Code Organization
- Keep files under 300 lines when possible
- Extract complex logic into utility functions
- Group related functionality in services
- Use barrel exports for cleaner imports
- Maintain clear separation of concerns
