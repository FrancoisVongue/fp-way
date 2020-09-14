export type Action = {
    (...args: any[]): any;
}
export type Function<R extends NonNullable<any>> = {
    (...args: any[]): R;
}
export type Predicate = {
    (...args: any[]): boolean;
}
export type Unary<T1, R> = {
    (t1: T1): R;
}
export type Binary<T1, T2, R> = {
    (t1: T1, t2: T2): R;
}
export type Ternary<T1, T2, T3, R> = {
    (t1: T1, t2: T2, t3: T3): R;
}
export type Quaternary<T1, T2, T3, T4, R> = {
    (t1: T1, t2: T2, t3: T3, t4: T4): R;
}
export type Quinary<T1, T2, T3, T4, T5, R> = {
    (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): R;
}
export type Senary<T1, T2, T3, T4, T5, T6, R> = {
    (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6): R;
}
export type Septenary<T1, T2, T3, T4, T5, T6, T7, R> = {
    (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7): R;
}
export type Octonary<T1, T2, T3, T4, T5, T6, T7, T8, R> = {
    (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8): R;
}
export type Novenary<T1, T2, T3, T4, T5, T6, T7, T8, T9, R> = {
    (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9): R;
}
