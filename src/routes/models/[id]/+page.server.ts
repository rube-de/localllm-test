import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db, models, submissions, tests, testVersions } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id)) throw error(404);
  const [m] = await db.select().from(models).where(eq(models.id, id));
  if (!m) throw error(404, 'Model not found');

  const rows = await db
    .select({
      id: submissions.id,
      testVersionId: testVersions.id,
      versionNumber: testVersions.versionNumber,
      testName: tests.name,
      testSlug: tests.slug,
      createdAt: submissions.createdAt
    })
    .from(submissions)
    .innerJoin(testVersions, eq(testVersions.id, submissions.testVersionId))
    .innerJoin(tests, eq(tests.id, testVersions.testId))
    .where(eq(submissions.modelId, id))
    .orderBy(tests.name, testVersions.versionNumber);
  return { model: m, submissions: rows };
};
