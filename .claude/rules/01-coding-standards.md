# React Team Coding Rules

This document defines simple and practical coding rules for React team development.  
Claude Code should follow these rules when generating or editing code.

---

## Language

- Use TypeScript.
- Avoid using `any`.
- Prefer explicit types.

Example:

type User = {
  id: string
  name: string
}

---

## Project Structure

- Use feature-based structure.

Example structure:

src/
  features/
    auth/
      components/
      hooks/
      api.ts
      types.ts
    profile/
      components/
      hooks/
  shared/
    components/
    hooks/
    utils/

- Avoid placing everything under a single `components/` directory.

---

## Components

- One component should have one responsibility.
- Separate UI, logic, and API when possible.

Example:

UserPage.tsx   // UI  
useUser.ts     // logic  
user.api.ts    // API  

---

## Hooks

- Custom hooks must start with `use`.
- Hooks must not return JSX.

Examples:

useAuth()  
useFetchUser()  

---

## State Management

- Prefer React built-in hooks:
  - useState
  - useReducer
  - useContext

- Do not introduce Redux or Zustand by default.
- Consider Zustand only if shared state becomes complex.

---

## Naming

- Components: PascalCase
- Variables / functions: camelCase
- Boolean variables should start with:
  - is
  - has
  - can

Examples:

isLoading  
hasError  
canSubmit  

---

## Imports

- Avoid deep relative imports.
- Use path aliases.

Bad:

import Button from '../../../shared/components/Button'

Good:

import Button from '@/shared/components/Button'

---

## Formatting

- Follow ESLint and Prettier.
- Do not manually format code.

---

## Do Not

- Do not add complex architecture early.
- Do not enforce strict Atomic Design.
- Do not add excessive custom rules.
- Do not push to remote repository

---

## Principle

Code should be easy to read and easy to modify.  
Team consistency is more important than personal preference.