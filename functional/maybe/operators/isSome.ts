import { type Maybe, type Maybe_Some } from '../types';

export const isSome = <T>(maybe: Maybe<T>): maybe is Maybe_Some<T> =>
  maybe.type === 'some';
