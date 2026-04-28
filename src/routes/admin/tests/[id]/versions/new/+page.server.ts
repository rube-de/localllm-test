import { error, fail, redirect } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import { db, tests, testVersions } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id)) throw error(404);
  const [t] = await db.select().from(tests).where(eq(tests.id, id));
  if (!t) throw error(404, 'Test not found');
  const [latest] = await db
    .select({ versionNumber: testVersions.versionNumber })
    .from(testVersions)
    .where(eq(testVersions.testId, id))
    .orderBy(desc(testVersions.versionNumber))
    .limit(1);
  return { test: t, nextVersionNumber: (latest?.versionNumber ?? 0) + 1 };
};

export const actions: Actions = {
  default: async ({ request, params }) => {
    const id = Number(params.id);
    const data = await request.formData();
    const prompt = String(data.get('prompt') ?? '').trim();
    const setCurrent = data.get('setCurrent') === '1';
    const values = { prompt };
    if (!prompt) return fail(400, { error: 'Prompt is required.', values });

    const [latest] = await db
      .select({ versionNumber: testVersions.versionNumber })
      .from(testVersions)
      .where(eq(testVersions.testId, id))
      .orderBy(desc(testVersions.versionNumber))
      .limit(1);
    const next = (latest?.versionNumber ?? 0) + 1;

    const [v] = await db
      .insert(testVersions)
      .values({ testId: id, versionNumber: next, prompt })
      .returning({ id: testVersions.id });

    if (setCurrent) {
      await db.update(tests).set({ currentVersionId: v.id }).where(eq(tests.id, id));
    }
    throw redirect(303, `/admin/tests/${id}`);
  }
};
