import { fail, redirect } from '@sveltejs/kit';
import { desc, eq, sql } from 'drizzle-orm';
import { db, models, submissions, tests, testVersions } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const rows = await db
    .select({
      id: submissions.id,
      modelName: models.name,
      testName: tests.name,
      versionNumber: testVersions.versionNumber,
      htmlSize: sql<number>`length(${submissions.html})`.as('html_size'),
      createdAt: submissions.createdAt
    })
    .from(submissions)
    .innerJoin(models, eq(models.id, submissions.modelId))
    .innerJoin(testVersions, eq(testVersions.id, submissions.testVersionId))
    .innerJoin(tests, eq(tests.id, testVersions.testId))
    .orderBy(desc(submissions.createdAt));
  return { submissions: rows };
};

export const actions: Actions = {
  delete: async ({ request }) => {
    const data = await request.formData();
    const id = Number(data.get('id'));
    if (!Number.isInteger(id)) return fail(400);
    await db.delete(submissions).where(eq(submissions.id, id));
    throw redirect(303, '/admin/submissions');
  }
};
