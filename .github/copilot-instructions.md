# BlitzQ - AI Coding Agent Instructions

## Project Overview

**BlitzQ** is an AI-powered quiz generation platform using a Turborepo monorepo structure. Backend runs on **Cloudflare Workers** (Hono framework), frontend is **Next.js 15** (App Router), with shared packages for database (Drizzle ORM + Neon PostgreSQL), AI (Google Gemini), types (Zod schemas), and UI components.

## Architecture

### Monorepo Structure

- **apps/backend** - Cloudflare Worker API using Hono framework
- **apps/web** - Next.js 15 app with NextAuth.js authentication
- **packages/db** - Drizzle ORM schemas and database client factory
- **packages/ai** - Google Gemini AI client and quiz generation logic
- **packages/types** - Shared Zod schemas and TypeScript types
- **packages/ui** - Shared React components with Tailwind CSS
- **packages/eslint-config**, **packages/typescript-config**, **packages/tailwind-config** - Shared configurations

### Key Dependencies & Integration Points

**Backend (Cloudflare Workers):**

- Uses Hono context pattern with typed `Bindings` and `Variables` for dependency injection
- Database client injected via middleware: `c.set('db', db)` from [apps/backend/src/index.ts](apps/backend/src/index.ts)
- AI client injected via middleware: `c.set('ai', ai)` from [apps/backend/src/index.ts](apps/backend/src/index.ts)
- KV store accessed via `c.env.blitzq_kv` for caching and rate limiting
- All routes MUST use typed context: `new Hono<{ Bindings: Bindings, Variables: Variables }>()`

**Frontend (Next.js):**

- Authentication: NextAuth.js with Google OAuth and credentials provider
- Middleware enforces auth: logged-in users redirected from `/` to `/quiz`, logged-out users redirected from `/quiz` to `/signin`
- API integration via axios to backend (`NEXT_PUBLIC_BACKEND_URL` environment variable)
- Custom JWT handling in [apps/web/app/api/auth/[...nextauth]/options.ts](apps/web/app/api/auth/[...nextauth]/options.ts)

**Shared Packages:**

- `@repo/db` exports `createDbClient()` factory function - takes `{DATABASE_URL}` object, returns Drizzle client
- `@repo/ai` exports `googleGenAIClient()` and `generateQuiz()` - uses Google Gemini 2.5 with structured JSON responses
- `@repo/types` defines all Zod schemas and inferred types used across backend/frontend
- All packages use CommonJS (`type: "commonjs"`) except web app

### Database Schema (Drizzle ORM)

Located in [packages/db/src/schema/schema.ts](packages/db/src/schema/schema.ts):

- `users` table: id (UUID), email, provider (credential|google), password (hashed with bcryptjs), tier (free|pro), quota, subscription fields (customerId, endsAt, renewsAt, proStatus)
- `quizzes` table: id (UUID), title, quiz (JSONB), answer (JSONB), submitted (boolean), userId (FK to users), createdAt

**Migration workflow:**

```bash
cd packages/db
npm run generate          # Generate migrations
npm run migrate:local     # Apply to local DB (.env.local)
npm run migrate:prod      # Apply to production (.env.prod)
npm run studio            # Open Drizzle Studio
```

## Critical Patterns & Conventions

### 1. Backend Middleware Pattern

Rate limiting uses Cloudflare KV with bucket-based implementation in [apps/backend/src/middleware/rateLimit.ts](apps/backend/src/middleware/rateLimit.ts):

```typescript
export const rateLimit = ((limit = 10), (windowSeconds = 60));
```

User validation middleware in [apps/backend/src/middleware/validateUser.ts](apps/backend/src/middleware/validateUser.ts) verifies JWT and attaches user to context: `c.set('user', decoded)`

### 2. Caching Strategy

Backend caches responses in Cloudflare KV with 5-minute TTL:

- Cache keys generated via `createCacheKey()` in [apps/backend/src/utils/cacheKey.ts](apps/backend/src/utils/cacheKey.ts)
- Pattern: check cache → fetch from DB → store in cache (see [apps/backend/src/routes/user.ts](apps/backend/src/routes/user.ts) `/profile` endpoint)
- Cache invalidation on updates (e.g., when subscription changes)

### 3. AI Quiz Generation

Uses Google Gemini 2.5 with model rotation between `gemini-2.5-flash-lite` and `gemini-2.5-flash`:

```typescript
const models = ["gemini-2.5-flash-lite", "gemini-2.5-flash"];
const selectModel = () => models[currentModelIndex++ % models.length];
```

- AI responses strictly validated against Zod schemas from `@repo/types`
- Quiz format: 10 MCQs per quiz, 2 questions per sub-topic, structured JSON with explanation fields

### 4. Authentication Flow

- Backend `/auth/signin` handles both credential and OAuth sign-in (see [apps/backend/src/routes/auth.ts](apps/backend/src/routes/auth.ts))
- Password hashing with bcryptjs (10 salt rounds)
- Frontend NextAuth callbacks sign in user via backend, store JWT in session (see [apps/web/app/api/auth/[...nextauth]/options.ts](apps/web/app/api/auth/[...nextauth]/options.ts))

### 5. Subscription Management (LemonSqueezy)

Webhook handler in [apps/backend/src/routes/webhooks.ts](apps/backend/src/routes/webhooks.ts) processes:

- `subscription_payment_success` - Upgrades user to pro tier, sets quota to 300
- `subscription_updated` - Updates subscription status (active, cancelled, etc.)
- `subscription_payment_failed` - Resets to free tier
- Uses HMAC SHA-256 signature verification with `hexToUint8Array()` utility

### 6. Quota System

- Free tier: 1 quiz/day (quota=1)
- Pro tier: 300 quizzes/day (quota=300)
- Quota decrements on quiz creation, resets daily at midnight UTC
- Check quota before quiz generation in `/createQuiz` endpoint

## Developer Workflows

### Development

```bash
# Root level - run all apps in parallel
npm run dev

# Individual apps
cd apps/backend && npm run dev    # Wrangler dev server (localhost:8787)
cd apps/web && npm run dev        # Next.js dev server (localhost:3000)
```

### Building

```bash
npm run build         # Builds all apps and packages
npm run check-types   # TypeScript type checking across workspace
npm run lint          # ESLint all packages
npm run format        # Prettier format all files
```

### Deployment

- **Backend**: `cd apps/backend && npm run deploy` (Cloudflare Workers via Wrangler)
- **Frontend**: Vercel deployment (automatic via Git integration)

### Environment Variables

**Backend (.env in apps/backend):**

- `DATABASE_URL`, `JWT_SECRET`, `GEMINI_API_KEY`
- LemonSqueezy: `LEMON_SQUEEZY_API_KEY`, `LEMON_SQUEEZY_WEBHOOK_SIGNATURE`, `STORE_ID`, `PRO_VARIANT_ID`
- Cloudflare KV namespace binding: `blitzq_kv`

**Frontend (.env.local in apps/web):**

- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_BACKEND_URL`
- Google OAuth: `CLIENT_ID`, `CLIENT_SECRET`

## Important Notes

- **Never hardcode secrets** - always use environment variables via `c.env` (backend) or `process.env` (frontend)
- **Package imports** must use workspace aliases: `@repo/db`, `@repo/ai`, `@repo/types`, `@repo/ui`
- **Type safety**: All request/response bodies must be validated with Zod schemas from `@repo/types`
- **Error handling**: Always return proper HTTP status codes and JSON error responses
- **Turbo cache**: `turbo.json` defines task dependencies and caching behavior

## Common Gotchas

1. Backend uses Cloudflare Workers runtime - no Node.js APIs (use Web APIs instead)
2. Drizzle requires explicit `.execute()` for mutation queries
3. NextAuth JWT must include `accessToken` field for middleware checks
4. Rate limiting requires KV namespace binding in `wrangler.toml`
5. Quiz generation can fail due to AI rate limits - implement retry logic with exponential backoff
