import { expectTypeOf } from 'expect-type';
import { andThen } from './andThen';
import { error, ok } from '../factories';
import { type Result, type Result_Error, type Result_Ok } from '../types';
import { pipe } from '../../pipe';

describe('result.andThen', () => {
  describe('non-pipeable version', () => {
    it('for ok result as input, it returns the result of fn', () => {
      const result = ok(1);
      const andThened = andThen(result, () => ok('a different result'));
      expect(andThened).toEqual(ok('a different result'));
    });

    it('for error result as input, it returns the input', () => {
      const result = error({ code: 1, message: 'test' });
      const andThened = andThen(result, () => ok('a different result'));
      expect(andThened).toEqual(error({ code: 1, message: 'test' }));
    });

    describe('typings', () => {
      it('for ok result as input, it infers the fn parameter as the ok type', () => {
        const result = ok(1);
        andThen(result, (value) => {
          expectTypeOf(value).toEqualTypeOf<number>();
          return ok(value + 1);
        });
      });

      it('for error result as input, it infers the fn parameter as never', () => {
        const result = error({ code: 1 as const, message: 'test' });
        andThen(result, (value) => {
          expectTypeOf(value).toEqualTypeOf<never>();
          return ok('a different result');
        });
      });

      it('for ambiguous result as input, it infers the fn parameter as the ok type', () => {
        const result = ok(1) as Result<number, { code: 1; message: string }>;
        andThen(result, (value) => {
          expectTypeOf(value).toEqualTypeOf<number>();
          return ok('a different result');
        });
      });

      it('for ok result as input and ok as return type, it infers the output same as return type', () => {
        const result = ok(1);
        const output = andThen(result, () => {
          return ok('a different result' as const);
        });
        expectTypeOf(output).toEqualTypeOf<Result_Ok<'a different result'>>();
      });

      it('for ok result as input and error as return type, it infers the output same as return type', () => {
        const result = ok(1);
        const output = andThen(result, () => {
          return error({ code: 2 as const, message: 'test' as const });
        });
        expectTypeOf(output).toEqualTypeOf<
          Result_Error<{ code: 2; message: 'test' }>
        >();
      });

      it('for ok result as input and ambiguous result as return type, it infers the output same as return type', () => {
        const result = ok(1);
        const output = andThen(result, () => {
          return ok('a different result') as Result<
            string,
            { code: 2; message: string }
          >;
        });
        expectTypeOf(output).toEqualTypeOf<
          Result<string, { code: 2; message: string }>
        >();
      });

      it('for error result as input and ok as return type, it infers the output same as input type', () => {
        const result = error({ code: 1 as const, message: 'test' });
        const output = andThen(result, () => {
          return ok('a different result');
        });
        expectTypeOf(output).toEqualTypeOf<
          Result_Error<{ code: 1; message: string }>
        >();
      });

      it('for error result as input and error as return type, it infers the output same as input type', () => {
        const result = error({ code: 1 as const, message: 'test' });
        const output = andThen(result, () => {
          return error({ code: 2 as const, message: 'test2' });
        });
        expectTypeOf(output).toEqualTypeOf<
          Result_Error<{ code: 1; message: string }>
        >();
      });

      it('for error result as input and ambiguous result as return type, it infers the output same as input type', () => {
        const result = error({ code: 1 as const, message: 'test' });
        const output = andThen(result, () => {
          return ok('a different result') as Result<
            string,
            { code: 2; message: string }
          >;
        });
        expectTypeOf(output).toEqualTypeOf<
          Result_Error<{ code: 1; message: string }>
        >();
      });

      it('for ambiguous result as input and ok result as return type, it infers an ambiguous result with ok type from output and error type from input', () => {
        const result = ok(1) as Result<number, { code: 1; message: string }>;
        const output = andThen(result, () => {
          return ok('a different result' as const);
        });
        expectTypeOf(output).toEqualTypeOf<
          Result<'a different result', { code: 1; message: string }>
        >();
      });

      it('for ambiguous result as input and error result as return type, it infers an ambiguous result with ok type as never and the error type from the input', () => {
        const result = ok(1) as Result<number, { code: 1; message: string }>;
        const output = andThen(result, () => {
          return error({ code: 2 as const, message: 'test2' as const });
        });
        expectTypeOf(output).toEqualTypeOf<
          Result<
            never,
            { code: 1; message: string } | { code: 2; message: 'test2' }
          >
        >();
      });

      it('for ambiguous result as input and ambiguous result as return type, it infers an ambiguous result with ok type from output and the error type as a union of the two error types', () => {
        const result = ok(1) as Result<number, { code: 1; message: string }>;
        const output = andThen(result, () => {
          return ok('a different result') as Result<
            string,
            { code: 2; message: string }
          >;
        });
        expectTypeOf(output).toEqualTypeOf<
          Result<
            string,
            { code: 1; message: string } | { code: 2; message: string }
          >
        >();
      });
    });
  });

  describe('pipeable version', () => {
    it('for ok result as input, it returns the result of fn', () => {
      const result = ok(1);
      const andThened = pipe(
        result,
        andThen(() => ok('a different result')),
      );
      expect(andThened).toEqual(ok('a different result'));
    });

    it('for error result as input, it returns the input', () => {
      const result = error({ code: 1, message: 'test' });
      const andThened = pipe(
        result,
        andThen(() => ok('a different result')),
      );
      expect(andThened).toEqual(error({ code: 1, message: 'test' }));
    });

    describe('typings', () => {
      it('for ok result as input, it infers the fn parameter as the ok type', () => {
        const result = ok(1);
        pipe(
          result,
          andThen((value) => {
            expectTypeOf(value).toEqualTypeOf<number>();
            return ok(value + 1);
          }),
        );
      });

      it('for error result as input, it infers the fn parameter as never', () => {
        const result = error({ code: 1 as const, message: 'test' });
        pipe(
          result,
          andThen((value) => {
            expectTypeOf(value).toEqualTypeOf<never>();
            return ok('a different result');
          }),
        );
      });

      it('for ambiguous result as input, it infers the fn parameter as the ok type', () => {
        const result = ok(1) as Result<number, { code: 1; message: string }>;
        pipe(
          result,
          andThen((value) => {
            expectTypeOf(value).toEqualTypeOf<number>();
            return ok('a different result');
          }),
        );
      });

      it('for ok result as input and ok as return type, it infers the output same as return type', () => {
        const result = ok(1);
        const output = pipe(
          result,
          andThen(() => {
            return ok('a different result' as const);
          }),
        );
        expectTypeOf(output).toEqualTypeOf<Result_Ok<'a different result'>>();
      });

      it('for ok result as input and error as return type, it infers the output same as return type', () => {
        const result = ok(1);
        const output = pipe(
          result,
          andThen(() => {
            return error({ code: 2 as const, message: 'test' as const });
          }),
        );
        expectTypeOf(output).toEqualTypeOf<
          Result_Error<{ code: 2; message: 'test' }>
        >();
      });

      it('for ok result as input and ambiguous result as return type, it infers the output same as return type', () => {
        const result = ok(1);
        const output = pipe(
          result,
          andThen(() => {
            return ok('a different result') as Result<
              string,
              { code: 2; message: string }
            >;
          }),
        );
        expectTypeOf(output).toEqualTypeOf<
          Result<string, { code: 2; message: string }>
        >();
      });

      it('for error result as input and ok as return type, it infers the output same as input type', () => {
        const result = error({ code: 1 as const, message: 'test' });
        const output = pipe(
          result,
          andThen(() => {
            return ok('a different result');
          }),
        );
        expectTypeOf(output).toEqualTypeOf<
          Result_Error<{ code: 1; message: string }>
        >();
      });

      it('for error result as input and error as return type, it infers the output same as input type', () => {
        const result = error({ code: 1 as const, message: 'test' });
        const output = pipe(
          result,
          andThen(() => {
            return error({ code: 2 as const, message: 'test2' });
          }),
        );
        expectTypeOf(output).toEqualTypeOf<
          Result_Error<{ code: 1; message: string }>
        >();
      });

      it('for error result as input and ambiguous result as return type, it infers the output same as input type', () => {
        const result = error({ code: 1 as const, message: 'test' });
        const output = pipe(
          result,
          andThen(() => {
            return ok('a different result') as Result<
              string,
              { code: 2; message: string }
            >;
          }),
        );
        expectTypeOf(output).toEqualTypeOf<
          Result_Error<{ code: 1; message: string }>
        >();
      });

      it('for ambiguous result as input and ok result as return type, it infers an ambiguous result with ok type from output and error type from input', () => {
        const result = ok(1) as Result<number, { code: 1; message: string }>;
        const output = pipe(
          result,
          andThen(() => {
            return ok('a different result' as const);
          }),
        );
        expectTypeOf(output).toEqualTypeOf<
          Result<'a different result', { code: 1; message: string }>
        >();
      });

      it('for ambiguous result as input and error result as return type, it infers an ambiguous result with ok type as never and the error type from the input', () => {
        const result = ok(1) as Result<number, { code: 1; message: string }>;
        const output = pipe(
          result,
          andThen(() => {
            return error({ code: 2 as const, message: 'test2' as const });
          }),
        );
        expectTypeOf(output).toEqualTypeOf<
          Result<
            never,
            { code: 1; message: string } | { code: 2; message: 'test2' }
          >
        >();
      });

      it('for ambiguous result as input and ambiguous result as return type, it infers an ambiguous result with ok type from output and the error type as a union of the two error types', () => {
        const result = ok(1) as Result<number, { code: 1; message: string }>;
        const output = pipe(
          result,
          andThen(() => {
            return ok('a different result') as Result<
              string,
              { code: 2; message: string }
            >;
          }),
        );
        expectTypeOf(output).toEqualTypeOf<
          Result<
            string,
            { code: 1; message: string } | { code: 2; message: string }
          >
        >();
      });
    });
  });
});
