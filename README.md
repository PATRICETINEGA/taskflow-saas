# TaskFlow SaaS

Complete full-stack task and project management platform.

## Features

- User authentication (email + password)
- Projects with ownership
- Tasks with status, priority, assignee, and due dates
- Dashboard with project and task metrics
- Role-based access (user / admin)
- Seed data for immediate demo

## Tech Stack

- Next.js 14 (App Router)
- Prisma + SQLite
- NextAuth.js
- Tailwind CSS
- TypeScript

## Setup

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Open http://localhost:3000

### Demo accounts

| Role  | Email              | Password   |
|-------|--------------------|------------|
| Admin | admin@taskflow.app | admin123   |
| User  | demo@taskflow.app  | demo123    |

## Project Structure

- `app/` – Next.js App Router pages and API routes
- `prisma/` – Database schema and seed
- `lib/` – Shared utilities and auth config

This is a production-ready codebase with real domain logic, ready for white-label customization or further development.
