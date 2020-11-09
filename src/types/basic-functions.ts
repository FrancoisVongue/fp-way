import {
    Action,
    Binary,
    Curried1,
    Curried2,
    Curried3,
    Curried4,
    Curried5,
    Curried6,
    Curried7,
    Curried8,
    Curried9,
    Novenary,
    Octonary, Predicate,
    Quaternary,
    Quinary,
    Senary,
    Septenary,
    Ternary,
    Unary
} from "./function-types";
import {toUnary} from "./function";

export const Identity = <T>(v: T): T => v;
export const Const = <T1>(a: T1): Action<T1> => { return () => a; }
export const Return = Const;
export const Variable = (a?:any) => Identity;
export const DoNothing: Action<void> = () => {};
export const Do = (f: Function = DoNothing) => f();
export const Exists: Unary<any, boolean> = a => !(a === null || a === undefined);

export const Skip = Return(Symbol.for("fp-way-skip"));
/*
merges two arrays of arguments that may contain Skip() variable
* see docs for more information*/
export const skipMerge = (arr1, arr2) => {
    const resultOfMerge = [];

    const pushToResult = v => resultOfMerge.push(v);
    const isSkip = v => v === Skip();
    let arr2Cursor = 0;

    for (let i = 0; i < arr1.length; i++) {
        if (isSkip(arr1[i]) && arr2Cursor < arr2.length) {
            if (isSkip(arr2[arr2Cursor])) {
                pushToResult(Skip());
            } else {
                pushToResult(arr2[arr2Cursor]);
            }
            arr2Cursor++;
        } else {
            pushToResult(arr1[i]);
        }
    }
    if (arr2Cursor < arr2.length) {
        resultOfMerge.push(...arr2.slice(arr2Cursor));
    }

    return resultOfMerge;
}

export function curry<T1, R>(f: Unary<T1, R>): Curried1<T1, R>;
export function curry<T1, T2, R>(f: Binary<T1, T2, R>): Curried2<T1, T2, R>;
export function curry<T1, T2, T3, R>(f: Ternary<T1, T2, T3, R>): Curried3<T1, T2, T3, R>;
export function curry<T1, T2, T3, T4, R>(f: Quaternary<T1, T2, T3, T4, R>): Curried4<T1, T2, T3, T4, R>;
export function curry<T1, T2, T3, T4, T5, R>(f: Quinary<T1, T2, T3, T4, T5, R>): Curried5<T1, T2, T3, T4, T5, R>;
export function curry<T1, T2, T3, T4, T5, T6, R>(f: Senary<T1, T2, T3, T4, T5, T6, R>): Curried6<T1, T2, T3, T4, T5, T6, R>;
export function curry<T1, T2, T3, T4, T5, T6, T7, R>(f: Septenary<T1, T2, T3, T4, T5, T6, T7, R>): Curried7<T1, T2, T3, T4, T5, T6, T7, R>;
export function curry<T1, T2, T3, T4, T5, T6, T7, T8, R>(f: Octonary<T1, T2, T3, T4, T5, T6, T7, T8, R>): Curried8<T1, T2, T3, T4, T5, T6, T7, T8, R>;
export function curry<T1, T2, T3, T4, T5, T6, T7, T8, T9, R>(f: Novenary<T1, T2, T3, T4, T5, T6, T7, T8, T9, R>): Curried9<T1, T2, T3, T4, T5, T6, T7, T8, T9, R>;
export function curry(f, ...initialArgs) {
    return function curried(...newArgs) {
        const args = skipMerge(initialArgs, newArgs).slice(0, f.length);
        const containsSkip = args.includes(Skip());

        if (args.length >= f.length && !containsSkip)
            return f(...args);
        else
            return (curry as any)(f, ...args);
    }
}


const attempt = <T>(f: Unary<T, any>, a: T):boolean => {
    try {
        f(a);
        return true;
    } catch(e) {
        return false;
    }
}
const curriedAttempt = curry(attempt);
export {curriedAttempt as attempt}

const is = (a, b): boolean => a === b;
const curriedIs = curry(is);
export { curriedIs as is }

const Swap = <T1, T2, R>(f: Binary<T1, T2, R>, a: T2, b: T1): R => f(b, a);
const curriedSwap = curry(Swap);
export { curriedSwap as Swap }

export const applyTo = curry((arg, f: Function) => f(arg));
export const call = curry((f: Function, arg) => f(arg));

export const ifElse = curry((p: Predicate, onSuccess: Unary<any, any>, onFail: Unary<any, any>, arg: any) =>
    p(arg) ? onSuccess(arg) : onFail(arg));
export const when = curry((p: Predicate, f: Unary<any, any>, arg: any) => p(arg) ? f(arg) : arg);
export const unless = curry((p, f, arg) => p(arg) ? arg : f(arg));
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
