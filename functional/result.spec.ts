import { expectTypeOf } from 'expect-type';
import {
  Result,
  Result_InferError,
  Result_InferOK,
  flatMap,
  from,
} from './result';
import { pipe } from './pipe';
describe('result', () => {
  type TestError = { code: 1; message: string } | { code: 2; value: number };
  type TestResult = Result<number, TestError>;

  describe('from result', () => {
    test('can assign ok to result type', () => {
      expectTypeOf(from<TestResult>().ok(1)).toMatchTypeOf<TestResult>();
    });

    test('can assign error to result type', () => {
      expectTypeOf(
        from<TestResult>().error({ code: 1, message: 'test' }),
      ).toMatchTypeOf<TestResult>();
    });
  });

  describe('Result_InferOK', () => {
    test('can infer ok type', () => {
      expectTypeOf<Result_InferOK<TestResult>>().toEqualTypeOf<number>();
    });
  });

  describe('Result_InferError', () => {
    test('can infer error type', () => {
      expectTypeOf<Result_InferError<TestResult>>().toEqualTypeOf<TestError>();
    });
  });

  describe('pipe', () => {
    it('can infer correct type with flatMap', () => {
      const result = from<TestResult>().ok(1) as TestResult;
      pipe(
        result,
        flatMap((value) => {
          expectTypeOf(value).toEqualTypeOf<number>();
          return from<TestResult>().ok(value + 1);
        }),
      );
    });
  });
});
