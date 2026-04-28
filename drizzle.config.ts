import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

const url = process.env.TURSO_DATABASE_URL ?? 'file:./local.db';
const isRemote = url.startsWith('libsql://') || url.startsWith('https://');

export default defineConfig({
  schema: './src/lib/server/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'sqlite',
  ...(isRemote
    ? {
        driver: 'turso' as const,
        dbCredentials: { url, authToken: process.env.TURSO_AUTH_TOKEN }
      }
    : {
        dbCredentials: { url: url.replace(/^file:/, '') }
      }),
  verbose: true,
  strict: true
});
