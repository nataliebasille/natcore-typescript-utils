import { isSome } from '../../maybe';
import { type Maybe, type Maybe_InferSome, type Maybe_None } from '../types';

type Maybe_AndThenInferNextResult<
  In extends Maybe<unknown>,
  Out extends Maybe<unknown>,
> = [In] extends [Maybe_None] ? Maybe_None : Out;

export function andThen<In extends Maybe<unknown>, Out extends Maybe<unknown>>(
  fn: (value: Maybe_InferSome<In>) => Out,
): (maybe: In) => Maybe_AndThenInferNextResult<In, Out>;

export function andThen<In extends Maybe<unknown>, Out extends Maybe<unknown>>(
  maybe: In,
  fn: (value: Maybe_InferSome<In>) => Out,
): Maybe_AndThenInferNextResult<In, Out>;

export function andThen(
  maybeOrFn: Maybe<unknown> | ((value: unknown) => unknown),
  fn?: (value: unknown) => unknown,
) {
  if (typeof maybeOrFn === 'function') {
    return (maybe: Maybe<unknown>) =>
      andThen(maybe, maybeOrFn as (value: unknown) => Maybe<unknown>);
  }

  return isSome(maybeOrFn) ? fn!(maybeOrFn.value) : maybeOrFn;
}
