import { type Result, type Result_Error } from '../types';

export const isError = <R extends Result<unknown, unknown>>(
  result: R,
): result is Extract<R, Result_Error<unknown>> => result.type === 'error';
