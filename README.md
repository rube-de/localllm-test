# localllm-test

Gallery for comparing local-LLM HTML outputs across models, tests, and prompt versions.

## Setup

```bash
bun install
cp .env.example .env

# Generate admin password hash
bun scripts/hash-password.ts <your-password>
# paste the printed hash into ADMIN_PASSWORD_HASH

# Generate session secret
openssl rand -hex 32
# paste into SESSION_SECRET

# For local dev TURSO_DATABASE_URL=file:./local.db is fine

# Generate + apply migrations
bun run db:generate
bun run db:migrate

bun run dev
```

Visit http://localhost:5173 and `/admin` to sign in.

## Deploy

Vercel project. Set env vars `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `ADMIN_PASSWORD_HASH`,
`SESSION_SECRET`. Run `bun run db:migrate` against prod Turso once.

## Structure

```
src/
  lib/server/db/      Drizzle schema + libSQL client
  lib/server/auth.ts  bcrypt + signed cookie session
  hooks.server.ts     admin guard + CSP
  routes/             SvelteKit pages
seed-data/            Existing model output folders (input for seed-from-folders.ts)
scripts/              hash-password.ts, seed-from-folders.ts
drizzle/              Generated migrations
```
