import { expectTypeOf } from 'expect-type';
import { orElse } from './orElse';
import { error, ok } from '../factories';
import { type Result, type Result_Error, type Result_Ok } from '../types';
import { pipe } from '../../pipe';

describe('result.orElse', () => {
  describe('non-pipeable version', () => {
    it('it returns the result of input if it is ok', () => {
      const result = ok(1);
      const orElsed = orElse(result, () => ok('a different result'));
      expect(orElsed).toEqual(result);
    });

    it('it returns the ok result of fn if input is error', () => {
      const result = error({ code: 1, message: 'test' });
      const orElsed = orElse(result, () => ok('a different result'));
      expect(orElsed).toEqual(ok('a different result'));
    });

    it('results the error of fn if input is error', () => {
      const result = error({ code: 1, message: 'test' });
      const orElsed = orElse(result, () =>
        error({ code: 2, message: 'test2' }),
      );
      expect(orElsed).toEqual(error({ code: 2, message: 'test2' }));
    });

    describe('typings', () => {
      it('for ok result as input, it infers the fn parameter as never', () => {
        const result = ok(1);
        orElse(result, (value) => {
          expectTypeOf(value).toEqualTypeOf<never>();
          return ok(value + 1);
        });
      });

      it('for error result as input, it infers the fn parameter the same type as the error type', () => {
        const result = error({ code: 1 as const, message: 'test' });
        orElse(result, (value) => {
          expectTypeOf(value).toEqualTypeOf<{ code: 1; message: string }>();
          return ok('a different result');
        });
      });

      it('for ambiguous result as input, it infers the fn parameter the same type as the error type', () => {
        const result = ok(1) as Result<number, { code: 1; message: string }>;
        orElse(result, (value) => {
          expectTypeOf(value).toEqualTypeOf<{ code: 1; message: string }>();
          return ok('a different result');
        });
      });

      it('for ok result as input and ok as return type, it infers the output same as input type', () => {
        const result = ok(1);
        const output = orElse(result, () => {
          return ok('a different result');
        });
        expectTypeOf(output).toEqualTypeOf<Result_Ok<number>>();
      });

      it('for ok result as input and error as return type, it infers the output same as input type', () => {
        const result = ok(1);
        const output = orElse(result, () => {
          return error({ code: 2, message: 'test' });
        });
        expectTypeOf(output).toEqualTypeOf<Result_Ok<number>>();
      });

      it('for ok result as input an ambiguous result as return type, it infers the output same as input type', () => {
        const result = ok(1);
        const output = orElse(result, () => {
          return ok('a different result') as Result<
            string,
            { code: 2; message: string }
          >;
        });
        expectTypeOf(output).toEqualTypeOf<Result_Ok<number>>();
      });

      it('for error result as input and ok as return type, it infers the output same as return type', () => {
        const result = error({ code: 1 as const, message: 'test' });
        const output = orElse(result, () => {
          return ok('a different result');
        });
        expectTypeOf(output).toEqualTypeOf<Result_Ok<string>>();
      });

      it('for error result as input and error as return type, it infers the output same as return type', () => {
        const result = error({ code: 1 as const, message: 'test' });
        const output = orElse(result, () => {
          return error({ code: 2 as const, message: 'test2' });
        });
        expectTypeOf(output).toEqualTypeOf<
          Result_Error<{ code: 2; message: string }>
        >();
      });

      it('for error result as input and ambiguous result as return type, it infers the output same as return type', () => {
        const result = error({ code: 1 as const, message: 'test' });
        const output = orElse(result, () => {
          return ok('a different result') as Result<
            string,
            { code: 2; message: string }
          >;
        });
        expectTypeOf(output).toEqualTypeOf<
          Result<string, { code: 2; message: string }>
        >();
      });

      it('for ambiguous result as input and ok result as return type, it infers an ok result with the union of the two types', () => {
        const result = ok(1) as Result<number, { code: 1; message: string }>;
        const output = orElse(result, () => {
          return ok('a different result');
        });
        expectTypeOf(output).toEqualTypeOf<Result_Ok<number | string>>();
      });

      it('for ambiguous result as input and error result as return type, it infers an ambiguous result with ok type from input and the error type from the return', () => {
        const result = ok(1) as Result<number, { code: 1; message: string }>;
        const output = orElse(result, () => {
          return error({ code: 2 as const, message: 'test2' });
        });
        expectTypeOf(output).toEqualTypeOf<
          Result<number, { code: 2; message: string }>
        >();
      });

      it('for ambiguous result as input and ambiguous result as return type, it infers an ambiguous result with ok as union of the two types and the error type from the output', () => {
        const result = ok(1) as Result<number, { code: 1; message: string }>;
        const output = orElse(result, () => {
          return ok('a different result') as Result<
            string,
            { code: 2; message: string }
          >;
        });
        expectTypeOf(output).toEqualTypeOf<
          Result<number | string, { code: 2; message: string }>
        >();
      });
    });
  });

  describe('pipeable version', () => {
    it('it returns the result of input if it is ok', () => {
      const result = ok(1);
      const orElsed = pipe(
        result,
        orElse(() => ok('a different result')),
      );
      expect(orElsed).toEqual(result);
    });

    it('it returns the ok result of fn if input is error', () => {
      const result = error({ code: 1, message: 'test' });
      const orElsed = pipe(
        result,
        orElse(() => ok('a different result')),
      );
      expect(orElsed).toEqual(ok('a different result'));
    });

    it('results the error of fn if input is error', () => {
      const result = error({ code: 1, message: 'test' });
      const orElsed = pipe(
        result,
        orElse(() => error({ code: 2, message: 'test2' })),
      );
      expect(orElsed).toEqual(error({ code: 2, message: 'test2' }));
    });

    describe('typings', () => {
      it('for ok result as input, it infers the fn parameter as never', () => {
        const result = ok(1);
        pipe(
          result,
          orElse((value) => {
            expectTypeOf(value).toEqualTypeOf<never>();
            return ok(value + 1);
          }),
        );
      });

      it('for error result as input, it infers the fn parameter the same type as the error type', () => {
        const result = error({ code: 1 as const, message: 'test' });
        pipe(
          result,
          orElse((value) => {
            expectTypeOf(value).toEqualTypeOf<{ code: 1; message: string }>();
            return ok('a different result');
          }),
        );
      });

      it('for ambiguous result as input, it infers the fn parameter the same type as the error type', () => {
        const result = ok(1) as Result<number, { code: 1; message: string }>;
        pipe(
          result,
          orElse((value) => {
            expectTypeOf(value).toEqualTypeOf<{ code: 1; message: string }>();
            return ok('a different result');
          }),
        );
      });

      it('for ok result as input and ok as return type, it infers the output same as input type', () => {
        const result = ok(1);
        const output = pipe(
          result,
          orElse(() => {
            return ok('a different result');
          }),
        );
        expectTypeOf(output).toEqualTypeOf<Result_Ok<number>>();
      });

      it('for ok result as input and error as return type, it infers the output same as input type', () => {
        const result = ok(1);
        const output = pipe(
          result,
          orElse(() => {
            return error({ code: 2, message: 'test' });
          }),
        );
        expectTypeOf(output).toEqualTypeOf<Result_Ok<number>>();
      });

      it('for ok result as input an ambiguous result as return type, it infers the output same as input type', () => {
        const result = ok(1);
        const output = pipe(
          result,
          orElse(() => {
            return ok('a different result') as Result<
              string,
              { code: 2; message: string }
            >;
          }),
        );
        expectTypeOf(output).toEqualTypeOf<Result_Ok<number>>();
      });

      it('for error result as input and ok as return type, it infers the output same as return type', () => {
        const result = error({ code: 1 as const, message: 'test' });
        const output = pipe(
          result,
          orElse(() => {
            return ok('a different result');
          }),
        );
        expectTypeOf(output).toEqualTypeOf<Result_Ok<string>>();
      });

      it('for error result as input and error as return type, it infers the output same as return type', () => {
        const result = error({ code: 1 as const, message: 'test' });
        const output = pipe(
          result,
          orElse(() => {
            return error({ code: 2 as const, message: 'test2' });
          }),
        );
        expectTypeOf(output).toEqualTypeOf<
          Result_Error<{ code: 2; message: string }>
        >();
      });

      it('for error result as input and ambiguous result as return type, it infers the output same as return type', () => {
        const result = error({ code: 1 as const, message: 'test' });
        const output = pipe(
          result,
          orElse(() => {
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

      it('for ambiguous result as input and ok result as return type, it infers an ok result with the union of the two types', () => {
        const result = ok(1) as Result<number, { code: 1; message: string }>;
        const output = pipe(
          result,
          orElse(() => {
            return ok('a different result');
          }),
        );
        expectTypeOf(output).toEqualTypeOf<Result_Ok<number | string>>();
      });

      it('for ambiguous result as input and error result as return type, it infers an ambiguous result with ok type from input and the error type from the return', () => {
        const result = ok(1) as Result<number, { code: 1; message: string }>;
        const output = pipe(
          result,
          orElse(() => {
            return error({ code: 2 as const, message: 'test2' });
          }),
        );
        expectTypeOf(output).toEqualTypeOf<
          Result<number, { code: 2; message: string }>
        >();
      });

      it('for ambiguous result as input and ambiguous result as return type, it infers an ambiguous result with ok type from input and the error type as a union of the two error types', () => {
        const result = ok(1) as Result<number, { code: 1; message: string }>;
        const output = pipe(
          result,
          orElse(() => {
            return ok('a different result') as Result<
              string,
              { code: 2; message: string }
            >;
          }),
        );
        expectTypeOf(output).toEqualTypeOf<
          Result<number | string, { code: 2; message: string }>
        >();
      });
    });
  });
});
