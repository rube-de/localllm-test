import { error, fail, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { db, models, tests, testVersions } from '$lib/server/db';
import { uniqueViolationMessage } from '$lib/server/db/errors';
import { slugify } from '$lib/utils';
import type { Actions, PageServerLoad } from './$types';

async function loadTest(id: number) {
  const [t] = await db.select().from(tests).where(eq(tests.id, id));
  if (!t) throw error(404, 'Test not found');
  return t;
}

export const load: PageServerLoad = async ({ params }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id)) throw error(404, 'Not found');
  const t = await loadTest(id);
  const versions = await db
    .select()
    .from(testVersions)
    .where(eq(testVersions.testId, id))
    .orderBy(testVersions.versionNumber);
  const allModels = await db.select().from(models).orderBy(models.name);
  return { test: t, versions, allModels };
};

async function withTest(id: number, fn: (t: Awaited<ReturnType<typeof loadTest>>) => Promise<unknown>) {
  const t = await loadTest(id);
  await fn(t);
}

async function setDefaultModelIds(testId: number, ids: number[]) {
  await db.update(tests).set({ defaultModelIds: ids }).where(eq(tests.id, testId));
}

export const actions: Actions = {
  updateBasics: async ({ request, params }) => {
    const id = Number(params.id);
    const data = await request.formData();
    const name = String(data.get('name') ?? '').trim();
    const slug = slugify(String(data.get('slug') ?? '').trim());
    const values = { name, slug };

    if (!name) return fail(400, { section: 'basics', error: 'Name is required.', values });
    if (!slug) return fail(400, { section: 'basics', error: 'Slug is required.', values });
    try {
      await db.update(tests).set({ name, slug }).where(eq(tests.id, id));
      return { saved: true, section: 'basics', values };
    } catch (err) {
      const friendly = uniqueViolationMessage(err);
      if (friendly) return fail(409, { section: 'basics', error: friendly, values });
      throw err;
    }
  },
  setCurrent: async ({ request, params }) => {
    const id = Number(params.id);
    const data = await request.formData();
    const versionId = Number(data.get('versionId'));
    if (!Number.isInteger(versionId)) return fail(400);
    // Ensure the version belongs to this test
    const [v] = await db
      .select({ id: testVersions.id })
      .from(testVersions)
      .where(and(eq(testVersions.id, versionId), eq(testVersions.testId, id)));
    if (!v) return fail(400);
    await db.update(tests).set({ currentVersionId: versionId }).where(eq(tests.id, id));
    return { saved: true, section: 'versions' };
  },
  addModel: async ({ request, params }) => {
    const id = Number(params.id);
    const data = await request.formData();
    const modelId = Number(data.get('modelId'));
    if (!Number.isInteger(modelId)) return fail(400);
    await withTest(id, async (t) => {
      if (t.defaultModelIds.includes(modelId)) return;
      await setDefaultModelIds(id, [...t.defaultModelIds, modelId]);
    });
    return { saved: true, section: 'featured' };
  },
  removeModel: async ({ request, params }) => {
    const id = Number(params.id);
    const data = await request.formData();
    const modelId = Number(data.get('modelId'));
    if (!Number.isInteger(modelId)) return fail(400);
    await withTest(id, async (t) => {
      await setDefaultModelIds(
        id,
        t.defaultModelIds.filter((x) => x !== modelId)
      );
    });
    return { saved: true, section: 'featured' };
  },
  moveModelUp: async ({ request, params }) => {
    const id = Number(params.id);
    const data = await request.formData();
    const modelId = Number(data.get('modelId'));
    if (!Number.isInteger(modelId)) return fail(400);
    await withTest(id, async (t) => {
      const arr = [...t.defaultModelIds];
      const i = arr.indexOf(modelId);
      if (i > 0) [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
      await setDefaultModelIds(id, arr);
    });
    return { saved: true, section: 'featured' };
  },
  moveModelDown: async ({ request, params }) => {
    const id = Number(params.id);
    const data = await request.formData();
    const modelId = Number(data.get('modelId'));
    if (!Number.isInteger(modelId)) return fail(400);
    await withTest(id, async (t) => {
      const arr = [...t.defaultModelIds];
      const i = arr.indexOf(modelId);
      if (i >= 0 && i < arr.length - 1) [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
      await setDefaultModelIds(id, arr);
    });
    return { saved: true, section: 'featured' };
  },
  delete: async ({ params }) => {
    const id = Number(params.id);
    await db.delete(tests).where(eq(tests.id, id));
    throw redirect(303, '/admin/tests');
  }
};
