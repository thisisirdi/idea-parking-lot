# Idea Parking Lot

Idea Parking Lot is a lightweight internal thinking tool for capturing, parking, and revisiting ideas before they become projects.

It is intentionally not a task manager. The goal is to make ideas easy to save now and easier to evaluate later.

## Overview

This project gives you:

- fast idea capture
- newest-first idea listing
- an idea detail page for manual editing
- optional RICE scoring
- backend-enforced status transitions

This project does not try to be:

- a task manager
- a collaboration tool
- an AI assistant
- a full SaaS platform

## Features

### Fast capture

- Title-first input
- Optional description
- Optional RICE inputs
- Keyboard-first flow
- Default status set to `INBOX`

### Idea management

- Newest-first listing
- Detail page per idea
- Manual editing of title and description
- Manual editing of RICE inputs

### RICE scoring

RICE is computed on the server using:

`(Reach x Impact x Confidence) / Effort`

Rules:

- all four values are optional
- if any value is missing, `riceScore` is `null`
- `effort` must be greater than `0`
- the client preview is only for UX
- the backend is the source of truth

### Status transitions

Allowed transitions are enforced in backend logic.

- `INBOX -> PARKED, EXPLORING, ARCHIVED`
- `PARKED -> INBOX, EXPLORING, ARCHIVED`
- `EXPLORING -> INBOX, PARKED, IN_PROGRESS, ARCHIVED`
- `IN_PROGRESS -> EXPLORING, SHIPPED, ARCHIVED`
- `SHIPPED -> EXPLORING, ARCHIVED`
- `ARCHIVED -> INBOX, PARKED, EXPLORING`

## Project structure

If you want a quick code tour, start here:

- [`app/page.tsx`](./app/page.tsx)
- [`app/ideas/[id]/page.tsx`](./app/ideas/%5Bid%5D/page.tsx)
- [`prisma/schema.prisma`](./prisma/schema.prisma)
- [`src/domain/idea/rice.ts`](./src/domain/idea/rice.ts)
- [`src/domain/idea/idea-status.rules.ts`](./src/domain/idea/idea-status.rules.ts)

## Database

The app is designed to use PostgreSQL.

This repository includes a Docker Compose file for a local Postgres app database:

- [`compose.yaml`](./compose.yaml)

That setup is included for convenience, but users are encouraged to create and run their own Docker containers or connect to their own PostgreSQL instance if that better fits their environment.

The only requirement is that `DATABASE_URL` points to a reachable PostgreSQL database.

## How to run

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a local `.env` file:

```env
DATABASE_URL="postgresql://idea_parking_lot:idea_parking_lot@localhost:5434/idea_parking_lot?schema=public"
```

You can copy the example:

```bash
cp .env.example .env
```

### 3. Start PostgreSQL

If you want to use the included Docker setup:

```bash
npm run db:up
```

To inspect logs:

```bash
npm run db:logs
```

To stop the included container:

```bash
npm run db:down
```

If you prefer your own Postgres container or local database, use that instead and update `DATABASE_URL`.

### 4. Generate Prisma client

```bash
npx prisma generate
```

### 5. Push the schema

```bash
npx prisma db push
```

### 6. Seed sample data

```bash
npm run db:seed
```

### 7. Start the app

```bash
npm run dev
```

Open:

- [http://localhost:3000](http://localhost:3000)

## Common workflow

For everyday local development:

```bash
npm run db:up
npm run dev
```

When the schema changes:

```bash
npx prisma db push
```

When you want fresh demo data:

```bash
npm run db:seed
```

When you are done:

```bash
npm run db:down
```

## Validation

Run the main checks with:

```bash
npm run typecheck
npm run test
npm run build
```

## Considerations

### Short term

The current implementation stays intentionally small. The product is optimized for fast capture, simple review, and clean backend rules rather than advanced workflow features.

The codebase is structured as a modular monolith so the domain rules stay separate from HTTP and database concerns without introducing unnecessary enterprise-style boilerplate.

### Long term

The current boundaries make it easier to add auth, AI-assisted refinement, filtering, or a broader SaaS model later without rewriting the core idea logic.

The Docker Compose setup is useful for a predictable local app database, but it is not meant to force one environment on every developer. The project should stay flexible enough to work with any standard PostgreSQL setup.

## Notes

- Archived ideas remain visible by design.
- The app keeps `riceScore` server-owned.
- The test suite currently focuses on domain and service logic.
- The future AI service files are placeholders only and are not wired into the UI or API.
