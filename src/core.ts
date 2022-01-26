import {Binary, JSTypesWithArrayAndNull, TCurry, Unary} from "./core.types";

export const Curry: TCurry = function (f, ...initialArgs) {
    return function curried(...newArgs) {
        const args = [...initialArgs, ...newArgs];

        if (args.length >= f.length)
            return f(...args);
        else
            return (Curry as any)(f, ...args);
    }
}

export const Identity = <T1>(v: T1):T1 => v;
export const Const = <T1>(v: T1) => (a?): T1 => v;
export const Return = Const;
export const TRUE = Const(true);
export const FALSE = Const(false);
export const Variable = (a?) => <T1>(v: T1): T1  => v;
export const DoNothing = (a?) => {};
export const Exists = a => !(a === null || a === undefined);
export const Swap = <T1, T2, R>(f: Binary<T1, T2, R>): Binary<T2, T1, R> =>
    (a, b) => f(b,a);
export const Not = (f: Function) => (...args) => !f(...args);

export const Is = Curry((a, b) => a === b);

export const IfElse = Curry((
    p, onSuccess, onFail, arg
) => p(arg) ? onSuccess(arg) : onFail(arg));

export const When = Curry((p, f, a) => p(a) ? f(a) : a);
export const Unless = Curry((p, f, a) => When(Not(p), f, a));
export const InCase = <T1, R>(
    entries: [Unary<T1, boolean>, Unary<T1, R>][],
    v: T1
): R => {
    for(let entry of entries) {
        const [predicate, f] = entry;
        if(predicate(v)) {
            return f(v);
        }
    }
};

export const IndependentInCase = <T1, R>(
    entries: [Unary<T1, boolean>, Unary<T1, R>][],
    v: T1
): R[] => {
    const results: R[] = [];
    
    for(let entry of entries) {
        const [predicate, f] = entry;
        if(predicate(v)) {
            results.push(f(v));
        }
    }
    
    return results;
};

export const Pipe = Curry((fns: Function[], arg: any): any => {
    let currentArg = arg;

    for(let fn of fns)
        currentArg = fn(currentArg);

    return currentArg;
});
export const Compose = Curry((fns: Function[], a: any) => Pipe(fns.reverse(), a));

export const IsOfType = (desiredType: JSTypesWithArrayAndNull, a: any) => {
    const Type = InCase<any, JSTypesWithArrayAndNull>([
        [Is(null), () => "null"],
        [a => Array.isArray(a), () => "array"],
        [TRUE, a => typeof a]
    ], a);
    
    return Type === desiredType;
}
