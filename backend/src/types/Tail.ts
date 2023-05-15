export type Tail<T extends any[]> = ((...args: T) => any) extends (
  _: any,
  ...tail: infer TT
) => any
  ? TT
  : [];
