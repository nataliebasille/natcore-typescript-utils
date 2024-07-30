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

export const isSome = <T>(maybe: Maybe<T>): maybe is Some<T> =>
  maybe.type === 'some';

export const isNone = <T>(maybe: Maybe<T>): maybe is None<T> =>
  maybe.type === 'none';

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
