import { sql } from 'drizzle-orm';
import { integer, real, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';

export const tests = sqliteTable('tests', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  currentVersionId: integer('current_version_id'),
  defaultModelIds: text('default_model_ids', { mode: 'json' })
    .$type<number[]>()
    .notNull()
    .default(sql`'[]'`),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
});

export const testVersions = sqliteTable(
  'test_versions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    testId: integer('test_id')
      .notNull()
      .references(() => tests.id, { onDelete: 'cascade' }),
    versionNumber: integer('version_number').notNull(),
    prompt: text('prompt').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`)
  },
  (t) => [unique('uniq_test_version').on(t.testId, t.versionNumber)]
);

export const models = sqliteTable(
  'models',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    temperature: real('temperature'),
    quantization: text('quantization'),
    paramsNotes: text('params_notes'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`)
  },
  (t) => [unique('uniq_model_config').on(t.name, t.temperature, t.quantization)]
);

export const submissions = sqliteTable(
  'submissions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    modelId: integer('model_id')
      .notNull()
      .references(() => models.id, { onDelete: 'cascade' }),
    testVersionId: integer('test_version_id')
      .notNull()
      .references(() => testVersions.id, { onDelete: 'cascade' }),
    html: text('html').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`)
  },
  (t) => [unique('uniq_submission_pair').on(t.modelId, t.testVersionId)]
);

export type Test = typeof tests.$inferSelect;
export type TestVersion = typeof testVersions.$inferSelect;
export type Model = typeof models.$inferSelect;
export type Submission = typeof submissions.$inferSelect;
