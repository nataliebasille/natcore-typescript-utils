import { Result } from './types';

export function ok<S>(value: S) {
  return createResult<S, never>({ type: 'ok', value });
}

export function error<E>(value: E) {
  return createResult<never, E>({ type: 'error', value });
}

function createResult<S, E>({
  type,
  value,
}:
  | {
      type: 'ok';
      value: S;
    }
  | {
      type: 'error';
      value: E;
    }): Result<S, E> {
  const result = {
    type,
    value,
  } as Result<S, E>;

  return result;
}
