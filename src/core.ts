import {Binary, Curried, Curried2, IInCase, JSTypesWithArrayAndNull, Predicate, TCurry, Unary} from "./core.types";

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
export const ReturnAsIs = Variable;
export const Not = (f: Predicate): Predicate => (...args) => !f(...args);
export const DoNothing = (a?) => {};
export const Is = Curry((a, b) => a === b);
export const Exists = a => !(a === null || a === undefined);

export const Swap = <T1, T2, R>(f: Binary<T1, T2, R>): Curried2<T2, T1, R> =>
    Curry((a, b) => f(b,a));
export const Call = Curry((f, v) => f(v))
export const ApplyOn = Swap(Call)

export const IfElse = Curry((
    p, onSuccess, onFail, arg
) => p(arg) ? onSuccess(arg) : onFail(arg));

export const When = Curry((p, f, a) => p(a) ? f(a) : a);
export const Unless = Curry((p, f, a) => !p(a) ? f(a) : a);

export const InCase = Curry((
    entries: [Unary<any, boolean>, Unary<any, any>][],
    v: any
): any => {
    for(let entry of entries) {
        const [predicate, f] = entry;
        if(predicate(v)) {
            return f(v);
        }
    }
});
export const IndependentInCase = Curry((
    entries: [Unary<any, boolean>, Unary<any, any>][],
    v: any
): any[] => {
    const results = [];

    for(let entry of entries) {
        const [predicate, f] = entry;
        if(predicate(v)) {
            results.push(f(v));
        }
    }

    return results;
});

export const CanBeDescribedAs = Curry((ps: Predicate[], v: any) => {
    return ps.map(ApplyOn(v)).every(Is(true))
})

export const Pipe = Curry((fns: Function[], arg: any): any => {
    let currentArg = arg;

    for(let fn of fns)
        currentArg = fn(currentArg);

    return currentArg;
});
export const Compose = Curry((fns: Function[], a: any) => Pipe(fns.reverse(), a));

export const IsOfType = Curry((desiredType: JSTypesWithArrayAndNull, a: any) => {
    const Type = InCase([
        [Is(null), () => "null"],
        [a => Array.isArray(a), () => "array"],
        [TRUE, a => typeof a]
    ], a);

    return Type === desiredType;
});
