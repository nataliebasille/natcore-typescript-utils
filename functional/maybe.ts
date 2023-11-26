type MaybeMatchers<V, S, N> = {
  some: (value: V) => S;
  none: () => N;
};

export type Maybe<T> = (
  | {
      readonly type: 'some';
      readonly value: T;
    }
  | { readonly type: 'none' }
) & { readonly _generic?: T };

export type Some<T> = Extract<Maybe<T>, { type: 'some' }>;
export type None<T> = Extract<Maybe<T>, { type: 'none' }>;

export type Maybe_InferSome<M extends Maybe<unknown>> = M extends Some<infer T>
  ? T
  : M extends None<infer T>
  ? T
  : M extends Maybe<infer T>
  ? T
  : never;

export const some = <T>(value: T) => createMaybe(value);

export const none = <T>() => createMaybe<T>();

export const isSome = <T>(maybe: Maybe<T>): maybe is Some<T> =>
  maybe.type === 'some';

export const isNone = <T>(maybe: Maybe<T>): maybe is None<T> =>
  maybe.type === 'none';

export function map<T, N>(fn: (value: T) => N): (maybe: Maybe<T>) => Maybe<N>;
export function map<M extends Maybe<unknown>, N>(
  maybe: M,
  fn: (value: Maybe_InferSome<M>) => N,
): Maybe<N>;
export function map(
  maybeOrFn: Maybe<unknown> | ((value: unknown) => unknown),
  fn?: (value: unknown) => unknown,
) {
  if (typeof maybeOrFn === 'function') {
    return (maybe: Maybe<unknown>) =>
      map(maybe, maybeOrFn as (value: unknown) => unknown);
  }

  return isSome(maybeOrFn) ? some(fn!(maybeOrFn.value)) : maybeOrFn;
}

export function flatMap<T, N>(
  fn: (value: T) => Maybe<N>,
): (maybe: Maybe<T>) => Maybe<N>;
export function flatMap<M extends Maybe<unknown>, N>(
  maybe: M,
  fn: (value: Maybe_InferSome<M>) => Maybe<N>,
): Maybe<N>;
export function flatMap(
  maybeOrFn: Maybe<unknown> | ((value: unknown) => Maybe<unknown>),
  fn?: (value: unknown) => Maybe<unknown>,
) {
  if (typeof maybeOrFn === 'function') {
    return (maybe: Maybe<unknown>) => flatMap(maybe, maybeOrFn);
  }

  return isSome(maybeOrFn) ? fn!(maybeOrFn.value) : maybeOrFn;
}

export function match<V, S, N>(
  matchers: MaybeMatchers<V, S, N>,
): (maybe: Maybe<V>) => S | N;
export function match<V, S, N>(
  maybe: Maybe<V>,
  matchers: MaybeMatchers<V, S, N>,
): S | N;
export function match(
  maybeOrMatchers: Maybe<unknown> | MaybeMatchers<unknown, unknown, unknown>,
  matchers?: MaybeMatchers<unknown, unknown, unknown>,
) {
  if ('some' in maybeOrMatchers) {
    return (maybe: Maybe<unknown>) => match(maybe, maybeOrMatchers);
  }

  return isSome(maybeOrMatchers)
    ? matchers!.some(maybeOrMatchers.value)
    : matchers!.none();
}

function createMaybe<T>(value?: T): Maybe<T> {
  const maybe: Maybe<T> = {
    ...(arguments.length === 0
      ? { type: 'none' as const }
      : { type: 'some' as const, value: value! }),
  };

  return maybe;
}
