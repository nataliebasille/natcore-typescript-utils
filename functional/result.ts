export const isResult = (value: unknown): value is Result<unknown, unknown> =>
  typeof value === 'object' &&
  value !== null &&
  'type' in value &&
  'value' in value &&
  (value.type === 'ok' || value.type === 'error');
