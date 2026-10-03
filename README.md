# LaunchPad

> From idea to execution.

LaunchPad is an AI-powered project and team workspace designed to help individuals and small teams turn ideas into structured, actionable projects.

It combines project management, task tracking, milestones, search, and AI assistance in one workspace.

## Features

- 🔐 User registration and authentication
- 📊 Personal project dashboard
- 📁 Project creation and management
- ✅ Task management with status and priority
- 🎯 Milestones
- 🤖 AI Project Planner
- 💬 AI Project Assistant
- 🔎 Project and task search
- 🛡️ Project ownership and authorization
- 📈 Dashboard progress statistics
- 📝 Activity tracking
- 🧪 Unit and end-to-end testing
- 📱 Responsive interface

## AI Features

### AI Project Planner

Describe an idea or goal and LaunchPad can generate a structured project plan containing:

- Project information
- Milestones
- Tasks
- Task priorities

The generated plan is saved directly to the user's workspace.

### AI Project Assistant

Inside a project, users can ask questions about their actual project data, including:

- What should I work on next?
- Project summaries
- Potential blockers
- High-priority work

The assistant uses the project's tasks, milestones, and other project information as context.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma
- Auth.js
- Google Gemini API
- Zod
- Vitest
- Playwright
- Vercel

## Project Structure

LaunchPad/
├── prisma/
│   └── schema.prisma
├── public/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── login/
│   │   └── register/
│   ├── components/
│   ├── generated/
│   ├── lib/
│   └── auth.ts
├── tests/
│   ├── dashboard.spec.ts
│   └── smoke.test.ts
├── .env.example
├── next.config.ts
├── package.json
├── playwright.config.ts
├── prisma.config.ts
├── tsconfig.json
└── vitest.config.ts