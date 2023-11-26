import { expectTypeOf } from 'expect-type';
import {
  Maybe,
  Maybe_InferSome,
  None,
  Some,
  flatMap,
  map,
  match,
  none,
  some,
} from './maybe';
import { pipe } from './pipe';
import { error, ok } from './result';

describe('maybe', () => {
  describe('map', () => {
    it('can map through pipe', () => {
      const maybe = pipe(
        some('test'),
        map((value) => value.length),
      );
      expect(maybe).toEqual(some(4));
      expectTypeOf(some(4)).toMatchTypeOf(maybe);
    });

    it('can call map directly', () => {
      const maybe = map(some('test'), (value) => value.length);
      expect(maybe).toEqual(some(4));
      expectTypeOf(some(4)).toMatchTypeOf(maybe);
    });
  });

  describe('flatMap', () => {
    it('can flatMap through pipe', () => {
      const maybe = pipe(
        some('test'),
        map((value) => value.length),
        flatMap((value) => some(value * 2)),
      );
      expect(maybe).toEqual(some(8));
      expectTypeOf(some(8)).toMatchTypeOf(maybe);
    });

    it('can call flatMap directly', () => {
      const maybe = flatMap(some('test'), (value) => some(value.length));
      expect(maybe).toEqual(some(4));
      expectTypeOf(some(4)).toMatchTypeOf(maybe);
    });
  });

  describe('match', () => {
    it('can match Some', () => {
      const noneFn = jest.fn(() => 0);
      const result = match(some('test'), {
        some: (value) => value.length,
        none: noneFn,
      });
      expect(result).toEqual(4);
      expectTypeOf(result).not.toBeAny();
      expectTypeOf(4).toMatchTypeOf(result);
    });

    it('can match None', () => {
      const someFn = jest.fn(() => 'some');
      const result = match(none(), {
        some: someFn,
        none: () => 'none',
      });
      expect(someFn).not.toHaveBeenCalled();
      expectTypeOf(result).not.toBeAny();
      expect(result).toEqual('none');
    });

    it('can match through pipe', () => {
      const maybe = pipe(
        some('test'),
        match({
          some: (value) => value.length,
          none: () => 0,
        }),
      );
      expect(maybe).toEqual(4);
      expectTypeOf(maybe).not.toBeAny();
      expectTypeOf(4).toMatchTypeOf(maybe);
    });

    it('can call match directly', () => {
      const maybe = match(some('test'), {
        some: (value) => value.length,
        none: () => 0,
      });
      expect(maybe).toEqual(4);
      expectTypeOf(maybe).not.toBeAny();
      expectTypeOf(4).toMatchTypeOf(maybe);
    });
  });

  describe('Maybe_InferSome', () => {
    it('should infer value from Some', () => {
      expectTypeOf<Maybe_InferSome<Some<'test'>>>().toEqualTypeOf<'test'>();
    });

    it('should infer value from None', () => {
      expectTypeOf<Maybe_InferSome<None<'test'>>>().toEqualTypeOf<'test'>();
    });

    it('should infer value from Maybe', () => {
      expectTypeOf<Maybe_InferSome<Maybe<'test'>>>().toEqualTypeOf<'test'>();
    });
  });

  it('can return Result from match', () => {
    const output = match(some('test'), {
      some: (value) => ok(value.length),
      none: () => error('some error'),
    });
    expect(output).toEqual(some(4));
    expectTypeOf(output).not.toBeAny();
    expectTypeOf(ok(4)).toMatchTypeOf(output);
  });
});
