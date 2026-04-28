import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

// drizzle-kit infers the right client from the URL scheme:
//   libsql://... or https://... → libSQL/Turso (authToken required)
//   file:./local.db              → local SQLite file
const url = process.env.TURSO_DATABASE_URL ?? 'file:./local.db';

export default defineConfig({
  schema: './src/lib/server/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'turso',
  dbCredentials: {
    url,
    authToken: process.env.TURSO_AUTH_TOKEN
  },
  verbose: true,
  strict: true
});
