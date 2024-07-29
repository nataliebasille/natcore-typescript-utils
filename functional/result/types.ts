export type Result_Ok<T> = {
  readonly type: 'ok';
  readonly value: T;
};

export type Result_Error<E> = {
  readonly type: 'error';
  readonly value: E;
};

export type Result<T, E> = [E] extends [never]
  ? Result_Ok<T>
  : [T] extends [never]
  ? Result_Error<E>
  : Result_Ok<T> | Result_Error<E>;

export type Result_InferOK<R extends Result<unknown, unknown>> =
  R extends Result_Ok<infer S> ? S : never;

export type Result_InferError<R extends Result<unknown, unknown>> =
  R extends Result_Error<infer E> ? E : never;
