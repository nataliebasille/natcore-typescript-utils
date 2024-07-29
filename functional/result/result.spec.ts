import { expectTypeOf } from 'expect-type';
import {
  error,
  ok,
  andThen,
  Result,
  Result_InferError,
  Result_InferOK,
  Result_Ok,
  isOk,
  Result_Error,
  isError,
} from '../result';
import { pipe } from '../pipe';

describe('result', () => {
  type TestError = { code: 1; message: string } | { code: 2; value: number };
  type TestResult = Result<number, TestError>;

  describe('from result', () => {
    test('can assign ok to result type', () => {
      const result = ok(1);
      type InferedResult = typeof result;
      expectTypeOf<InferedResult>().toMatchTypeOf<TestResult>();
    });

    test('can assign error to result type', () => {
      const result = error({ code: 1 as const, message: 'test' });
      type InferedResult = typeof result;
      expectTypeOf<InferedResult>().toMatchTypeOf<TestResult>();
    });
  });

  describe('Result_InferOK', () => {
    test('can infer ok type', () => {
      type InferedOk = Result_InferOK<TestResult>;
      expectTypeOf<InferedOk>().toEqualTypeOf<number>();
    });
  });

  describe('Result_InferError', () => {
    test('can infer error type', () => {
      type InferedError = Result_InferError<TestResult>;
      expectTypeOf<InferedError>().toEqualTypeOf<TestError>();
    });
  });

  describe('isOk', () => {
    it('when true, is narroewed to Result_Ok', () => {
      const result = ok(1) as Result<number, string>;
      if (isOk(result)) {
        expectTypeOf(result).toEqualTypeOf<Result_Ok<number>>();
      }
    });

    it('when false, is narroewed to Result_Error', () => {
      const result = error('test') as Result<number, string>;
      if (!isOk(result)) {
        expectTypeOf(result).toEqualTypeOf<Result_Error<string>>();
      }
    });
  });

  describe('isError', () => {
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

  describe('andThen', () => {
    it('ok input can infer correct parameter type', () => {
      const result = ok(1);
      pipe(
        result,
        andThen((value) => {
          expectTypeOf(value).toEqualTypeOf<number>();
          return ok(value + 1);
        }),
      );
    });

    it('ok input with ok output can infer correct return type', () => {
      const result = ok(1);
      const output = pipe(
        result,
        andThen((value) => {
          expectTypeOf(value).toEqualTypeOf<number>();
          return ok(`${value}`);
        }),
      );

      expectTypeOf(output).toMatchTypeOf<Result_Ok<string>>();
    });
  });
});
