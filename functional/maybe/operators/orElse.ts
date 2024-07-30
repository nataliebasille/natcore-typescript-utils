import { isSome } from '../../maybe';
import {
  type Maybe_Some,
  type Maybe,
  type Maybe_InferSome,
  type Maybe_None,
} from '../types';

type Maybe_OrElseInferNextResult<
  In extends Maybe<unknown>,
  Out extends Maybe<unknown>,
> = [In] extends [Maybe_None]
  ? Out
  : [In] extends [Maybe_Some<unknown>]
  ? In
  : Maybe<Maybe_InferSome<In> | Maybe_InferSome<Out>>;

export function orElse<In extends Maybe<unknown>, Out extends Maybe<unknown>>(
  fn: () => Out,
): (maybe: In) => Maybe_OrElseInferNextResult<In, Out>;

export function orElse<In extends Maybe<unknown>, Out extends Maybe<unknown>>(
  maybe: In,
  fn: () => Out,
): Maybe_OrElseInferNextResult<In, Out>;

export function orElse(
  maybeOrFn: Maybe<unknown> | ((value: unknown) => unknown),
  fn?: () => unknown,
) {
  if (typeof maybeOrFn === 'function') {
    return (maybe: Maybe<unknown>) =>
      orElse(maybe, maybeOrFn as () => Maybe<unknown>);
  }

  return isSome(maybeOrFn) ? maybeOrFn : fn!();
}
