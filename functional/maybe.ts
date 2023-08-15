import { pipe } from './pipe';

export type Maybe<T> =
  | {
      readonly type: 'some';
      readonly value: T;
    }
  | { readonly type: 'none' };

export type Some<T> = Extract<Maybe<T>, { type: 'some' }>;
export type None = Extract<Maybe<unknown>, { type: 'none' }>;

export type Maybe_InferSome<M extends Maybe<any>> = M extends Some<infer T>
  ? T
  : M extends None
  ? never
  : M extends Maybe<infer T>
  ? T
  : never;

export const some = <T>(value: T): Some<T> => ({
  type: 'some',
  value,
});

export const none: None = {
  type: 'none',
};

export const isSome = <T>(maybe: Maybe<T>): maybe is Some<T> =>
  maybe.type === 'some';

export const isNone = <T>(maybe: Maybe<T>): maybe is None =>
  maybe.type === 'none';

export function map<T, N>(fn: (value: T) => N): (maybe: Maybe<T>) => Maybe<N>;
export function map<M extends Maybe<any>, N>(
  maybe: M,
  fn: (value: Maybe_InferSome<M>) => N
): Maybe<N>;
export function map(maybeOrFn: any, fn?: any) {
  if (fn === undefined) {
    return (maybe: any) => map(maybe, maybeOrFn);
  }

  return isSome(maybeOrFn) ? some(fn(maybeOrFn.value)) : maybeOrFn;
}

export function flatMap<T, N>(
  fn: (value: T) => Maybe<N>
): (maybe: Maybe<T>) => Maybe<N>;
export function flatMap<M extends Maybe<any>, N>(
  maybe: M,
  fn: (value: Maybe_InferSome<M>) => Maybe<N>
): Maybe<N>;
export function flatMap(maybeOrFn: any, fn?: any) {
  if (fn === undefined) {
    return (maybe: any) => flatMap(maybe, maybeOrFn);
  }

  return isSome(maybeOrFn) ? fn(maybeOrFn.value) : maybeOrFn;
}

export function match<V, R>(matchers: {
  some: (value: V) => R;
  none: () => R;
}): (maybe: Maybe<V>) => R;
export function match<V, R>(
  maybe: Maybe<V>,
  matchers: { some: (value: V) => R; none: () => R }
): R;
export function match(maybeOrMatchers: any, matchersOrMaybe?: any) {
  if (matchersOrMaybe === undefined) {
    return (maybe: any) => match(maybe, maybeOrMatchers);
  }

  return isSome(maybeOrMatchers)
    ? matchersOrMaybe.some(maybeOrMatchers.value)
    : matchersOrMaybe.none();
}
