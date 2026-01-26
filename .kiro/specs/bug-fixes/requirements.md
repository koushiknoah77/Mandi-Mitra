# Bug Fixes - Requirements

## Overview
Critical bugs have been identified that are causing the Mandi Mitra application to crash or fail to compile properly. This spec addresses all identified issues.

## Critical Issues Found

### 1. Missing TypeScript Type Definitions
**Severity**: CRITICAL - Prevents compilation
**Location**: package.json
**Issue**: Missing `@types/react` and `@types/react-dom` packages
**Impact**: TypeScript cannot resolve React types, causing implicit 'any' type errors throughout the codebase

### 2. TypeScript Configuration Issues
**Severity**: HIGH
**Location**: tsconfig.json
**Issue**: Missing React types in the "types" array
**Impact**: Even with @types packages installed, TypeScript may not properly resolve React types

### 3. Implicit 'any' Type Parameters
**Severity**: MEDIUM - Code quality issue
**Locations**: 
- `components/NegotiationView.tsx` - Multiple callback parameters (prev, msg, e)
- `components/OnboardingFlow.tsx` - Event handler parameters (e)
- `components/BuyerDashboard.tsx` - Potential type inference issues
- `components/SellerDashboard.tsx` - Potential type inference issues

**Impact**: Reduces type safety and can lead to runtime errors

### 4. Unused Import Warning
**Severity**: LOW - Code cleanliness
**Location**: `components/NegotiationView.tsx`
**Issue**: `analyticsService` imported but never used
**Impact**: Increases bundle size unnecessarily

### 5. Potential Runtime Issues
**Severity**: MEDIUM
**Locations**: Various components
**Issues**:
- Missing null checks for optional properties
- Potential undefined access in voice assistant hooks
- Browser API compatibility checks missing in some places

## User Stories

### US-1: TypeScript Compilation
**As a** developer
**I want** the application to compile without TypeScript errors
**So that** I can build and deploy the application successfully

**Acceptance Criteria**:
1.1. All TypeScript type definitions are properly installed
1.2. No implicit 'any' type errors in the codebase
1.3. `npm run build` completes successfully without errors
1.4. All React component types are properly resolved

### US-2: Type Safety
**As a** developer
**I want** explicit type annotations for all function parameters
**So that** I can catch type-related bugs at compile time

**Acceptance Criteria**:
2.1. All callback parameters have explicit types
2.2. All event handler parameters have proper React event types
2.3. No TypeScript warnings about implicit types
2.4. Type inference works correctly throughout the codebase

### US-3: Code Quality
**As a** developer
**I want** clean code without unused imports or dead code
**So that** the bundle size is optimized and code is maintainable

**Acceptance Criteria**:
3.1. No unused imports in any file
3.2. All imported modules are actually used
3.3. No dead code or unreachable statements
3.4. ESLint/TypeScript warnings are resolved

### US-4: Runtime Stability
**As a** user
**I want** the application to run without crashes
**So that** I can use all features reliably

**Acceptance Criteria**:
4.1. No runtime errors in browser console
4.2. All browser API checks are in place
4.3. Proper error boundaries catch and handle errors
4.4. Null/undefined checks prevent crashes

## Technical Requirements

### TR-1: Package Dependencies
- Install `@types/react@^19.0.0` (matching React 19.2.3)
- Install `@types/react-dom@^19.0.0` (matching React DOM 19.2.3)
- Verify all peer dependencies are satisfied

### TR-2: TypeScript Configuration
- Update tsconfig.json to include proper type references
- Ensure strict type checking is enabled where appropriate
- Configure proper module resolution

### TR-3: Type Annotations
- Add explicit types to all callback parameters
- Use proper React event types (React.ChangeEvent, React.KeyboardEvent, etc.)
- Add return type annotations where helpful for clarity

### TR-4: Code Cleanup
- Remove unused imports
- Add missing null checks
- Improve error handling

## Out of Scope
- Major refactoring of component architecture
- Adding new features
- Performance optimizations (unless directly related to bugs)
- UI/UX changes

## Success Metrics
- Zero TypeScript compilation errors
- Zero runtime errors in browser console
- Application loads and runs successfully
- All existing features work as expected
