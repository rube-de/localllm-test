import { error } from '@sveltejs/kit';
import { eq, inArray } from 'drizzle-orm';
import { db, models, submissions, tests, testVersions } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
  const [t] = await db.select().from(tests).where(eq(tests.slug, params.slug));
  if (!t) throw error(404, 'Test not found');

  const allVersions = await db
    .select()
    .from(testVersions)
    .where(eq(testVersions.testId, t.id))
    .orderBy(testVersions.versionNumber);
  if (allVersions.length === 0) throw error(404, 'Test has no versions yet');

  // Pick version: ?v=<id> if valid, else current, else latest.
  const requestedV = Number(url.searchParams.get('v'));
  const validVersion =
    Number.isInteger(requestedV) && allVersions.find((v) => v.id === requestedV);
  const version =
    validVersion ||
    allVersions.find((v) => v.id === t.currentVersionId) ||
    allVersions[allVersions.length - 1];

  // Only models that actually have a submission for the chosen version are
  // selectable on the public comparison page. Pull them in one query.
  const subs = await db
    .select({ modelId: submissions.modelId, html: submissions.html })
    .from(submissions)
    .where(eq(submissions.testVersionId, version.id));

  const htmlByModel = new Map(subs.map((s) => [s.modelId, s.html]));
  const validModelIds = new Set(htmlByModel.keys());

  const availableModels =
    validModelIds.size === 0
      ? []
      : await db
          .select()
          .from(models)
          .where(inArray(models.id, [...validModelIds]))
          .orderBy(models.name);
  const modelById = new Map(availableModels.map((m) => [m.id, m]));

  // Pick models: ?models=csv from URL → admin-curated defaults → all valid (fallback).
  // The all-valid fallback makes a freshly-seeded test immediately useful before
  // anyone has set featured models.
  const csv = url.searchParams.get('models');
  const requestedModelIds = csv
    ? csv
        .split(',')
        .map((s) => Number(s.trim()))
        .filter((n) => Number.isInteger(n) && n > 0)
    : t.defaultModelIds.length > 0
      ? t.defaultModelIds
      : availableModels.map((m) => m.id);

  // Drop any requested IDs that aren't available (URL drift, removed models, etc.)
  const filteredIds = requestedModelIds.filter((id) => validModelIds.has(id));
  const cells = filteredIds
    .map((id) => modelById.get(id))
    .filter((m): m is (typeof availableModels)[number] => !!m)
    .map((m) => ({ model: m, html: htmlByModel.get(m.id) ?? null }));

  return {
    test: t,
    versions: allVersions,
    version,
    allModels: availableModels,
    selectedIds: filteredIds,
    cells
  };
};
