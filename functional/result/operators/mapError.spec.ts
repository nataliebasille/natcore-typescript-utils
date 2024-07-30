import { expectTypeOf } from 'expect-type';
import { error, ok } from '../factories';
import { type Result_Ok, type Result, type Result_Error } from '../types';
import { pipe } from '../../pipe';
import { mapError } from './mapError';

describe('result.mapError', () => {
  describe('non-pipeable version', () => {
    it('if input is ok, it returns the input', () => {
      const result = ok(1);
      const mapped = mapError(result, (value) => value + 1);
      expect(mapped).toEqual(ok(1));
    });

    it('if input is error, it remaps the error with fn', () => {
      const result = error('test');
      const mapped = mapError(result, () => 'different result');
      expect(mapped).toEqual(error('different result'));
    });

    describe('typings', () => {
      it('for ok result as input, it infers the fn parameter as never', () => {
        const result = ok(1);
        mapError(result, (value) => {
          expectTypeOf(value).toEqualTypeOf<never>();
          return value + 1;
        });
      });

      it('for error result as input, it infers the fn parameter as error type', () => {
        const result = error('test');
        mapError(result, (value) => {
          expectTypeOf(value).toEqualTypeOf<string>();
          return value + 1;
        });
      });

      it('for ambiguous result as input, it infers the fn parameter as the error type', () => {
        const result = ok(1) as Result<number, { code: 1; message: string }>;
        mapError(result, (value) => {
          expectTypeOf(value).toEqualTypeOf<{ code: 1; message: string }>();
          return { code: 1, message: 'different result' } as const;
        });
      });

      it('for ok result as input, it infers the output as the same as input', () => {
        const result = ok(1);
        const output = mapError(result, () => {
          return 'different result' as const;
        });
        expectTypeOf(output).toEqualTypeOf<Result_Ok<number>>();
      });

      it('for error result as input, it infers the output same as error with value of return type of fn', () => {
        const result = error('test' as const);
        const output = mapError(result, () => {
          return 'different result' as const;
        });
        expectTypeOf(output).toEqualTypeOf<Result_Error<'different result'>>();
      });

      it('for ambiguous result as input, it infers the output as result with ok type as the ok type of input and the error type as the return type of fn', () => {
        const result = ok(1) as Result<number, { code: 1; message: string }>;
        const output = mapError(result, () => {
          return 'different result' as const;
        });
        expectTypeOf(output).toEqualTypeOf<
          Result<number, 'different result'>
        >();
      });
    });
  });

  describe('pipeable version', () => {
    it('if input is ok, it returns the input', () => {
      const result = ok(1);
      const mapped = pipe(
        result,
        mapError((value) => value + 1),
      );
      expect(mapped).toEqual(ok(1));
    });

    it('if input is error, it remaps the error with fn', () => {
      const result = error('test');
      const mapped = pipe(
        result,
        mapError(() => 'different result'),
      );
      expect(mapped).toEqual(error('different result'));
    });

    describe('typings', () => {
      it('for ok result as input, it infers the fn parameter as never', () => {
        const result = ok(1);
        pipe(
          result,
          mapError((value) => {
            expectTypeOf(value).toEqualTypeOf<never>();
            return value + 1;
          }),
        );
      });

      it('for error result as input, it infers the fn parameter as error type', () => {
        const result = error('test');
        pipe(
          result,
          mapError((value) => {
            expectTypeOf(value).toEqualTypeOf<string>();
            return value + 1;
          }),
        );
      });

      it('for ambiguous result as input, it infers the fn parameter as the error type', () => {
        const result = ok(1) as Result<number, { code: 1; message: string }>;
        pipe(
          result,
          mapError((value) => {
            expectTypeOf(value).toEqualTypeOf<{ code: 1; message: string }>();
            return { code: 1, message: 'different result' } as const;
          }),
        );
      });

      it('for ok result as input, it infers the output as the same as input', () => {
        const result = ok(1);
        const output = pipe(
          result,
          mapError(() => {
            return 'different result' as const;
          }),
        );
        expectTypeOf(output).toEqualTypeOf<Result_Ok<number>>();
      });

      it('for error result as input, it infers the output same as error with value of return type of fn', () => {
        const result = error('test' as const);
        const output = pipe(
          result,
          mapError(() => {
            return 'different result' as const;
          }),
        );
        expectTypeOf(output).toEqualTypeOf<Result_Error<'different result'>>();
      });

      it('for ambiguous result as input, it infers the output as result with ok type as the ok type of input and the error type as the return type of fn', () => {
        const result = ok(1) as Result<number, { code: 1; message: string }>;
        const output = pipe(
          result,
          mapError(() => {
            return 'different result' as const;
          }),
        );
        expectTypeOf(output).toEqualTypeOf<
          Result<number, 'different result'>
        >();
      });
    });
  });
});
