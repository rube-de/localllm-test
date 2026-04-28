/**
 * Map a thrown error from libSQL/SQLite into a user-facing field error
 * for known UNIQUE-constraint violations. Returns null if it isn't one.
 */
export function uniqueViolationMessage(err: unknown): string | null {
  const msg = err instanceof Error ? err.message : String(err);
  if (!msg.includes('UNIQUE constraint failed')) return null;
  if (msg.includes('uniq_model_config') || /models\.(name|temperature|quantization)/.test(msg)) {
    return 'A model with this (name, temperature, quantization) combination already exists.';
  }
  if (msg.includes('uniq_test_version')) {
    return 'That test already has a version with this number.';
  }
  if (msg.includes('uniq_submission_pair')) {
    return 'A submission for this (model, test version) pair already exists. Edit it instead.';
  }
  if (msg.includes('tests.slug')) {
    return 'A test with this slug already exists.';
  }
  return 'That value is already in use.';
}
