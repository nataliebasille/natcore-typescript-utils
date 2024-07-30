import { expectTypeOf } from 'expect-type';
import { error, ok } from '../factories';
import { match } from './match';
import { type Result } from '../types';
import { pipe } from '../../pipe';

describe('result.match', () => {
  describe('non-pipeable version', () => {
    it('if input is ok, it returns the ok value', () => {
      const result = ok(1);
      const matched = match(result, {
        ok: (value) => value + 1,
        error: () => 'error',
      });
      expect(matched).toEqual(2);
    });

    it('if input is error, it returns the error value', () => {
      const result = error('test');
      const matched = match(result, {
        ok: () => 'ok',
        error: (value) => value,
      });
      expect(matched).toEqual('test');
    });

    describe('typings', () => {
      it('for ok result as input, it infers the parameter to the ok matcher as the ok value', () => {
        const result = ok(1);
        match(result, {
          ok: (value) => {
            expectTypeOf(value).toEqualTypeOf<number>();
            return value + 1;
          },
          error: () => 'error',
        });
      });

      it('for ok result as input, it infers the parameter to the error matcher as never', () => {
        const result = ok(1);
        match(result, {
          ok: () => 'ok',
          error: (value) => {
            expectTypeOf(value).toEqualTypeOf<never>();
            return 'error';
          },
        });
      });

      it('for error result as input, it infers the parameter to the ok matcher as never', () => {
        const result = error('test');
        match(result, {
          ok: () => 'ok',
          error: (value) => {
            expectTypeOf(value).toEqualTypeOf<string>();
            return 'error';
          },
        });
      });

      it('for error result as input, it infers the parameter to the error matcher as the error value', () => {
        const result = error('test');
        match(result, {
          ok: () => 'ok',
          error: (value) => {
            expectTypeOf(value).toEqualTypeOf<string>();
            return 'error';
          },
        });
      });

      it('for ambiguous result as input, it infers the parameter to the ok matcher as the ok value', () => {
        const result = ok(1) as Result<number, { code: 1; message: string }>;
        match(result, {
          ok: (value) => {
            expectTypeOf(value).toEqualTypeOf<number>();
            return value + 1;
          },
          error: () => 'error',
        });
      });

      it('for ambiguous result as input, it infers the parameter to the error matcher as the error value', () => {
        const result = ok(1) as Result<number, { code: 1; message: string }>;
        match(result, {
          ok: () => 'ok',
          error: (value) => {
            expectTypeOf(value).toEqualTypeOf<{ code: 1; message: string }>();
            return 'error';
          },
        });
      });

      it('for ok result as input, it infers the output as the result type of the ok matcher', () => {
        const result = ok(1);
        const output = match(result, {
          ok: () => {
            return 'ok value' as const;
          },
          error: () => 'error',
        });
        expectTypeOf(output).toEqualTypeOf<'ok value'>();
      });

      it('for error result as input, it infers the output as the result type of the error matcher', () => {
        const result = error('test');
        const output = match(result, {
          ok: () => 'ok',
          error: () => {
            return 'error value' as const;
          },
        });
        expectTypeOf(output).toEqualTypeOf<'error value'>();
      });

      it('for ambiguous result as input, it infers the output as the union of the result type of the matchers', () => {
        const result = ok(1) as Result<number, { code: 1; message: string }>;
        const output = match(result, {
          ok: () => {
            return 'ok value' as const;
          },
          error: () => {
            return 'error value' as const;
          },
        });
        expectTypeOf(output).toEqualTypeOf<'ok value' | 'error value'>();
      });
    });
  });

  describe('pipeable version', () => {
    it('if input is ok, it returns the ok value', () => {
      const result = ok(1);
      const matched = pipe(
        result,
        match({
          ok: (value) => value + 1,
          error: () => 'error',
        }),
      );
      expect(matched).toEqual(2);
    });

    it('if input is error, it returns the error value', () => {
      const result = error('test');
      const matched = pipe(
        result,
        match({
          ok: () => 'ok',
          error: (value) => value,
        }),
      );
      expect(matched).toEqual('test');
    });

    describe('typings', () => {
      it('for ok result as input, it infers the parameter to the ok matcher as the ok value', () => {
        const result = ok(1);
        pipe(
          result,
          match({
            ok: (value) => {
              expectTypeOf(value).toEqualTypeOf<number>();
              return value + 1;
            },
            error: () => 'error',
          }),
        );
      });

      it('for ok result as input, it infers the parameter to the error matcher as never', () => {
        const result = ok(1);
        pipe(
          result,
          match({
            ok: () => 'ok',
            error: (value) => {
              expectTypeOf(value).toEqualTypeOf<never>();
              return 'error';
            },
          }),
        );
      });

      it('for error result as input, it infers the parameter to the ok matcher as never', () => {
        const result = error('test');
        pipe(
          result,
          match({
            ok: () => 'ok',
            error: (value) => {
              expectTypeOf(value).toEqualTypeOf<string>();
              return 'error';
            },
          }),
        );
      });

      it('for error result as input, it infers the parameter to the error matcher as the error value', () => {
        const result = error('test');
        pipe(
          result,
          match({
            ok: () => 'ok',
            error: (value) => {
              expectTypeOf(value).toEqualTypeOf<string>();
              return 'error';
            },
          }),
        );
      });

      it('for ambiguous result as input, it infers the parameter to the ok matcher as the ok value', () => {
        const result = ok(1) as Result<number, { code: 1; message: string }>;
        pipe(
          result,
          match({
            ok: (value) => {
              expectTypeOf(value).toEqualTypeOf<number>();
              return value + 1;
            },
            error: () => 'error',
          }),
        );
      });

      it('for ambiguous result as input, it infers the parameter to the error matcher as the error value', () => {
        const result = ok(1) as Result<number, { code: 1; message: string }>;
        pipe(
          result,
          match({
            ok: () => 'ok',
            error: (value) => {
              expectTypeOf(value).toEqualTypeOf<{ code: 1; message: string }>();
              return 'error';
            },
          }),
        );
      });

      it('for ok result as input, it infers the output as the result type of the ok matcher', () => {
        const result = ok(1);
        const output = pipe(
          result,
          match({
            ok: () => {
              return 'ok value' as const;
            },
            error: () => 'error',
          }),
        );
        expectTypeOf(output).toEqualTypeOf<'ok value'>();
      });

      it('for error result as input, it infers the output as the result type of the error matcher', () => {
        const result = error('test');
        const output = pipe(
          result,
          match({
            ok: () => 'ok',
            error: () => {
              return 'error value' as const;
            },
          }),
        );
        expectTypeOf(output).toEqualTypeOf<'error value'>();
      });

      it('for ambiguous result as input, it infers the output as the union of the result type of the matchers', () => {
        const result = ok(1) as Result<number, { code: 1; message: string }>;
        const output = pipe(
          result,
          match({
            ok: () => {
              return 'ok value' as const;
            },
            error: () => {
              return 'error value' as const;
            },
          }),
        );
        expectTypeOf(output).toEqualTypeOf<'ok value' | 'error value'>();
      });
    });
  });
});
