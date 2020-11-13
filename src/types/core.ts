import {Curried1, Curried2, Curried3, Curried4,} from "./function-types";
import {Skip, skipMerge} from "./utility";

type TIdentity = <T1>(v: any) => T1
export const Identity: TIdentity = v => v;
type TConst = <T1>(v: T1) => (a?: any) => T1
export const Const: TConst = v => (a?) => v;
export const Return = Const;
type TVariable = (a?: any) => <T1>(v: T1) => T1
export const Variable: TVariable = (a?) => v => v;
type TDoNothing = () => void
export const DoNothing: TDoNothing = () => {};
type TExists = (a: any) => boolean
export const Exists: TExists = a => !(a === null || a === undefined);
type TSwap = <T1, T2, R>(f: (T1, T2) => R, a: T2, b: T1) => R
export const Swap: TSwap = (f, a, b) => f(b,a);

type TCurry = (...args: any[]) => any
export const curry: TCurry = function _curry(f, ...initialArgs) {
    return function curried(...newArgs) {
        const args = skipMerge(initialArgs, newArgs).slice(0, f.length);
        const containsSkip = args.includes(Skip());

        if (args.length >= f.length && !containsSkip)
            return f(...args);
        else
            return (_curry as any)(f, ...args);
    }
}

export const is = a => b => a === b;
type TApplyTo = <T1, R>(a: T1) => (f: (a: T1) => R) => R
export const applyTo: TApplyTo = (a) => f => f(a);

type TCall = <T1, R>(f: (a: T1) => R) => (a: T1) => R
export const call: TCall = f => a => f(a);

/* here - */
export const ifElse = curry((p, onSuccess, onFail, arg) =>
    p(arg) ? onSuccess(arg) : onFail(arg));
export const when = curry((p, f, arg) => p(arg) ? f(arg) : arg);
export const unless = curry((p, f, arg) => p(arg) ? arg : f(arg));
export const attempt = <T1>(
    f: () => T1,
    onSuccess: (a: T1) => any,
    onError: (a: Error) => any) =>
{
    try {
        onSuccess(f());
    } catch(e) {
        onError(e);
    }
}
export const inCase = curry((entries, value) => {
    const getPredicate = entry => entry[0];
    const getFn = entry => entry[0];

    for(let entry of entries) {
        const predicate = getPredicate(entry);
        if(predicate(value)) {
            const fn = getFn(entry);
            return fn(value);
        }
    }
});

export const not = f => (...args) => !f(...args);
