/**
 * Recursively map a type and make all properties optional.
 */
export declare type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : T[P] extends object ? RecursivePartial<T[P]> : T[P];
};

/**
 * Recursively map a type and make all properties optional & dynamic.
 */
export declare type RecursivePartialAndDynamic<T> = T extends object ? ({
  [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartialAndDynamic<U>[] : T[P] extends Function ? T[P] : T[P] extends object ? RecursivePartialAndDynamic<T[P]> : T[P];
}) : T;
