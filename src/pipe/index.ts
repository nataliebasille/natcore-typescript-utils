type OperatorFunction<TIn, TOut> = (param: TIn) => TOut;

export function pipe<T1, T2>(value: T1, op1: OperatorFunction<T1, T2>): T2;
export function pipe<T1, T2, T3>(
  value: T1,
  op1: OperatorFunction<T1, T2>,
  op2: OperatorFunction<T2, T3>
): T3;
export function pipe<T1, T2, T3, T4>(
  value: T1,
  op1: OperatorFunction<T1, T2>,
  op2: OperatorFunction<T2, T3>,
  op3: OperatorFunction<T3, T4>
): T4;
export function pipe<T1, T2, T3, T4, T5>(
  value: T1,
  op1: OperatorFunction<T1, T2>,
  op2: OperatorFunction<T2, T3>,
  op3: OperatorFunction<T3, T4>,
  op4: OperatorFunction<T4, T5>
): T5;
export function pipe<T1, T2, T3, T4, T5, T6>(
  value: T1,
  op1: OperatorFunction<T1, T2>,
  op2: OperatorFunction<T2, T3>,
  op3: OperatorFunction<T3, T4>,
  op4: OperatorFunction<T4, T5>,
  op5: OperatorFunction<T5, T6>
): T6;
export function pipe<T1, T2, T3, T4, T5, T6, T7>(
  value: T1,
  op1: OperatorFunction<T1, T2>,
  op2: OperatorFunction<T2, T3>,
  op3: OperatorFunction<T3, T4>,
  op4: OperatorFunction<T4, T5>,
  op5: OperatorFunction<T5, T6>,
  op6: OperatorFunction<T6, T7>
): T7;
export function pipe<T1, T2, T3, T4, T5, T6, T7, T8>(
  value: T1,
  op1: OperatorFunction<T1, T2>,
  op2: OperatorFunction<T2, T3>,
  op3: OperatorFunction<T3, T4>,
  op4: OperatorFunction<T4, T5>,
  op5: OperatorFunction<T5, T6>,
  op6: OperatorFunction<T6, T7>,
  op7: OperatorFunction<T7, T8>
): T8;
export function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9>(
  value: T1,
  op1: OperatorFunction<T1, T2>,
  op2: OperatorFunction<T2, T3>,
  op3: OperatorFunction<T3, T4>,
  op4: OperatorFunction<T4, T5>,
  op5: OperatorFunction<T5, T6>,
  op6: OperatorFunction<T6, T7>,
  op7: OperatorFunction<T7, T8>,
  op8: OperatorFunction<T8, T9>
): T9;

export function pipe(
  value: any,
  ...fn: OperatorFunction<any, any>[]
): OperatorFunction<any, any> {
  return fn.reduce((acc, fn) => fn(acc), value);
}
