# TaskFlow SaaS

Full-stack task and project management application.

## Features

- User authentication (email + password)
- Projects with ownership and status
- Tasks with status, priority, assignee, and due dates
- Dashboard with real-time metrics
- Role-based access (user / admin)
- Admin overview of all projects
- Seed data for immediate demo
- Clean, documented codebase with domain logic

## Tech Stack

- Next.js 14 (App Router)
- Prisma + SQLite
- NextAuth.js
- Tailwind CSS
- TypeScript

## Quick Start

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
- `prisma/` – Database schema and seed script
- `lib/` – Shared utilities and auth configuration

## License

MIT License
