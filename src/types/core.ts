import {AnyFn, Curried2, Entry, Predicate, TCurry, Unary} from "./core.types";

export const Identity = <T1>(v):T1 => v;
export const Const = <T1>(v: T1) => (a?: any): T1 => v;
export const Return = Const;
export const TRUE = Const(true);
export const FALSE = Const(false);
export const Variable = <T1>(a?) => (v: T1): T1 => v;
export const DoNothing = () => {};
export const Exists = a => !(a === null || a === undefined);
export const Swap = <T1, T2, R>(f: (arg1: T1, arg2: T2) => R): Curried2<T2, T1, R> =>
    Curry((a, b) => f(b,a));

export const Not = (f: (...args: any[]) => any) => (...args): boolean => !f(...args);
export const CreateAction = <T1 extends (...args: any[]) => any, R>(
    fn: T1,
    argsArr: Parameters<T1>,
    ctx = null
) => (): R => fn.bind(ctx)(argsArr);

export const Curry: TCurry = function Curry(f, ...initialArgs) {
    return function curried(...newArgs) {
        const args = [...initialArgs, ...newArgs];

        if (args.length >= f.length)
            return f(...args);
        else
            return (Curry as any)(f, ...args);
    }
}

export const Is = Curry(<T1>(a: T1, b: T1): boolean => a === b);
export const ApplyTo = Curry(<T1,R>(a: T1, f: (arg: T1) => R): R => f(a));
export const Call = Curry(<T1, R>(f: (arg: T1) => R, a: T1): R => f(a));
export const IfElse = Curry(<T1>(
    p: Predicate<T1>,
    onSuccess: Unary<T1, any>,
    onFail: Unary<T1, any>,
    arg: T1
) => p(arg) ? onSuccess(arg) : onFail(arg));

export const When = Curry(<T1>(
    p: Predicate<T1>,
    f: Unary<T1, any>,
    arg: T1
) => p(arg) ? f(arg) : arg);

export const Unless = Curry(<T1>(
    p: Predicate<T1>,
    f: Unary<T1, any>,
    arg: T1
) => p(arg) ? arg : f(arg));

export const AllPass = Curry(<T1>(
    fns: Unary<T1, any>[],
    arg: T1
) => fns.every(f => f(arg)));

export const EitherPass = Curry(<T1>(
    fns: Unary<T1, any>[],
    arg: T1
) => fns.some(f => f(arg)));

export const NeitherPass = Curry(<T1>(
    fns: Unary<T1, any>[],
    arg: T1
) => !(fns.some(f => f(arg))));

export const InCase = Curry(<T1>(
    entries: Entry<Predicate<T1>, (arg: T1) => any>[],
    value: T1
): any => {
    for(let entry of entries) {
        const predicate = entry[0];
        const fn = entry[1];
        if(predicate(value)) {
            return fn(value);
        }
    }
});

export const Attempt = Curry(<T1, R, SR, ER>(
    f: (arg: T1) => R,
    onSuccess: (arg: R) => SR,
    onError: (e: Error) => ER,
    arg: T1
): SR | ER => {
    try {
        return onSuccess(f(arg));
    } catch(e) {
        return onError(e);
    }
});

export const TapWith = f => arg => {
    f(arg);
    return arg;
}
export const ChangeWithHooks = (obj, fn) => arg => {
    if(obj.guard && obj.guard(arg)) {
        return Compose([obj.hookAfter ?? Identity, fn, obj.hookBefore ?? Identity])(arg);
    } 
    return null;
}
export const PassToFunctions = fns => arg => { 
    const resultArr = [];

    for (let i = 0; i < fns.length; i++) {
        resultArr.push(fns[i](arg));
    }

    return resultArr;
}
export const Compose = Curry((fns, arg) => {
    let currentArg = arg;

    let fnsInReversedOrder = [...fns].reverse();

    for(let fn of fnsInReversedOrder)
        currentArg = fn(currentArg);

    return currentArg;
});
export const Pipe = Curry((fns, arg) => {
    let currentArg = arg;

    for(let fn of fns)
        currentArg = fn(currentArg);

    return currentArg;
});
export const IsFunction = f => typeof f === "function";