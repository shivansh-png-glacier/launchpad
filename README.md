# LaunchPad

AI-assisted project management workspace.

## Current milestone: M02 — Database + Authentication

Implemented:
- Prisma 7 PostgreSQL schema
- Auth.js credentials authentication
- Password hashing with bcryptjs
- Registration and login pages
- JWT-backed sessions
- Protected dashboard
- User-owned project/task queries
- Server-side ownership boundary foundation

## Local setup

1. Install Node.js 22.12+.
2. Copy `.env.example` to `.env`.
3. Add a PostgreSQL connection string.
4. Generate `AUTH_SECRET` with `npx auth secret`.
5. Install dependencies with `npm install`.
6. Run `npm run db:migrate -- --name init`.
7. Run `npm run db:generate`.
8. Start with `npm run dev`.

The app should then be available at `http://localhost:3000`.

## Next milestone

M03 — Application shell + dashboard polish.
