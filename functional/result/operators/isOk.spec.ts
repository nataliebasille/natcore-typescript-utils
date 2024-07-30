import { expectTypeOf } from 'expect-type';
import { error, ok } from '../factories';
import { type Result, type Result_Error, type Result_Ok } from '../types';
import { isOk } from './isOk';

describe('isOk', () => {
  it('when true, is narrowed to Result_Ok', () => {
    const result = ok(1) as Result<number, string>;
    if (isOk(result)) {
      expectTypeOf(result).toEqualTypeOf<Result_Ok<number>>();
    }
  });

  it('when false, is narrowed to Result_Error', () => {
    const result = error('test') as Result<number, string>;
    if (!isOk(result)) {
      expectTypeOf(result).toEqualTypeOf<Result_Error<string>>();
    }
  });
});
