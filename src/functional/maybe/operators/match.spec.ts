import { expectTypeOf } from 'expect-type';
import { none, some } from '../factories';
import { match } from './match';
import { type Maybe } from '../types';
import { pipe } from '../../pipe';

describe('maybe.match', () => {
  describe('non-pipeable version', () => {
    it('if input is some, it returns the result of the some matcher', () => {
      const maybe = some('test');
      const matched = match(maybe, {
        some: (value) => value.length,
        none: () => 'none',
      });
      expect(matched).toEqual(4);
    });

    it('if input is none, it returns the result of the none matcher', () => {
      const maybe = none();
      const matched = match(maybe, {
        some: () => 'some',
        none: () => 'none',
      });
      expect(matched).toEqual('none');
    });

    describe('typings', () => {
      it('for some maybe as input, it infers the parameter to the some matcher as the some type', () => {
        const maybe = some('test');
        match(maybe, {
          some: (value) => {
            expectTypeOf(value).toEqualTypeOf<string>();
            return value.length;
          },
          none: () => 'none',
        });
      });

      it('for none maybe as input, it infers the parameter to the some matcher as never', () => {
        const maybe = none();
        match(maybe, {
          some: (value) => {
            expectTypeOf(value).toEqualTypeOf<never>();
            return 'some';
          },
          none: () => 'none',
        });
      });

      it('for ambiguous maybe as input, it infers the parameter to the some matcher as the some type', () => {
        const maybe = some('test') as Maybe<string>;
        match(maybe, {
          some: (value) => {
            expectTypeOf(value).toEqualTypeOf<string>();
            return value.length;
          },
          none: () => 'none',
        });
      });

      it('for some maybe as input, it infers the output as the result type of the some matcher', () => {
        const maybe = some('test');
        const output = match(maybe, {
          some: () => {
            return 'some value' as const;
          },
          none: () => 'none',
        });
        expectTypeOf(output).toEqualTypeOf<'some value'>();
      });

      it('for none maybe as input, it infers the output as the result type of the none matcher', () => {
        const maybe = none();
        const output = match(maybe, {
          some: () => 'some',
          none: () => {
            return 'none value' as const;
          },
        });
        expectTypeOf(output).toEqualTypeOf<'none value'>();
      });

      it('for ambiguous maybe as input, it infers the output as the union of the result type of the matchers', () => {
        const maybe = some('test') as Maybe<string>;
        const output = match(maybe, {
          some: () => {
            return 'some value' as const;
          },
          none: () => {
            return 'none value' as const;
          },
        });
        expectTypeOf(output).toEqualTypeOf<'some value' | 'none value'>();
      });
    });
  });

  describe('pipeable version', () => {
    it('if input is some, it returns the result of the some matcher', () => {
      const maybe = some('test');
      const matched = pipe(
        maybe,
        match({
          some: (value) => value.length,
          none: () => 'none',
        }),
      );
      expect(matched).toEqual(4);
    });

    it('if input is none, it returns the result of the none matcher', () => {
      const maybe = none();
      const matched = pipe(
        maybe,
        match({
          some: () => 'some',
          none: () => 'none',
        }),
      );
      expect(matched).toEqual('none');
    });

    describe('typings', () => {
      it('for some maybe as input, it infers the parameter to the some matcher as the some type', () => {
        const maybe = some('test');
        pipe(
          maybe,
          match({
            some: (value) => {
              expectTypeOf(value).toEqualTypeOf<string>();
              return value.length;
            },
            none: () => 'none',
          }),
        );
      });

      it('for none maybe as input, it infers the parameter to the some matcher as never', () => {
        const maybe = none();
        pipe(
          maybe,
          match({
            some: (value) => {
              expectTypeOf(value).toEqualTypeOf<never>();
              return 'some';
            },
            none: () => 'none',
          }),
        );
      });

      it('for ambiguous maybe as input, it infers the parameter to the some matcher as the some type', () => {
        const maybe = some('test') as Maybe<string>;
        pipe(
          maybe,
          match({
            some: (value) => {
              expectTypeOf(value).toEqualTypeOf<string>();
              return value.length;
            },
            none: () => 'none',
          }),
        );
      });

      it('for some maybe as input, it infers the output as the result type of the some matcher', () => {
        const maybe = some('test');
        const output = match(maybe, {
          some: () => {
            return 'some value' as const;
          },
          none: () => 'none',
        });
        expectTypeOf(output).toEqualTypeOf<'some value'>();
      });

      it('for none maybe as input, it infers the output as the result type of the none matcher', () => {
        const maybe = none();
        const output = match(maybe, {
          some: () => 'some',
          none: () => {
            return 'none value' as const;
          },
        });
        expectTypeOf(output).toEqualTypeOf<'none value'>();
      });

      it('for ambiguous maybe as input, it infers the output as the union of the result type of the matchers', () => {
        const maybe = some('test') as Maybe<string>;
        const output = match(maybe, {
          some: () => {
            return 'some value' as const;
          },
          none: () => {
            return 'none value' as const;
          },
        });
        expectTypeOf(output).toEqualTypeOf<'some value' | 'none value'>();
      });
    });
  });
});
