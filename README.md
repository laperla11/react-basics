# User Management — React Architecture Demo

A small, presenter-friendly React application that demonstrates the principles in **Modern React Development: Architecture, Patterns & Best Practices**.

## Stack

- React 19 + TypeScript
- Vite
- TanStack Query for server-state fetching, caching and invalidation
- React Hook Form + Zod for form handling and validation
- A simulated asynchronous API backed by browser localStorage (no backend required)

## Run locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To check a production build:

```bash
npm run build
npm run preview
```

## Suggested 4-minute demo

1. **Initial query (about 45 sec):** refresh the page and point out the simulated loading state, then the users list. Explain that `UserList` does not know how the data is fetched.
2. **Search and filter (about 30 sec):** search by name/email and filter by role. This is local UI state, so it stays in the page.
3. **Validation (about 60 sec):** choose Add user, submit an empty form, then enter an invalid email. Show Zod messages connected through `zodResolver`.
4. **Mutation and cache sync (about 60 sec):** create a valid user. Explain that the mutation calls the service and invalidates `['users']`, so TanStack Query refreshes the list.
5. **Edit / error state (about 45 sec):** edit a row, or use Presenter controls → Simulate API error, then retry.

## Architecture

```text
src/
├── app/                         # App composition
├── features/users/
│   ├── components/               # Page, toolbar, list, form, layout
│   ├── hooks/                    # TanStack Query hooks and mutations
│   ├── schemas/                  # Zod validation schema
│   ├── services/                 # Simulated API + seed JSON
│   └── types/                    # Domain types
└── shared/components/            # Reusable modal
```

## Presenter controls

- **Simulate API error** makes the next users query fail once. Use Retry to demonstrate error recovery.
- **Reset demo data** clears localStorage and restores the seed data on the next query.
- Search for a value that does not exist to show the empty-result state.

This is intentionally a front-end demonstration, not a production-ready access management system. Authentication, authorisation, real persistence, automated tests and server-side validation are outside its scope. A real backend must validate every incoming request independently.
