import { fail, redirect } from '@sveltejs/kit';
import { db, models } from '$lib/server/db';
import { uniqueViolationMessage } from '$lib/server/db/errors';
import { parseOptionalNumber, parseOptionalString } from '$lib/utils';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const rows = await db.select().from(models).orderBy(models.name);
  return { models: rows };
};

export const actions: Actions = {
  create: async ({ request }) => {
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

    let newId: number;
    try {
      const [row] = await db
        .insert(models)
        .values({ name, temperature, quantization, paramsNotes })
        .returning({ id: models.id });
      newId = row.id;
    } catch (err) {
      const friendly = uniqueViolationMessage(err);
      if (friendly) return fail(409, { error: friendly, values });
      throw err;
    }
    throw redirect(303, `/admin/models/${newId}`);
  }
};
