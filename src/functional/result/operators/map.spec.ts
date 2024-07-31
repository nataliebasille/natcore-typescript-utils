import { expectTypeOf } from 'expect-type';
import { error, ok } from '../factories';
import { map } from './map';
import { type Result_Ok, type Result, type Result_Error } from '../types';
import { pipe } from '../../pipe';

describe('result.map', () => {
  describe('non-pipeable version', () => {
    it('if input is ok, it remaps the value with fn', () => {
      const result = ok(1);
      const mapped = map(result, (value) => value + 1);
      expect(mapped).toEqual(ok(2));
    });

    it('if input is error, it returns the input', () => {
      const result = error('test');
      const mapped = map(result, (value) => value + 1);
      expect(mapped).toEqual(error('test'));
    });

    describe('typings', () => {
      it('for ok result as input, it infers the fn parameter as the ok value', () => {
        const result = ok(1);
        map(result, (value) => {
          expectTypeOf(value).toEqualTypeOf<number>();
          return value + 1;
        });
      });

      it('for error result as input, it infers the fn parameter as never', () => {
        const result = error('test');
        map(result, (value) => {
          expectTypeOf(value).toEqualTypeOf<never>();
          return value + 1;
        });
      });

      it('for ambiguous result as input, it infers the fn parameter as the ok value', () => {
        const result = ok(1) as Result<number, { code: 1; message: string }>;
        map(result, (value) => {
          expectTypeOf(value).toEqualTypeOf<number>();
          return value + 1;
        });
      });

      it('for ok result as input, it infers the output as ok with value of return type of fn', () => {
        const result = ok(1);
        const output = map(result, () => {
          return 'different result' as const;
        });
        expectTypeOf(output).toEqualTypeOf<Result_Ok<'different result'>>();
      });

      it('for error result as input, it infers the output same as input', () => {
        const result = error('test' as const);
        const output = map(result, () => {
          return 'different result' as const;
        });
        expectTypeOf(output).toEqualTypeOf<Result_Error<'test'>>();
      });

      it('for ambiguous result as input, it infers the output as result with ok type as the return type of fn and the error type as the error type of the input', () => {
        const result = ok(1) as Result<number, { code: 1; message: string }>;
        const output = map(result, () => {
          return 'different result' as const;
        });
        expectTypeOf(output).toEqualTypeOf<
          Result<'different result', { code: 1; message: string }>
        >();
      });
    });
  });

  describe('pipeable version', () => {
    it('if input is ok, it remaps the value with fn', () => {
      const result = ok(1);
      const mapped = pipe(
        result,
        map((value) => value + 1),
      );
      expect(mapped).toEqual(ok(2));
    });

    it('if input is error, it returns the input', () => {
      const result = error('test');
      const mapped = pipe(
        result,
        map((value) => value + 1),
      );
      expect(mapped).toEqual(error('test'));
    });

    describe('typings', () => {
      it('for ok result as input, it infers the fn parameter as the ok value', () => {
        const result = ok(1);
        pipe(
          result,
          map((value) => {
            expectTypeOf(value).toEqualTypeOf<number>();
            return value + 1;
          }),
        );
      });

      it('for error result as input, it infers the fn parameter as never', () => {
        const result = error('test');
        pipe(
          result,
          map((value) => {
            expectTypeOf(value).toEqualTypeOf<never>();
            return value + 1;
          }),
        );
      });

      it('for ambiguous result as input, it infers the fn parameter as the ok value', () => {
        const result = ok(1) as Result<number, { code: 1; message: string }>;
        pipe(
          result,
          map((value) => {
            expectTypeOf(value).toEqualTypeOf<number>();
            return value + 1;
          }),
        );
      });

      it('for ok result as input, it infers the output as ok with value of return type of fn', () => {
        const result = ok(1);
        const output = pipe(
          result,
          map(() => {
            return 'different result' as const;
          }),
        );
        expectTypeOf(output).toEqualTypeOf<Result_Ok<'different result'>>();
      });

      it('for error result as input, it infers the output same as input', () => {
        const result = error('test' as const);
        const output = pipe(
          result,
          map(() => {
            return 'different result' as const;
          }),
        );
        expectTypeOf(output).toEqualTypeOf<Result_Error<'test'>>();
      });

      it('for ambiguous result as input, it infers the output as result with ok type as the return type of fn and the error type as the error type of the input', () => {
        const result = ok(1) as Result<number, { code: 1; message: string }>;
        const output = pipe(
          result,
          map(() => {
            return 'different result' as const;
          }),
        );
        expectTypeOf(output).toEqualTypeOf<
          Result<'different result', { code: 1; message: string }>
        >();
      });
    });
  });
});
