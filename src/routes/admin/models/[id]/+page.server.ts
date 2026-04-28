import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db, models } from '$lib/server/db';
import { uniqueViolationMessage } from '$lib/server/db/errors';
import { parseOptionalNumber, parseOptionalString } from '$lib/utils';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id)) throw error(404, 'Not found');
  const [row] = await db.select().from(models).where(eq(models.id, id));
  if (!row) throw error(404, 'Model not found');
  return { model: row };
};

export const actions: Actions = {
  update: async ({ request, params }) => {
    const id = Number(params.id);
    const data = await request.formData();
    const name = String(data.get('name') ?? '').trim();
    const temperature = parseOptionalNumber(data.get('temperature'));
    const quantization = parseOptionalString(data.get('quantization'));
    const paramsNotes = parseOptionalString(data.get('paramsNotes'));

    const values = {
      name,
      temperature: data.get('temperature')?.toString() ?? '',
      quantization: quantization ?? '',
      paramsNotes: paramsNotes ?? ''
    };
    if (!name) return fail(400, { error: 'Name is required.', values });

    try {
      await db
        .update(models)
        .set({ name, temperature, quantization, paramsNotes })
        .where(eq(models.id, id));
      return { saved: true, values };
    } catch (err) {
      const friendly = uniqueViolationMessage(err);
      if (friendly) return fail(409, { error: friendly, values });
      throw err;
    }
  },
  delete: async ({ params }) => {
    const id = Number(params.id);
    await db.delete(models).where(eq(models.id, id));
    throw redirect(303, '/admin/models');
  }
};
