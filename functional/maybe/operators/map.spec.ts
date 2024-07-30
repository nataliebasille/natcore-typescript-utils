import { expectTypeOf } from 'expect-type';
import { none, some } from '../factories';
import { map } from './map';
import { pipe } from '../../pipe';
import { type Maybe_None, type Maybe_Some } from '../types';

describe('map', () => {
  describe('non-pipeable version', () => {
    it('if input is some, it remaps the value with fn', () => {
      const maybe = some('test');
      const mapped = map(maybe, (value) => value + 1);
      expect(mapped).toEqual(some(2));
    });

    it('if input is none, it returns the input', () => {
      const maybe = none();
      const mapped = map(maybe, (value) => value + 1);
      expect(mapped).toEqual(maybe);
    });

    describe('typings', () => {
      it('for some maybe as input, it infers the fn parameter as the some value', () => {
        const maybe = some('test');
        map(maybe, (value) => {
          expectTypeOf(value).toEqualTypeOf<string>();
          return value + 1;
        });
      });

      it('for none maybe as input, it infers the fn parameter as never', () => {
        const maybe = none();
        map(maybe, (value) => {
          expectTypeOf(value).toEqualTypeOf<never>();
          return value + 1;
        });
      });

      it('for some maybe as input, it infers the output as some with value of return type of fn', () => {
        const maybe = some('test');
        const output = map(maybe, () => {
          return 'different result' as const;
        });
        expectTypeOf(output).toEqualTypeOf<Maybe_Some<'different result'>>();
      });

      it('for none maybe as input, it infers the output as none', () => {
        const maybe = none();
        const output = map(maybe, () => {
          return 'different result' as const;
        });
        expectTypeOf(output).toEqualTypeOf<Maybe_None>();
      });
    });
  });

  describe('pipeable version', () => {
    it('if input is some, it remaps the value with fn', () => {
      const maybe = some('test');
      const mapped = pipe(
        maybe,
        map((value) => value + 1),
      );
      expect(mapped).toEqual(some(2));
    });

    it('if input is none, it returns the input', () => {
      const maybe = none();
      const mapped = pipe(
        maybe,
        map((value) => value + 1),
      );
      expect(mapped).toEqual(maybe);
    });

    describe('typings', () => {
      it('for some maybe as input, it infers the fn parameter as the some value', () => {
        const maybe = some('test');
        pipe(
          maybe,
          map((value) => {
            expectTypeOf(value).toEqualTypeOf<string>();
            return value + 1;
          }),
        );
      });

      it('for none maybe as input, it infers the fn parameter as never', () => {
        const maybe = none();
        pipe(
          maybe,
          map((value) => {
            expectTypeOf(value).toEqualTypeOf<never>();
            return value + 1;
          }),
        );
      });

      it('for some maybe as input, it infers the output as some with value of return type of fn', () => {
        const maybe = some('test');
        const output = pipe(
          maybe,
          map(() => {
            return 'different result' as const;
          }),
        );
        expectTypeOf(output).toEqualTypeOf<Maybe_Some<'different result'>>();
      });

      it('for none maybe as input, it infers the output as none', () => {
        const maybe = none();
        const output = pipe(
          maybe,
          map(() => {
            return 'different result' as const;
          }),
        );
        expectTypeOf(output).toEqualTypeOf<Maybe_None>();
      });
    });
  });
});
