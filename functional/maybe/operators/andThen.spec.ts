import { expectTypeOf } from 'expect-type';
import { none, some } from '../factories';
import { andThen } from './andThen';
import { type Maybe_None, type Maybe_Some, type Maybe } from '../types';
import { pipe } from '../../pipe';

describe('maybe.andThen', () => {
  describe('non-pipeable version', () => {
    it('if input is some, it returns the result of fn', () => {
      const maybe = some('test');
      const andThened = andThen(maybe, () => some('a different result'));
      expect(andThened).toEqual(some('a different result'));
    });

    it('if input is none, it returns the input', () => {
      const maybe = none();
      const andThened = andThen(maybe, () => some('a different result'));
      expect(andThened).toEqual(maybe);
    });

    describe('typings', () => {
      it('for some result as input, it infers the fn parameter as the some type', () => {
        const maybe = some('test');
        andThen(maybe, (value) => {
          expectTypeOf(value).toEqualTypeOf<string>();
          return some(value + 1);
        });
      });

      it('for none result as input, it infers the fn parameter as never', () => {
        const maybe = none();
        andThen(maybe, (value) => {
          expectTypeOf(value).toEqualTypeOf<never>();
          return some('a different result');
        });
      });

      it('for ambiguous result as input, it infers the fn parameter as the some type', () => {
        const maybe = some('test') as Maybe<string>;
        andThen(maybe, (value) => {
          expectTypeOf(value).toEqualTypeOf<string>();
          return some('a different result');
        });
      });

      it('for some result as input and some as return type, it infers the output same as return type', () => {
        const maybe = some('test');
        const output = andThen(maybe, () => {
          return some('a different result' as const);
        });
        expectTypeOf(output).toEqualTypeOf<Maybe_Some<'a different result'>>();
      });

      it('for some result as input and none as return type, it infers the output same as input', () => {
        const maybe = some('test');
        const output = andThen(maybe, () => {
          return none();
        });
        expectTypeOf(output).toEqualTypeOf<Maybe_None>();
      });

      it('for some result as input and ambiguous result as return type, it infers the output same as return type', () => {
        const maybe = some('test');
        const output = andThen(maybe, () => {
          return some('a different result') as Maybe<string>;
        });
        expectTypeOf(output).toEqualTypeOf<Maybe<string>>();
      });

      it('for none result as input and some as return type, it infers the output same as input', () => {
        const maybe = none();
        const output = andThen(maybe, () => {
          return some('a different result');
        });
        expectTypeOf(output).toEqualTypeOf<Maybe_None>();
      });

      it('for none result as input and none as return type, it infers the output same as input', () => {
        const maybe = none();
        const output = andThen(maybe, () => {
          return none();
        });
        expectTypeOf(output).toEqualTypeOf<Maybe_None>();
      });

      it('for none result as input and ambiguous result as return type, it infers the output same as return type', () => {
        const maybe = none();
        const output = andThen(maybe, () => {
          return none() as Maybe<string>;
        });
        expectTypeOf(output).toEqualTypeOf<Maybe_None>();
      });

      it('for ambiguous result as input and some result as return type, it infers the output same as return type', () => {
        const maybe = none() as Maybe<string>;
        const output = andThen(maybe, () => {
          return some('a different result' as const);
        });
        expectTypeOf(output).toEqualTypeOf<Maybe_Some<'a different result'>>();
      });

      it('for ambiguous result as input and none result as return type, it infers the output same as return type', () => {
        const maybe = none() as Maybe<string>;
        const output = andThen(maybe, () => {
          return none();
        });
        expectTypeOf(output).toEqualTypeOf<Maybe_None>();
      });

      it('for ambiguous result as input and ambiguous result as return type, it infers the output same as return type', () => {
        const maybe = none() as Maybe<string>;
        const output = andThen(maybe, () => {
          return none() as Maybe<string>;
        });
        expectTypeOf(output).toEqualTypeOf<Maybe<string>>();
      });
    });
  });

  describe('non-pipeable version', () => {
    it('if input is some, it returns the result of fn', () => {
      const maybe = some('test');
      const andThened = pipe(
        maybe,
        andThen(() => some('a different result')),
      );
      expect(andThened).toEqual(some('a different result'));
    });

    it('if input is none, it returns the input', () => {
      const maybe = none();
      const andThened = pipe(
        maybe,
        andThen(() => some('a different result')),
      );
      expect(andThened).toEqual(maybe);
    });

    describe('typings', () => {
      it('for some result as input, it infers the fn parameter as the some type', () => {
        const maybe = some('test');
        pipe(
          maybe,
          andThen((value) => {
            expectTypeOf(value).toEqualTypeOf<string>();
            return some(value + 1);
          }),
        );
      });

      it('for none result as input, it infers the fn parameter as never', () => {
        const maybe = none();
        pipe(
          maybe,
          andThen((value) => {
            expectTypeOf(value).toEqualTypeOf<never>();
            return some('a different result');
          }),
        );
      });

      it('for ambiguous result as input, it infers the fn parameter as the some type', () => {
        const maybe = some('test') as Maybe<string>;
        pipe(
          maybe,
          andThen((value) => {
            expectTypeOf(value).toEqualTypeOf<string>();
            return some('a different result');
          }),
        );
      });

      it('for some result as input and some as return type, it infers the output same as return type', () => {
        const maybe = some('test');
        const output = pipe(
          maybe,
          andThen(() => {
            return some('a different result' as const);
          }),
        );
        expectTypeOf(output).toEqualTypeOf<Maybe_Some<'a different result'>>();
      });

      it('for some result as input and none as return type, it infers the output same as input', () => {
        const maybe = some('test');
        const output = pipe(
          maybe,
          andThen(() => {
            return none();
          }),
        );
        expectTypeOf(output).toEqualTypeOf<Maybe_None>();
      });

      it('for some result as input and ambiguous result as return type, it infers the output same as return type', () => {
        const maybe = some('test');
        const output = pipe(
          maybe,
          andThen(() => {
            return some('a different result') as Maybe<string>;
          }),
        );
        expectTypeOf(output).toEqualTypeOf<Maybe<string>>();
      });

      it('for none result as input and some as return type, it infers the output same as input', () => {
        const maybe = none();
        const output = pipe(
          maybe,
          andThen(() => {
            return some('a different result');
          }),
        );
        expectTypeOf(output).toEqualTypeOf<Maybe_None>();
      });

      it('for none result as input and none as return type, it infers the output same as input', () => {
        const maybe = none();
        const output = pipe(
          maybe,
          andThen(() => {
            return none();
          }),
        );
        expectTypeOf(output).toEqualTypeOf<Maybe_None>();
      });

      it('for none result as input and ambiguous result as return type, it infers the output same as return type', () => {
        const maybe = none();
        const output = pipe(
          maybe,
          andThen(() => {
            return none() as Maybe<string>;
          }),
        );
        expectTypeOf(output).toEqualTypeOf<Maybe_None>();
      });

      it('for ambiguous result as input and some result as return type, it infers the output same as return type', () => {
        const maybe = none() as Maybe<string>;
        const output = pipe(
          maybe,
          andThen(() => {
            return some('a different result' as const);
          }),
        );
        expectTypeOf(output).toEqualTypeOf<Maybe_Some<'a different result'>>();
      });

      it('for ambiguous result as input and none result as return type, it infers the output same as return type', () => {
        const maybe = none() as Maybe<string>;
        const output = pipe(
          maybe,
          andThen(() => {
            return none();
          }),
        );
        expectTypeOf(output).toEqualTypeOf<Maybe_None>();
      });

      it('for ambiguous result as input and ambiguous result as return type, it infers the output same as return type', () => {
        const maybe = none() as Maybe<string>;
        const output = pipe(
          maybe,
          andThen(() => {
            return none() as Maybe<string>;
          }),
        );
        expectTypeOf(output).toEqualTypeOf<Maybe<string>>();
      });
    });
  });
});
