#!/usr/bin/env bun
/**
 * Idempotent seeder: imports seed-data/<model-folder>/<test>.html files into
 * the DB. Each folder name becomes a Model (with placeholder temperature/quant);
 * each .html filename (without extension) becomes a Test slug + initial v1
 * with prompt "<unknown — seeded from disk>".
 *
 * Safe to run multiple times. Existing rows are skipped (matched by
 * unique tuples / slug). Submissions are upserted on (model, test_version).
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { createClient } from '@libsql/client';
import { and, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../src/lib/server/db/schema';
import { slugify } from '../src/lib/utils';

const { models, submissions, tests, testVersions } = schema;
const client = createClient({
  url: process.env.TURSO_DATABASE_URL ?? 'file:./local.db',
  authToken: process.env.TURSO_AUTH_TOKEN || undefined
});
const db = drizzle(client, { schema });

const SEED_DIR = 'seed-data';
const PLACEHOLDER_PROMPT = '<unknown — seeded from disk>';

async function ensureModel(name: string) {
  const [existing] = await db.select().from(models).where(eq(models.name, name));
  if (existing) return existing;
  const [row] = await db
    .insert(models)
    .values({ name, temperature: null, quantization: null, paramsNotes: null })
    .returning();
  console.log(`+ model: ${name}`);
  return row;
}

async function ensureTest(slug: string, displayName: string) {
  const [existing] = await db.select().from(tests).where(eq(tests.slug, slug));
  if (existing) {
    // Make sure it has at least a v1.
    const [v] = await db
      .select()
      .from(testVersions)
      .where(and(eq(testVersions.testId, existing.id), eq(testVersions.versionNumber, 1)))
      .limit(1);
    if (v) return { test: existing, version: v };
    const [created] = await db
      .insert(testVersions)
      .values({ testId: existing.id, versionNumber: 1, prompt: PLACEHOLDER_PROMPT })
      .returning();
    if (!existing.currentVersionId) {
      await db.update(tests).set({ currentVersionId: created.id }).where(eq(tests.id, existing.id));
    }
    return { test: existing, version: created };
  }
  const [t] = await db.insert(tests).values({ name: displayName, slug }).returning();
  const [v] = await db
    .insert(testVersions)
    .values({ testId: t.id, versionNumber: 1, prompt: PLACEHOLDER_PROMPT })
    .returning();
  await db.update(tests).set({ currentVersionId: v.id }).where(eq(tests.id, t.id));
  console.log(`+ test:  ${displayName} (/${slug})`);
  return { test: t, version: v };
}

async function upsertSubmission(modelId: number, testVersionId: number, html: string) {
  const [existing] = await db
    .select()
    .from(submissions)
    .where(and(eq(submissions.modelId, modelId), eq(submissions.testVersionId, testVersionId)));
  if (existing) {
    if (existing.html === html) return false;
    await db.update(submissions).set({ html }).where(eq(submissions.id, existing.id));
    return true;
  }
  await db.insert(submissions).values({ modelId, testVersionId, html });
  return true;
}

const dir = SEED_DIR;
const exists = await stat(dir).catch(() => null);
if (!exists?.isDirectory()) {
  console.error(`No ${dir}/ directory found. Nothing to seed.`);
  process.exit(0);
}

const modelFolders = (await readdir(dir, { withFileTypes: true }))
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

let written = 0;
for (const folder of modelFolders) {
  const model = await ensureModel(folder);
  const folderPath = join(dir, folder);
  const files = (await readdir(folderPath)).filter((f) => f.endsWith('.html'));
  for (const file of files) {
    const testName = file.replace(/\.html$/, '');
    const slug = slugify(testName);
    if (!slug) continue;
    const { version } = await ensureTest(slug, testName);
    const html = await readFile(join(folderPath, file), 'utf8');
    const changed = await upsertSubmission(model.id, version.id, html);
    if (changed) {
      console.log(`  · ${folder} → ${slug} (v${version.versionNumber}) [${html.length} bytes]`);
      written += 1;
    }
  }
}

console.log(`\nDone. ${written} submission${written === 1 ? '' : 's'} written.`);
process.exit(0);
