import { fail, redirect } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import { db, models, submissions, tests, testVersions } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';

type VersionRow = {
  id: number;
  versionNumber: number;
  isCurrent: boolean;
};
type TestGroup = { testId: number; testName: string; versions: VersionRow[] };

export const load: PageServerLoad = async () => {
  const allModels = await db.select().from(models).orderBy(models.name);

  const rows = await db
    .select({
      testId: tests.id,
      testName: tests.name,
      currentVersionId: tests.currentVersionId,
      versionId: testVersions.id,
      versionNumber: testVersions.versionNumber
    })
    .from(tests)
    .innerJoin(testVersions, eq(testVersions.testId, tests.id))
    .orderBy(tests.name, testVersions.versionNumber);

  const grouped = new Map<number, TestGroup>();
  for (const r of rows) {
    if (!grouped.has(r.testId)) {
      grouped.set(r.testId, { testId: r.testId, testName: r.testName, versions: [] });
    }
    grouped.get(r.testId)!.versions.push({
      id: r.versionId,
      versionNumber: r.versionNumber,
      isCurrent: r.versionId === r.currentVersionId
    });
  }

  return {
    models: allModels,
    versions: rows,
    testGroups: [...grouped.values()]
  };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const modelId = Number(data.get('modelId'));
    const testVersionId = Number(data.get('testVersionId'));
    const html = String(data.get('html') ?? '');

    const values = {
      modelId: data.get('modelId')?.toString() ?? '',
      testVersionId: data.get('testVersionId')?.toString() ?? '',
      html
    };

    if (!Number.isInteger(modelId) || modelId <= 0)
      return fail(400, { error: 'Model is required.', values });
    if (!Number.isInteger(testVersionId) || testVersionId <= 0)
      return fail(400, { error: 'Test version is required.', values });
    if (!html.trim()) return fail(400, { error: 'HTML is required.', values });

    // Upsert: replace HTML if the (model, test_version) pair already exists.
    await db
      .insert(submissions)
      .values({ modelId, testVersionId, html })
      .onConflictDoUpdate({
        target: [submissions.modelId, submissions.testVersionId],
        set: { html, createdAt: sql`(unixepoch())` }
      });

    throw redirect(303, '/admin/submissions');
  }
};
