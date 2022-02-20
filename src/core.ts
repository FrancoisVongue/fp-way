import {
    Binary,
    Curried2, Curried3,
    JSTypesWithArrayAndNull,
    Predicate,
    TCurry,
    Unary, UnaryPredicate
} from "./core.types";

export const Curry: TCurry = function (f, ...initialArgs) {
    return function curried(...newArgs) {
        const args = [...initialArgs, ...newArgs];

        if (args.length >= f.length)
            return f(...args);
        else
            return (Curry as any)(f, ...args);
    }
}

export const Identity = <T1>(v: T1) => v;
export const Const: {
    <T1>(
        value: T1,
        _: any
    ): T1
    <T1>(
        value: T1,
    ): Unary<any, T1>
} = Curry((a, _) => a)
export const Return = Const;
export const TRUE = Const(true);
export const FALSE = Const(false);
export const Variable = (_?) => <T1>(v: T1) => v;
export const DoNothing = (_?) => {};
export const Is = Curry((a, b) => a === b);
export const Exists = a => !(a === null || a === undefined);

export const Not = (f: Predicate): Predicate => (...args) => !f(...args);
export const IsNot = Not(Is);
export const NotExists = Not(Exists);

export const Swap = <T1, T2, R>(
    f: Binary<T1, T2, R> | Curried2<T1, T2, R>
): Curried2<T2, T1, R> => Curry((a, b) => f(b,a)) as any;

export const Call = Curry((f, v) => f(v))
export const ApplyOn = Swap(Call)

export const IfElse: {
    <T, R>(
        predicate: Unary<T, boolean>,
        onSuccess: Unary<T, R>,
        onFail: Unary<T, R>,
        value: T
    ): R

    <T, R>(
        predicate: Unary<T, boolean>,
        onSuccess: Unary<T, R>,
        onFail: Unary<T, R>,
    ): Unary<T, R>

    <T, R>(
        predicate: Unary<T, boolean>,
        onSuccess: Unary<T, R>,
    ): Curried2<Unary<T, R>, T, R>

    <T, R>(
        predicate: Unary<T, boolean>,
    ): Curried3<Unary<T, R>, Unary<T, R>, T, R>
} = Curry((
    p, onSuccess, onFail, arg
) => p(arg) ? onSuccess(arg) : onFail(arg));

export const When: {
    <T>(
        predicate: Unary<T, boolean>,
        onSuccess: Unary<T, T>,
        value: T
    ): T

    <T>(
        predicate: Unary<T, boolean>,
        onSuccess: Unary<T, T>,
    ): Unary<T, T>

    <T>(
        predicate: Unary<T, boolean>,
    ): Curried2<Unary<T, T>, T, T>
} = Curry((p, f, a) => p(a) ? f(a) : a);

export const Unless: {
    <T>(
        predicate: Unary<T, boolean>,
        onFail: Unary<T, T>,
        value: T
    ): T

    <T>(
        predicate: Unary<T, boolean>,
        onFail: Unary<T, T>,
    ): Unary<T, T>

    <T>(
        predicate: Unary<T, boolean>,
    ): Curried2<Unary<T, T>, T, T>
} = Curry((p, f, a) => !p(a) ? f(a) : a);

export const InCase: {
    <T, R>(
        entries: [Unary<T, boolean>, Unary<T, R>][],
    ): (v: T) => R

    <T, R>(
        entries: [Unary<T, boolean>, Unary<T, R>][],
        v: T
    ): R
} = Curry((
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

export const IndependentInCase: {
    <T, R>(
        entries: [Unary<T, boolean>, Unary<T, R>][],
    ): (v: T) => R

    <T, R>(
        entries: [Unary<T, boolean>, Unary<T, R>][],
        v: T
    ): R[]
} = Curry((
    entries: [Unary<any, boolean>, Unary<any, any>][],
    v: any
): any[] => {
    const results: any[] = [];

    for(let entry of entries) {
        const [predicate, f] = entry;
        if(predicate(v)) {
            results.push(f(v));
        }
    }

    return results;
});

export const CanBeDescribedAs: {
    <T>(
        predicates: UnaryPredicate<T>[],
        value: T
    ): boolean

    <T>(
        predicates: UnaryPredicate<T>[],
    ): Unary<T, boolean>
} = Curry((ps: Predicate[], v: any) => {
    return ps.map(ApplyOn(v)).every(Is(true))
})

export const Pipe: {
    <T, R>(
        functions: [Unary<T, any>, ...Unary<any, any>[], Unary<any, R>],
        v: T
    ): R

    <T, R>(
        functions: [Unary<T, any>, ...Unary<any, any>[], Unary<any, R>],
    ): Unary<T, R>
} = Curry((fns: Function[], arg: any): any => {
    let currentArg = arg;

    for(let fn of fns)
        currentArg = fn(currentArg);

    return currentArg;
});

export const Compose: {
    <T, R>(
        functions: [Unary<any, R>, ...Unary<any, any>[], Unary<T, any>],
        v: T
    ): R

    <T, R>(
        functions: [Unary<any, R>, ...Unary<any, any>[], Unary<T, any>],
    ): Unary<T, R>
} = Curry((fns: Function[], a: any) => Pipe(fns.reverse() as any, a));

export const IsOfType = Curry((desiredType: JSTypesWithArrayAndNull, v: any) => {
    return desiredType === TypeOf(v)
});

export const TypeOf = (v): JSTypesWithArrayAndNull => {
    return InCase([
        [Is(null), () => "null"],
        [a => Array.isArray(a), () => "array"],
        [TRUE, a => typeof a]
    ], v);
}
