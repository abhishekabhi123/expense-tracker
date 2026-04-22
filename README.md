# Expense Tracker

A full-stack personal expense tracking app built with Node.js/Express + React.

## Live Demo

- Frontend: https://expense-tracker-frontend-omega-eight.vercel.app
- Backend: https://expense-tracker-api-5lxl.onrender.com

## Stack

- **Backend:** Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, Zod
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Monorepo:** pnpm workspaces

## Local Setup

### Prerequisites

- Node.js v20+
- pnpm v9+
- PostgreSQL

### Run Locally

```bash
# Install all dependencies
pnpm install

# Setup backend env
cp backend/.env.example backend/.env
# Fill in your DATABASE_URL in backend/.env

# Push schema to DB
cd backend && npx prisma db push && cd ..

# Run both servers
pnpm dev:backend   # http://localhost:3000
pnpm dev:frontend  # http://localhost:5173
```

## API

| Method | Endpoint               | Description                                                   |
| ------ | ---------------------- | ------------------------------------------------------------- |
| POST   | `/expenses`            | Create a new expense                                          |
| GET    | `/expenses`            | List expenses (filter: `?category=`, sort: `?sort=date_desc`) |
| GET    | `/expenses/categories` | List distinct categories                                      |

## Key Design Decisions

### `DECIMAL(12, 2)` for money

Floating-point types (`FLOAT`, `DOUBLE`) cannot represent decimal values
like `0.1` exactly due to binary precision issues. Using Postgres `NUMERIC`
(mapped via Prisma's `Decimal`) ensures amounts like ₹199.99 are stored and
returned exactly — critical for any financial application.

### Idempotent `POST /expenses`

The frontend generates a `crypto.randomUUID()` per form submission and sends
it as `idempotencyKey`. The backend stores it with a `UNIQUE` constraint. If
the same request is retried (double-click, page refresh mid-submit, network
retry), the backend detects the duplicate key violation (`P2002`) and returns
the already-created record instead of creating a duplicate. This makes the API
safe under unreliable network conditions.

### PostgreSQL over SQLite

PostgreSQL provides native `NUMERIC` type support, is production-grade, and
has a free managed tier on Render — which is where this app is deployed.
SQLite would have worked for local development but `REAL` type in SQLite is
a floating-point, making it unsuitable for storing money.

### Prisma ORM

Type-safe queries, auto-generated client from schema, and clean migration
tracking. The schema is the single source of truth for both the DB structure
and TypeScript types.

## Trade-offs (due to timebox)

- **No authentication** — out of scope for this exercise; would use JWT +
  middleware in a production system
- **No pagination** — acceptable at this scale for a personal finance tool
- **Fixed category list on frontend** — categories are a hardcoded enum in
  the form; in production these would be user-defined and stored in a DB table
- **No automated tests** — would prioritise an integration test for the
  idempotency behaviour first (`POST` same key twice → second returns 200
  with original record)

## Intentionally Not Done

- Edit / delete expense
- Authentication / multi-user support
- Pagination
- Automated test suite
- Export to CSV
