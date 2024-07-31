import { expectTypeOf } from 'expect-type';
import { error, ok } from '../factories';
import { type Result, type Result_Error, type Result_Ok } from '../types';
import { isError } from './isError';

describe('result.isError', () => {
  it('when true, is narroewed to Result_Error', () => {
    const result = error('test') as Result<number, string>;
    if (isError(result)) {
      expectTypeOf(result).toEqualTypeOf<Result_Error<string>>();
    }
  });

  it('when false, is narroewed to Result_Ok', () => {
    const result = ok(1) as Result<number, string>;
    if (!isError(result)) {
      expectTypeOf(result).toEqualTypeOf<Result_Ok<number>>();
    }
  });
});
