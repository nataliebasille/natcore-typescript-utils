import { type Maybe_None, type Maybe_Some } from './types';

export const some = <T>(value: T): Maybe_Some<T> => {
  return {
    type: 'some',
    value,
  };
};

export const none = (): Maybe_None => {
  return {
    type: 'none',
  };
};
