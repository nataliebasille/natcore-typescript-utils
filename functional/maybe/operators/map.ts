import { some } from '../factories';
import {
  type Maybe_None,
  type Maybe_Some,
  type Maybe,
  type Maybe_InferSome,
} from '../types';
import { isSome } from './isSome';

type Maybe_MapInferNextResult<M extends Maybe<unknown>, O> = [M] extends [
  Maybe_Some<unknown>,
]
  ? Maybe_Some<O>
  : [M] extends [Maybe_None]
  ? Maybe_None
  : Maybe<O>;

export function map<M extends Maybe<unknown>, O>(
  fn: (value: Maybe_InferSome<M>) => O,
): (maybe: M) => Maybe_MapInferNextResult<M, O>;

export function map<M extends Maybe<unknown>, N>(
  maybe: M,
  fn: (value: Maybe_InferSome<M>) => N,
): Maybe_MapInferNextResult<M, N>;

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
