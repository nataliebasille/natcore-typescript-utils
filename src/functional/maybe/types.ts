export type Maybe_Some<T> = {
  readonly type: 'some';
  readonly value: T;
};

export type Maybe_None = {
  readonly type: 'none';
};

export type Maybe<T> = Maybe_None | Maybe_Some<T>;

export type Maybe_InferSome<M extends Maybe<unknown>> = M extends Maybe_Some<
  infer T
>
  ? T
  : M extends Maybe_None
  ? never
  : M;
