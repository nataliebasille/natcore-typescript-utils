import { expectTypeOf } from 'expect-type';
import { none, some } from '../factories';
import { type Maybe_None, type Maybe, type Maybe_Some } from '../types';
import { orElse } from './orElse';
import { pipe } from '../../pipe';

describe('maybe.orElse', () => {
  describe('non-pipeable version', () => {
    it('if input is some, it returns the input', () => {
      const maybe = some('test');
      const orElsed = orElse(maybe, () => some('a different result'));
      expect(orElsed).toEqual(maybe);
    });

    it('if input is none, it returns the result of fn', () => {
      const maybe = none();
      const orElsed = orElse(maybe, () => some('a different result'));
      expect(orElsed).toEqual(some('a different result'));
    });

    describe('typings', () => {
      it('for some maybe as input and some as return type, it infers the output same as input', () => {
        const maybe = some('test');
        const output = orElse(maybe, () => some('a different result'));
        expectTypeOf(output).toEqualTypeOf<Maybe_Some<string>>();
      });

      it('for some maybe as input and none as return type, it infers the output same as input', () => {
        const maybe = some('test');
        const output = orElse(maybe, () => none());
        expectTypeOf(output).toEqualTypeOf<Maybe_Some<string>>();
      });

      it('for some maybe as input and ambiguous result as return type, it infers the output same as input', () => {
        const maybe = some('test');
        const output = orElse(
          maybe,
          () => some('a different result') as Maybe<string>,
        );
        expectTypeOf(output).toEqualTypeOf<Maybe_Some<string>>();
      });

      it('for none maybe as input and some as return type, it infers the output same as return type', () => {
        const maybe = none();
        const output = orElse(maybe, () => some('a different result'));
        expectTypeOf(output).toEqualTypeOf<Maybe_Some<string>>();
      });

      it('for none maybe as input and none as return type, it infers the output same as return type', () => {
        const maybe = none();
        const output = orElse(maybe, () => none());
        expectTypeOf(output).toEqualTypeOf<Maybe_None>();
      });

      it('for none maybe as input and ambiguous result as return type, it infers the output same as return type', () => {
        const maybe = none();
        const output = orElse(maybe, () => none() as Maybe<string>);
        expectTypeOf(output).toEqualTypeOf<Maybe<string>>();
      });

      it('for ambiguous maybe as input and some result as return type, it infers the output as a maybe of the union of the two types', () => {
        const maybe = none() as Maybe<string>;
        const output = orElse(maybe, () => some(2));
        expectTypeOf(output).toEqualTypeOf<Maybe<string | number>>();
      });

      it('for ambiguous maybe as input and none result as return type, it infers the output same as input', () => {
        const maybe = none() as Maybe<string>;
        const output = orElse(maybe, () => none());
        expectTypeOf(output).toEqualTypeOf<Maybe<string>>();
      });

      it('for ambiguous maybe as input and ambiguous result as return type, it infers the output as a maybe of the union of the two types', () => {
        const maybe = none() as Maybe<string>;
        const output = orElse(maybe, () => none() as Maybe<string>);
        expectTypeOf(output).toEqualTypeOf<Maybe<string | string>>();
      });
    });
  });

  describe('pipeable version', () => {
    it('if input is some, it returns the input', () => {
      const maybe = some('test');
      const orElsed = pipe(
        maybe,
        orElse(() => some('a different result')),
      );
      expect(orElsed).toEqual(maybe);
    });

    it('if input is none, it returns the result of fn', () => {
      const maybe = none();
      const orElsed = pipe(
        maybe,
        orElse(() => some('a different result')),
      );
      expect(orElsed).toEqual(some('a different result'));
    });

    describe('typings', () => {
      it('for some maybe as input and some as return type, it infers the output same as input', () => {
        const maybe = some('test');
        const output = pipe(
          maybe,
          orElse(() => some('a different result')),
        );
        expectTypeOf(output).toEqualTypeOf<Maybe_Some<string>>();
      });

      it('for some maybe as input and none as return type, it infers the output same as input', () => {
        const maybe = some('test');
        const output = pipe(
          maybe,
          orElse(() => none()),
        );
        expectTypeOf(output).toEqualTypeOf<Maybe_Some<string>>();
      });

      it('for some maybe as input and ambiguous result as return type, it infers the output same as input', () => {
        const maybe = some('test');
        const output = pipe(
          maybe,
          orElse(() => some('a different result') as Maybe<string>),
        );
        expectTypeOf(output).toEqualTypeOf<Maybe_Some<string>>();
      });

      it('for none maybe as input and some as return type, it infers the output same as return type', () => {
        const maybe = none();
        const output = pipe(
          maybe,
          orElse(() => some('a different result')),
        );
        expectTypeOf(output).toEqualTypeOf<Maybe_Some<string>>();
      });

      it('for none maybe as input and none as return type, it infers the output same as return type', () => {
        const maybe = none();
        const output = pipe(
          maybe,
          orElse(() => none()),
        );
        expectTypeOf(output).toEqualTypeOf<Maybe_None>();
      });

      it('for none maybe as input and ambiguous result as return type, it infers the output same as return type', () => {
        const maybe = none();
        const output = pipe(
          maybe,
          orElse(() => none() as Maybe<string>),
        );
        expectTypeOf(output).toEqualTypeOf<Maybe<string>>();
      });

      it('for ambiguous maybe as input and some result as return type, it infers the output as a maybe of the union of the two types', () => {
        const maybe = none() as Maybe<string>;
        const output = pipe(
          maybe,
          orElse(() => some(2)),
        );
        expectTypeOf(output).toEqualTypeOf<Maybe<string | number>>();
      });

      it('for ambiguous maybe as input and none result as return type, it infers the output same as input', () => {
        const maybe = none() as Maybe<string>;
        const output = pipe(
          maybe,
          orElse(() => none()),
        );
        expectTypeOf(output).toEqualTypeOf<Maybe<string>>();
      });

      it('for ambiguous maybe as input and ambiguous result as return type, it infers the output as a maybe of the union of the two types', () => {
        const maybe = none() as Maybe<string>;
        const output = pipe(
          maybe,
          orElse(() => none() as Maybe<string>),
        );
        expectTypeOf(output).toEqualTypeOf<Maybe<string | string>>();
      });
    });
  });
});
