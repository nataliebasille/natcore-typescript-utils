import { type Result, type Result_Ok } from '../types';

export const isOk = <R extends Result<unknown, unknown>>(
  result: R,
): result is Extract<R, Result_Ok<unknown>> => result.type === 'ok';
