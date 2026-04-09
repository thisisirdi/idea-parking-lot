# Idea Parking Lot

Idea Parking Lot is a lightweight internal thinking tool for capturing, parking, and revisiting ideas before they become projects.

It is intentionally not a task manager. The product is optimized for low-friction input, quick scanning, and simple evaluation using status changes and optional RICE scoring.

## What this project is

This project is a personal idea workspace.

It gives you:

- a fast capture surface
- a newest-first list of ideas
- a detail page for editing
- optional RICE scoring
- backend-enforced status transitions

It does not try to be:

- a task manager
- a roadmap tool
- a collaboration platform
- an AI writing assistant
- a full SaaS product yet

The point is to help ideas exist before they become polished.

## Goal

The goal of this project is to create a fast personal workspace where ideas can be captured in seconds, reviewed later, and shaped gradually without forcing them into a task workflow too early.

## Objectives

- Make idea capture fast enough that it does not interrupt thinking.
- Keep the initial model simple: title, optional notes, optional RICE, and status.
- Preserve clean architectural boundaries so the codebase can grow into a larger product later.
- Ensure business rules such as RICE scoring and status transitions are enforced on the backend.
- Keep the UI light and readable while staying technically maintainable.

## First-time overview

If you are seeing this repository for the first time, the practical flow is:

1. Start the dedicated PostgreSQL container with Docker.
2. Push the Prisma schema to the database.
3. Seed sample ideas.
4. Run the Next.js app.
5. Open the app and use the home page to capture ideas.

The app is intentionally small, so most of the behavior can be understood from a few files:

- [app/page.tsx](C:\Users\irdih\OneDrive\Documents\Projects\Idea Parking Lot\app\page.tsx)
- [app/ideas/[id]/page.tsx](C:\Users\irdih\OneDrive\Documents\Projects\Idea Parking Lot\app\ideas\[id]\page.tsx)
- [prisma/schema.prisma](C:\Users\irdih\OneDrive\Documents\Projects\Idea Parking Lot\prisma\schema.prisma)
- [src/domain/idea/rice.ts](C:\Users\irdih\OneDrive\Documents\Projects\Idea Parking Lot\src\domain\idea\rice.ts)
- [src/domain/idea/idea-status.rules.ts](C:\Users\irdih\OneDrive\Documents\Projects\Idea Parking Lot\src\domain\idea\idea-status.rules.ts)

## Requirements

### Product requirements

- Fast idea capture
- Newest-first idea listing
- Idea detail page
- Manual editing
- Optional RICE scoring
- Status transitions with backend validation

### Technical requirements

- Next.js App Router
- TypeScript
- PostgreSQL
- Prisma ORM
- Route Handlers for REST APIs
- Zod for request validation
- Server Components by default
- Client Components only where interactivity is required

### Environment requirements

- Node.js 20+ recommended
- npm 10+ recommended
- Docker Desktop or Docker Engine with Compose support
- A valid `DATABASE_URL`

## Architecture

The app uses a modular monolith structure with explicit layers:

- `src/domain`
  Contains core business rules such as idea types, RICE calculation, and legal status transitions.
- `src/application`
  Contains use-case services such as create, update, list, fetch, and change status.
- `src/infrastructure`
  Contains Prisma client access, repository implementation, and database-to-domain mapping.
- `src/interfaces/api`
  Contains DTOs, HTTP response helpers, and Zod validation for route boundaries.
- `src/components`
  Contains the UI building blocks used by the app pages.
- `src/future/ai`
  Contains placeholder contracts for future AI enhancement work without wiring any provider today.

This keeps Prisma from leaking into the rest of the codebase and makes future changes safer.

## Core behavior

### Capture flow

- Title is required
- Description is optional
- RICE inputs are optional
- Status defaults to `INBOX`
- The form is keyboard-first

### RICE rules

RICE is computed on the server using:

`(Reach x Impact x Confidence) / Effort`

Rules:

- If any of the four values is missing, `riceScore` becomes `null`
- `effort` must be greater than `0`
- The client preview is only for UX
- The backend is the source of truth

### Status transition rules

- `INBOX -> PARKED, EXPLORING, ARCHIVED`
- `PARKED -> INBOX, EXPLORING, ARCHIVED`
- `EXPLORING -> INBOX, PARKED, IN_PROGRESS, ARCHIVED`
- `IN_PROGRESS -> EXPLORING, SHIPPED, ARCHIVED`
- `SHIPPED -> EXPLORING, ARCHIVED`
- `ARCHIVED -> INBOX, PARKED, EXPLORING`

Invalid transitions are rejected by backend logic with a conflict response.

## API summary

- `GET /api/ideas`
- `POST /api/ideas`
- `GET /api/ideas/[id]`
- `PATCH /api/ideas/[id]`
- `PATCH /api/ideas/[id]/status`

Success responses:

```json
{
  "data": {}
}
```

Error responses:

```json
{
  "error": {
    "code": "SOME_CODE",
    "message": "Human readable message"
  }
}
```

## How to run it

The recommended local setup ships with a dedicated PostgreSQL Docker container so the application does not depend on any pre-existing database installed on your machine.

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a local `.env` file:

```env
DATABASE_URL="postgresql://idea_parking_lot:idea_parking_lot@localhost:5434/idea_parking_lot?schema=public"
```

You can also copy from `.env.example`.

### 3. Start the dedicated database container

```bash
npm run db:up
```

This starts a dedicated `postgres:17-alpine` container for the project on `localhost:5434`.

If you want to inspect logs:

```bash
npm run db:logs
```

To stop it later:

```bash
npm run db:down
```

### 4. Generate Prisma client

```bash
npx prisma generate
```

### 5. Push schema to the database

```bash
npx prisma db push
```

### 6. Seed sample data

```bash
npm run db:seed
```

### 7. Run the app

```bash
npm run dev
```

Then open:

- [http://localhost:3000](http://localhost:3000)

### 8. Verify locally

```bash
npm run typecheck
npm run test
npm run build
```

## Common local workflow

After the first setup, the normal day-to-day workflow is usually:

```bash
npm run db:up
npm run dev
```

When you change the Prisma schema:

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

## Troubleshooting

### Docker is not found

If `docker` is not available on Windows PATH but is installed inside WSL, you can still run the database through WSL. The important part is that the Postgres container publishes `5434` back to `localhost`.

### Port 5434 is already in use

Change the port mapping in [compose.yaml](C:\Users\irdih\OneDrive\Documents\Projects\Idea Parking Lot\compose.yaml) and update `DATABASE_URL` in `.env` and `.env.example`.

### Prisma cannot connect

Check:

- the database container is running
- `DATABASE_URL` matches the compose credentials
- the container is healthy

### Seed script fails

Make sure the schema has already been pushed:

```bash
npx prisma db push
```

## Considerations

### Short-term considerations

In the short term, the system is deliberately small. The create and update flows remain explicit, the repository interface is narrow, and there is no speculative abstraction for auth, AI, tags, or background jobs. This keeps the code easy to trace while the product shape is still being proven.

In the short term, the capture workflow is biased toward speed. The home form defaults status silently to `INBOX`, keeps the title as the primary field, and pushes optional fields downward so the common case stays fast.

In the short term, the database now has a dedicated Docker path instead of relying on whatever PostgreSQL instance might already be installed locally. This reduces local setup variance immediately and makes the project easier to boot on another machine or after cloning from GitHub.

### Long-term considerations

In the long term, the domain and application boundaries should make it easier to introduce auth, per-user scoping, AI suggestion services, or even service extraction without rewriting the business rules. The current layering is intentionally modest, but it is already strong enough to prevent infrastructure concerns from dominating the rest of the system.

In the long term, additional filtering, search, analytics, and AI-assisted refinement can be layered on top of the current idea model. The current data model is intentionally conservative so that future migrations stay manageable.

In the long term, shipping the database container definition with the repo improves reproducibility for contributors, CI, and future deployment experiments. Even if production later moves to managed Postgres, keeping a first-class local container definition lowers onboarding friction and makes environment drift less likely.

## Iteration log

### Iteration 1: V1 implementation

#### Technical explanation

The first iteration established the product skeleton and the modular monolith boundaries. Domain logic was extracted into dedicated RICE and status-transition modules, application services were introduced for the main use cases, and Prisma was isolated behind a repository and mapper. Route handlers validated inputs with Zod and returned stable success/error envelopes. On the UI side, the first iteration provided the home capture flow, newest-first list rendering, and a detail page for editing and status changes.

#### Plain English explanation

The first pass built the whole working app from end to end. It gave the tool a place to save ideas, a list to browse them, and a detail page to edit them later. The main idea was to get a usable V1 running without stuffing it full of features that would slow it down.

#### Short-term implications

The short-term benefit was speed of delivery with clear separations between rules, storage, API, and UI. That made it easier to spot weak points during review. The short-term drawback was that a few parts were still a little too broad for a true fast-capture flow, especially the create form.

#### Long-term implications

The long-term benefit is that the code now has a stable foundation for future extensions such as auth, AI suggestions, filtering, and more advanced workflows. The long-term risk would have been over-engineering too early, so the first iteration intentionally avoided generic frameworks or deep abstraction stacks.

### Iteration 2: hardening and fast-capture refinement

#### Technical explanation

The second iteration focused on reducing friction and tightening failure behavior. The quick-capture form was simplified by removing explicit status selection from the initial flow because status already defaults to `INBOX`. The submit action was moved inline with the title to prioritize the main path. On the backend, Prisma `P2025` not-found errors are now translated into application-level `NotFoundError` values so repository behavior is stable. Lightweight tests were added for RICE calculation, status rules, and the main create, update, and status-change services.

#### Plain English explanation

The second pass cleaned up the parts that felt heavier than they needed to be. The home form now gets out of the way faster, database errors behave more predictably, and the important rules are covered by tests so future changes are less likely to break the app quietly.

#### Short-term implications

The short-term result is a better default capture experience and more reliable behavior when records are missing or rules are violated. It also makes code review easier because the core business rules are now executable tests rather than only assumptions in the implementation.

#### Long-term implications

The long-term payoff is maintainability. Once the product starts changing more quickly, tests around domain rules and service behavior become much more valuable. The repository error translation also reduces coupling to Prisma-specific behavior, which matters more as the system grows.

### Iteration 3: dedicated Dockerized local database

#### Technical explanation

The third iteration made the local database environment explicit by shipping a `compose.yaml` file that provisions a dedicated PostgreSQL 17 container for the project. The default `DATABASE_URL` was updated to point to this container on port `5434`, and package scripts were added for starting, stopping, and inspecting the database service. This removes the previous assumption that a compatible and correctly configured PostgreSQL instance already exists on the host machine.

#### Plain English explanation

The third pass makes the app easier to run on any machine. Instead of depending on whatever database you may or may not already have installed, the project now brings its own database setup with it. That means fewer setup surprises and a more predictable local run experience.

#### Short-term implications

The short-term benefit is straightforward onboarding. A fresh clone can start the database with one command, then run Prisma and the app using known credentials. The short-term tradeoff is that Docker becomes part of the local requirements, so contributors need Docker available.

#### Long-term implications

The long-term benefit is reproducibility. The same database shape and credentials can be used across local development, CI, and staging-style experiments with much less drift. This also makes future GitHub onboarding cleaner because the repository documents and ships its own local infrastructure expectations.

### Iteration 4: cleanup and refactoring

#### Technical explanation

The fourth iteration removed stale local artifacts from the intended workflow, added ignore coverage for abandoned local database directories, moved repeated API response handling into a shared helper, and simplified the seed command path. This reduced duplication in the HTTP layer and kept the project aligned with the "database only on Docker" setup.

#### Plain English explanation

The fourth pass was less about new features and more about making the project cleaner. It removes leftovers from earlier experiments, makes the API files less repetitive, and leaves the repo in a shape that is easier for a new person to understand quickly.

#### Short-term implications

The short-term benefit is simpler maintenance. There is less duplicated API response code, fewer stale files in the workspace, and a cleaner local setup story.

#### Long-term implications

The long-term benefit is consistency. Small cleanup passes like this reduce friction when the codebase grows, because future changes start from a cleaner baseline instead of carrying old local experiments forward.

## GitHub push preparation

This project is ready to be pushed to GitHub once you add a remote.

Suggested flow:

```bash
git remote add origin <your-github-repo-url>
git push -u origin main
```

## Notes

- The app is intentionally not a task manager.
- Archived ideas remain visible by design.
- The current test suite focuses on domain and service logic rather than UI/browser automation.
- No auth or multi-user behavior is implemented yet.
- The repo ships with a dedicated Docker Compose PostgreSQL setup for local development.
