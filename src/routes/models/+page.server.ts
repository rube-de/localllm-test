import { count, eq } from 'drizzle-orm';
import { db, models, submissions } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const allModels = await db.select().from(models).orderBy(models.name);
  const counts = await db
    .select({ modelId: submissions.modelId, n: count() })
    .from(submissions)
    .groupBy(submissions.modelId);
  const map = new Map(counts.map((c) => [c.modelId, c.n]));
  return {
    models: allModels.map((m) => ({ ...m, submissionCount: map.get(m.id) ?? 0 }))
  };
};
