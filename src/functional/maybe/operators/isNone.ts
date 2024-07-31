import { type Maybe, type Maybe_None } from '../types';

export const isNone = (maybe: Maybe<unknown>): maybe is Maybe_None =>
  maybe.type === 'none';
