import {
    AnyFn,
    Binary, Curried,
    Curried2, Entries,
    Entry,
    Predicate, TComposeFunctionsArr,
    TCurry, TPipeFunctionsArr,
    Unary
} from "./core.types";

export const Identity = <T1>(v: T1):T1 => v;
export const Const = <T1>(v: T1) => (a?): T1 => v;
export const Return = Const;
export const TRUE = Const(true);
export const FALSE = Const(false);
export const Variable = (a?) => <T1>(v: T1): T1 => v;
export const DoNothing = (a?) => {};
export const Exists = a => !(a === null || a === undefined);
export const Swap = <T1, T2, R>(f: Binary<T1, T2, R>): Curried2<T2, T1, R> =>
    Curry((a, b) => f(b,a));
export const Not = (f: AnyFn) => (...args): boolean => !f(...args);
export const CreateAction = <T1 extends AnyFn>(
    fn: T1,
    argsArr: Parameters<T1>,
    ctx = null
) => (): ReturnType<T1> => fn.bind(ctx)(...argsArr);

export const Curry: TCurry = function Curry(f, ...initialArgs) {
    return function curried(...newArgs) {
        const args = [...initialArgs, ...newArgs];

        if (args.length >= f.length)
            return f(...args);
        else
            return (Curry as any)(f, ...args);
    }
}

export type TIs<T1> = (a: T1, b: T1) => Boolean
export const Is = Curry((a, b): boolean => a === b);

export type TApplyTo<T1, R> = (arg: T1, f: Unary<T1, R>) => R
export const ApplyTo = Curry((a, f: AnyFn) => f(a));

export type TCall<T1, R> = (f: Unary<T1, R>, arg: T1) => R
export const Call = Curry((f: AnyFn, a) => f(a));

export type TIfElse<T1, R1, R2> = (
    p: Predicate<T1>,
    onSuccess: Unary<T1, R1>,
    onFail: Unary<T1, R2>,
    arg: T1) => R1 | R2
export const IfElse = Curry((
    p: Predicate<any>,
    onSuccess: Unary<any, any>,
    onFail: Unary<any, any>,
    arg: any
) => p(arg) ? onSuccess(arg) : onFail(arg));

export type TWhen<T1, R> = (
    p: Predicate<T1>,
    onSuccess: Unary<T1, R>,
    arg: T1
) => R | T1
export const When = Curry((
    p: Predicate<any>,
    f: Unary<any, any>,
    arg: any
) => p(arg) ? f(arg) : arg);

export type TUnless<T1, R> = (
    p: Predicate<T1>,
    onFail: Unary<T1, R>,
    arg: T1
) => R | T1
export const Unless = Curry((
    p: Predicate<any>,
    f: Unary<any, any>,
    arg: any
) => p(arg) ? arg : f(arg));

export type TAllPass<T1> = (
    fns: Predicate<T1>,
    arg: T1
) => boolean
export const AllPass = Curry((
    fns: Predicate<any>[],
    arg: any
): boolean => fns.every(f => f(arg)));

export type TEitherPass<T1> = (
    fns: Predicate<T1>,
    arg: T1
) => boolean
export const EitherPass = Curry((
    fns: Predicate<any>[],
    arg: any
): boolean => fns.some(f => f(arg)));

export type TNeitherPass<T1> = (
    fns: Predicate<T1>,
    arg: T1
) => boolean
export const NeitherPass = Curry((
    fns: Predicate<any>[],
    arg: any
): boolean => !(fns.some(f => f(arg))));

export type TInCase<T1, R> = (
    entries: Entries<Predicate<T1>, Unary<T1, R>>,
    arg: T1
) => R
export const InCase = Curry((
    entries: Entries<Predicate<any>, Unary<any, any>>,
    value: any
): any => {
    for(let entry of entries) {
        const predicate = entry[0];
        const fn = entry[1];
        if(predicate(value)) {
            return fn(value);
        }
    }
});

export type TIndependentInCase<T1, R> = TInCase<T1, R>
export const IndependentInCase = Curry((
    entries: Entries<Predicate<any>, Unary<any, any>>,
    value: any
): any => {
    for(let entry of entries) {
        const predicate = entry[0];
        const fn = entry[1];
        if(predicate(value)) {
            fn(value);
        }
    }
});

export type TTapWith<T1> = (
    f: Unary<T1, any>,
    arg: T1
) => T1
export const TapWith = Curry((
    f: AnyFn,
    arg: any
): any => (f(arg), arg));

export type TPassToFunctions<T1, R> = (
    fns: Unary<T1, R>[],
    arg: T1
) => R
export const PassToFunctions = Curry((
    fns: AnyFn[],
    arg: any
): any[] => fns.map(f => f(arg)));

export type TCompose<T1, R> = (
    fns: TComposeFunctionsArr<T1, R>,
    arg: T1
) => R
export const Compose = Curry((
    fns: AnyFn[],
    arg: any
) => {
    let currentArg = arg;

    let fnsInReversedOrder = [...fns].reverse();

    for(let fn of fnsInReversedOrder)
        currentArg = fn(currentArg);

    return currentArg;
});

export type TPipe<T1, R> = (
    fns: TPipeFunctionsArr<T1, R>,
    arg: T1
) => R
export const Pipe = Curry((
    fns: AnyFn[],
    arg: any
): any => {
    let currentArg = arg;

    for(let fn of fns)
        currentArg = fn(currentArg);

    return currentArg;
});
export const IsFunction = f => typeof f === "function";
