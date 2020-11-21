export type AnyFn = (...args: any[]) => any
export type SimpleValue = string | number | boolean;
export type Predicate<T1> = (arg: T1) => boolean
export type BinaryPredicate<T1, T2> = (arg1: T1, arg2: T2) => boolean
export type Unary<T1, R> =
    (singleArg: T1) => R
export type Binary<T1, T2, R> = 
    (firstArg: T1, secArg: T2) => R 
export type Ternary<T1, T2, T3, R> = 
    (firstArg: T1, secArg: T2, thirdArg: T3) => R 
export type Quaternary<T1, T2, T3, T4, R> = 
    (firstArg: T1, secArg: T2, thirdArg: T3, forthArg: T4) => R 
export type Entry<T1, T2> = [T1, T2];
export type DTO = {[key: string]: any};
export type Entries<T,K> = Entry<T,K>[];

export interface Curried1<T1, R> {
    (): Curried1<T1, R>;	
    (t1: T1): R;	
}
export interface Curried2<T1, T2, R> {
    (): Curried2<T1, T2, R>;	
    (t1: T1): Curried1<T2, R>;	
    (t1: T1, t2: T2): R;	
}	
export interface Curried3<T1, T2, T3, R> {	
    (): Curried3<T1, T2, T3, R>;	
    (t1: T1): Curried2<T2, T3, R>;	
    (t1: T1, t2: T2): Curried1<T3, R>;	
    (t1: T1, t2: T2, t3: T3): R;	
}	
export interface Curried4<T1, T2, T3, T4, R> {	
    (): Curried4<T1, T2, T3, T4, R>;	
    (t1: T1): Curried3<T2, T3, T4, R>;	
    (t1: T1, t2: T2): Curried2<T3, T4, R>;	
    (t1: T1, t2: T2, t3: T3): Curried1<T4, R>;	
    (t1: T1, t2: T2, t3: T3, t4: T4): R;	
}

export type TCurry = {
    <T1, R>(f: Unary<T1, R>): Curried1<T1, R>;
    <T1, T2, R>(f: Binary<T1, T2, R>): Curried2<T1, T2, R>;
    <T1, T2, T3, R>(f: Ternary<T1, T2, T3, R>): Curried3<T1, T2, T3, R>;
    <T1, T2, T3, T4, R>(f: Quaternary<T1, T2, T3, T4, R>): Curried4<T1, T2, T3, T4, R>;
}

export type Curried<F> =
    F extends Unary<any, any> ? Curried1<Parameters<F>[0], ReturnType<F>> :
    F extends Binary<any, any, any> ? Curried2<Parameters<F>[0], Parameters<F>[1], ReturnType<F>> :
    F extends Ternary<any, any, any, any> ? Curried3<Parameters<F>[0], Parameters<F>[1], Parameters<F>[2], ReturnType<F>> :
    F extends Quaternary<any, any, any, any, any> ? Curried4<Parameters<F>[0], Parameters<F>[1], Parameters<F>[2], Parameters<F>[3], ReturnType<F>> :
        never;

export type TComposeFunctionsArr<T1, R> = [Unary<T1, R>]
    | [Unary<any, R>, Unary<T1, any>]
    | [Unary<any, R>, Unary<any, any>, Unary<T1, any>]
    | [Unary<any, R>, Unary<any, any>, Unary<any, any>, Unary<T1, any>]
    | [Unary<any, R>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<T1, any>]
    | [Unary<any, R>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<T1, any>]
    | [Unary<any, R>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<T1, any>]
    | [Unary<any, R>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<T1, any>]
    | [Unary<any, R>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<T1, any>]
    | [Unary<any, R>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<T1, any>]
    | [Unary<any, R>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<T1, any>]
    | [Unary<any, R>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<T1, any>]
    | any

export type TPipeFunctionsArr<T1, R> = [Unary<T1, R>]
    | [Unary<T1, any>, Unary<T1, R>]
    | [Unary<T1, any>, Unary<any, any>, Unary<T1, R>]
    | [Unary<T1, any>, Unary<any, any>, Unary<any, any>, Unary<T1, R>]
    | [Unary<T1, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<T1, R>]
    | [Unary<T1, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<T1, R>]
    | [Unary<T1, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<T1, R>]
    | [Unary<T1, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<T1, R>]
    | [Unary<T1, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<T1, R>]
    | [Unary<T1, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<T1, R>]
    | [Unary<T1, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<T1, R>]
    | [Unary<T1, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<any, any>, Unary<T1, R>]
    | any
