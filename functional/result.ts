import { pipe } from './pipe';

export type Result<S, E> =
  | {
      readonly type: 'ok';
      readonly value: S;
    }
  | {
      readonly type: 'error';
      readonly value: E;
    };

export type Ok<S> = Extract<Result<S, never>, { type: 'ok' }>;
export type Error<E> = Extract<Result<never, E>, { type: 'error' }>;

export type Result_InferOK<R extends Result<any, any>> = R extends Ok<infer S>
  ? S
  : R extends Error<any>
  ? never
  : R extends Result<infer S, any>
  ? S
  : never;

export type Result_InferError<R extends Result<any, any>> = R extends Ok<any>
  ? never
  : R extends Error<infer E>
  ? E
  : R extends Result<any, infer E>
  ? E
  : never;

export const ok = <S>(value: S): Ok<S> => ({
  type: 'ok',
  value,
});
export const error = <E>(value: E): Error<E> => ({
  type: 'error',
  value,
});

export const isOk = <S, E>(result: Result<S, E>): result is Ok<S> =>
  result.type === 'ok';

export const isError = <S, E>(result: Result<S, E>): result is Error<E> =>
  result.type === 'error';

export const isResult = (value: unknown): value is Result<any, any> =>
  typeof value === 'object' &&
  value !== null &&
  'type' in value &&
  'value' in value &&
  (value.type === 'ok' || value.type === 'error');

export function map<S, N>(
  fn: (value: S) => N
): <E>(result: Result<S, E>) => Result<N, E>;
export function map<R extends Result<any, any>, N>(
  result: R,
  fn: (value: Result_InferOK<R>) => N
): Result<N, Result_InferError<R>>;
export function map(resultOrFn: any, fn?: any) {
  if (fn === undefined) {
    return (result: any) => map(result, resultOrFn);
  }

  return isOk(resultOrFn) ? ok(fn(resultOrFn.value)) : resultOrFn;
}

export function flatMap<S1, S2, E2>(
  fn: (value: S1) => Result<S2, E2>
): <E1>(result: Result<S1, E1>) => Result<S2, E1 | E2>;
export function flatMap<R extends Result<any, any>, N extends Result<any, any>>(
  result: R,
  fn: (value: Result_InferOK<R>) => N
): Result<Result_InferOK<N>, Result_InferError<R> | Result_InferError<N>>;

export function flatMap(resultOrFn: any, fn?: any) {
  if (fn === undefined) {
    return (result: any) => flatMap(result, resultOrFn);
  }

  return isOk(resultOrFn) ? fn(resultOrFn.value) : resultOrFn;
}

export function match<S, E, V>(matchers: {
  ok: (value: S) => V;
  error: (value: E) => V;
}): (result: Result<S, E>) => V;
export function match<V, R extends Result<any, any>>(
  result: R,
  matchers: {
    ok: (value: Result_InferOK<R>) => V;
    error: (value: Result_InferError<R>) => V;
  }
): V;
export function match(resultOrMatchers: any, matchers?: any) {
  if (matchers === undefined) {
    return (result: any) => match(result, resultOrMatchers);
  }

  return isOk(resultOrMatchers)
    ? matchers.ok(resultOrMatchers.value)
    : matchers.error(resultOrMatchers.value);
}
