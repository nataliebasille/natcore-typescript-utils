import { isSome } from '../../maybe';
import {
  type Maybe_None,
  type Maybe,
  type Maybe_Some,
  type Maybe_InferSome,
} from '../types';

type MaybeMatchers<In extends Maybe<unknown>, S, N> = {
  some: (value: Maybe_InferSome<In>) => S;
  none: () => N;
};

type Maybe_MatchInferNextResult<In extends Maybe<unknown>, SV, NV> = [
  In,
] extends [Maybe_Some<unknown>]
  ? SV
  : [In] extends [Maybe_None]
  ? NV
  : SV | NV;

export function match<In extends Maybe<unknown>, S, N>(
  matchers: MaybeMatchers<In, S, N>,
): (maybe: In) => Maybe_MatchInferNextResult<In, S, N>;
export function match<In extends Maybe<unknown>, S, N>(
  maybe: In,
  matchers: MaybeMatchers<In, S, N>,
): Maybe_MatchInferNextResult<In, S, N>;
export function match(
  maybeOrMatchers:
    | Maybe<unknown>
    | MaybeMatchers<Maybe<unknown>, unknown, unknown>,
  matchers?: MaybeMatchers<Maybe<unknown>, unknown, unknown>,
) {
  if ('some' in maybeOrMatchers) {
    return (maybe: Maybe<unknown>) => match(maybe, maybeOrMatchers);
  }

  return isSome(maybeOrMatchers)
    ? matchers!.some(maybeOrMatchers.value)
    : matchers!.none();
}
