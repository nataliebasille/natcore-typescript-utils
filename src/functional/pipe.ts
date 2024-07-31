type OperatorFunction<TIn, TOut> = (param: TIn) => TOut;

/**
 * Pipe a value through a series of operators.
 * @param value The value to pipe through the operators.
 * @param op1 The first operator to pipe the value through.
 * @returns The result of the last operator.
 */
export function pipe<T1, T2>(value: T1, op1: OperatorFunction<T1, T2>): T2;

/**
 * Pipe a value through a series of operators.
 * @param value The value to pipe through the operators.
 * @param op1 The first operator to pipe the value through.
 * @param op2 The second operator to pipe the value through.
 * @returns The result of the last operator.
 */
export function pipe<T1, T2, T3>(
  value: T1,
  op1: OperatorFunction<T1, T2>,
  op2: OperatorFunction<T2, T3>,
): T3;

/**
 * Pipe a value through a series of operators.
 * @param value The value to pipe through the operators.
 * @param op1 The first operator to pipe the value through.
 * @param op2 The second operator to pipe the value through.
 * @param op3 The third operator to pipe the value through.
 * @returns The result of the last operator.
 */
export function pipe<T1, T2, T3, T4>(
  value: T1,
  op1: OperatorFunction<T1, T2>,
  op2: OperatorFunction<T2, T3>,
  op3: OperatorFunction<T3, T4>,
): T4;

/**
 * Pipe a value through a series of operators.
 * @param value The value to pipe through the operators.
 * @param op1 The first operator to pipe the value through.
 * @param op2 The second operator to pipe the value through.
 * @param op3 The third operator to pipe the value through.
 * @param op4 The fourth operator to pipe the value through.
 * @returns The result of the last operator.
 */
export function pipe<T1, T2, T3, T4, T5>(
  value: T1,
  op1: OperatorFunction<T1, T2>,
  op2: OperatorFunction<T2, T3>,
  op3: OperatorFunction<T3, T4>,
  op4: OperatorFunction<T4, T5>,
): T5;

/**
 * Pipe a value through a series of operators.
 * @param value The value to pipe through the operators.
 * @param op1 The first operator to pipe the value through.
 * @param op2 The second operator to pipe the value through.
 * @param op3 The third operator to pipe the value through.
 * @param op4 The fourth operator to pipe the value through.
 * @param op5 The fifth operator to pipe the value through.
 * @returns The result of the last operator.
 */
export function pipe<T1, T2, T3, T4, T5, T6>(
  value: T1,
  op1: OperatorFunction<T1, T2>,
  op2: OperatorFunction<T2, T3>,
  op3: OperatorFunction<T3, T4>,
  op4: OperatorFunction<T4, T5>,
  op5: OperatorFunction<T5, T6>,
): T6;

/**
 * Pipe a value through a series of operators.
 * @param value The value to pipe through the operators.
 * @param op1 The first operator to pipe the value through.
 * @param op2 The second operator to pipe the value through.
 * @param op3 The third operator to pipe the value through.
 * @param op4 The fourth operator to pipe the value through.
 * @param op5 The fifth operator to pipe the value through.
 * @param op6 The sixth operator to pipe the value through.
 * @returns The result of the last operator.
 */
export function pipe<T1, T2, T3, T4, T5, T6, T7>(
  value: T1,
  op1: OperatorFunction<T1, T2>,
  op2: OperatorFunction<T2, T3>,
  op3: OperatorFunction<T3, T4>,
  op4: OperatorFunction<T4, T5>,
  op5: OperatorFunction<T5, T6>,
  op6: OperatorFunction<T6, T7>,
): T7;

/**
 * Pipe a value through a series of operators.
 * @param value The value to pipe through the operators.
 * @param op1 The first operator to pipe the value through.
 * @param op2 The second operator to pipe the value through.
 * @param op3 The third operator to pipe the value through.
 * @param op4 The fourth operator to pipe the value through.
 * @param op5 The fifth operator to pipe the value through.
 * @param op6 The sixth operator to pipe the value through.
 * @param op7 The seventh operator to pipe the value through.
 * @returns The result of the last operator.
 */
export function pipe<T1, T2, T3, T4, T5, T6, T7, T8>(
  value: T1,
  op1: OperatorFunction<T1, T2>,
  op2: OperatorFunction<T2, T3>,
  op3: OperatorFunction<T3, T4>,
  op4: OperatorFunction<T4, T5>,
  op5: OperatorFunction<T5, T6>,
  op6: OperatorFunction<T6, T7>,
  op7: OperatorFunction<T7, T8>,
): T8;

/**
 * Pipe a value through a series of operators.
 * @param value The value to pipe through the operators.
 * @param op1 The first operator to pipe the value through.
 * @param op2 The second operator to pipe the value through.
 * @param op3 The third operator to pipe the value through.
 * @param op4 The fourth operator to pipe the value through.
 * @param op5 The fifth operator to pipe the value through.
 * @param op6 The sixth operator to pipe the value through.
 * @param op7 The seventh operator to pipe the value through.
 * @param op8 The eighth operator to pipe the value through.
 * @returns The result of the last operator.
 */
export function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9>(
  value: T1,
  op1: OperatorFunction<T1, T2>,
  op2: OperatorFunction<T2, T3>,
  op3: OperatorFunction<T3, T4>,
  op4: OperatorFunction<T4, T5>,
  op5: OperatorFunction<T5, T6>,
  op6: OperatorFunction<T6, T7>,
  op7: OperatorFunction<T7, T8>,
  op8: OperatorFunction<T8, T9>,
): T9;

export function pipe(
  value: unknown,
  ...fn: OperatorFunction<unknown, unknown>[]
): OperatorFunction<unknown, unknown> {
  return fn.reduce((acc, fn) => fn(acc), value) as OperatorFunction<
    unknown,
    unknown
  >;
}
