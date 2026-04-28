import { fail, redirect } from '@sveltejs/kit';
import { count, eq } from 'drizzle-orm';
import { db, tests, testVersions } from '$lib/server/db';
import { uniqueViolationMessage } from '$lib/server/db/errors';
import { slugify } from '$lib/utils';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const rows = await db
    .select({
      id: tests.id,
      name: tests.name,
      slug: tests.slug,
      currentVersionId: tests.currentVersionId,
      currentVersionNumber: testVersions.versionNumber
    })
    .from(tests)
    .leftJoin(testVersions, eq(testVersions.id, tests.currentVersionId))
    .orderBy(tests.name);

  const counts = await db
    .select({ testId: testVersions.testId, n: count() })
    .from(testVersions)
    .groupBy(testVersions.testId);
  const countMap = new Map(counts.map((c) => [c.testId, c.n]));

  return {
    tests: rows.map((r) => ({ ...r, versionCount: countMap.get(r.id) ?? 0 }))
  };
};

export const actions: Actions = {
  create: async ({ request }) => {
    const data = await request.formData();
    const name = String(data.get('name') ?? '').trim();
    const slugInput = String(data.get('slug') ?? '').trim();
    const slug = slugInput ? slugify(slugInput) : slugify(name);
    const prompt = String(data.get('prompt') ?? '').trim();

    const values = { name, slug, prompt };

    if (!name) return fail(400, { error: 'Name is required.', values });
    if (!slug) return fail(400, { error: 'Slug is required.', values });
    if (!prompt) return fail(400, { error: 'Initial prompt is required.', values });

    let testId: number;
    try {
      const [t] = await db
        .insert(tests)
        .values({ name, slug, defaultModelIds: [] })
        .returning({ id: tests.id });
      testId = t.id;
    } catch (err) {
      const friendly = uniqueViolationMessage(err);
      if (friendly) return fail(409, { error: friendly, values });
      throw err;
    }

    const [v] = await db
      .insert(testVersions)
      .values({ testId, versionNumber: 1, prompt })
      .returning({ id: testVersions.id });

    await db.update(tests).set({ currentVersionId: v.id }).where(eq(tests.id, testId));

    throw redirect(303, `/admin/tests/${testId}`);
  }
};
