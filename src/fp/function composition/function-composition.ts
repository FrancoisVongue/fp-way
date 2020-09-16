import {Action} from "./types/action";
import {Unary} from "./types/action";
import {store} from "./basic functions/index";
import {forEach} from "./types/array";

export function compose<T1 extends Action, R>(fns: [
    Unary<ReturnType<T1>, R>, T1
]): (...args: Parameters<T1>) => R;
export function compose<T1 extends Action, T2, R>(fns: [
    Unary<T2, R>,
    Unary<ReturnType<T1>, T2>,T1
]): (...args: Parameters<T1>) => R;
export function compose<T1 extends Action, T2, T3, R>(fns: [
    Unary<T3, R>,
    Unary<T2, T3>,
    Unary<ReturnType<T1>, T2>, T1
]): (...args: Parameters<T1>) => R;
export function compose<T1 extends Action, T2, T3, T4, R>(fns: [
    Unary<T4, R>,
    Unary<T3, T4>,
    Unary<T2, T3>,
    Unary<ReturnType<T1>, T2>, T1
]): (...args: Parameters<T1>) => R;
export function compose<T1 extends Action, T2, T3, T4, T5, R>(fns: [
    Unary<T5, R>,
    Unary<T4, T5>,
    Unary<T3, T4>,
    Unary<T2, T3>,
    Unary<ReturnType<T1>, T2>, T1
]): (...args: Parameters<T1>) => R;
export function compose<T1 extends Action, T2, T3, T4, T5, T6, R>(fns: [
    Unary<T6, R>,
    Unary<T5, T6>,
    Unary<T4, T5>,
    Unary<T3, T4>,
    Unary<T2, T3>,
    Unary<ReturnType<T1>, T2>, T1
]): (...args: Parameters<T1>) => R;
export function compose<T1 extends Action, T2, T3, T4, T5, T6, T7, R>(fns: [
    Unary<T7, R>,
    Unary<T6, T7>,
    Unary<T5, T6>,
    Unary<T4, T5>,
    Unary<T3, T4>,
    Unary<T2, T3>,
    Unary<ReturnType<T1>, T2>, T1
]): (...args: Parameters<T1>) => R;
export function compose<T1 extends Action, T2, T3, T4, T5, T6, T7, T8, R>(fns: [
    Unary<T8, R>,
    Unary<T7, T8>,
    Unary<T6, T7>,
    Unary<T5, T6>,
    Unary<T4, T5>,
    Unary<T3, T4>,
    Unary<T2, T3>,
    Unary<ReturnType<T1>, T2>, T1
]): (...args: Parameters<T1>) => R;
export function compose<T1 extends Action, T2, T3, T4, T5, T6, T7, T8, T9, R>(fns: [
    Unary<T9, R>,
    Unary<T8, T9>,
    Unary<T7, T8>,
    Unary<T6, T7>,
    Unary<T5, T6>,
    Unary<T4, T5>,
    Unary<T3, T4>,
    Unary<T2, T3>,
    Unary<ReturnType<T1>, T2>, T1
]): (...args: Parameters<T1>) => R;
export function compose(fns: any[]) {
    return (...args) => {
        let firstFn = true;
        let firstArgs = args;
        let currentArg = null;

        for(let i = fns.length - 1; i >= 0; i--) {
            let result;
            if(firstFn) {
                firstFn = false;
                result = fns[i](...firstArgs);
            } else {
                result = fns[i](currentArg);
            }
            currentArg = result;
        }

        return currentArg;
    }
}


export function pipe<T1 extends Action, R>(fns: [T1, Unary<ReturnType<T1>, R>]): (...args: Parameters<T1>) => R;
export function pipe<T1 extends Action, T2, R>(fns: [T1, Unary<ReturnType<T1>, T2>, Unary<T2, R>]): (...args: Parameters<T1>) => R;
export function pipe<T1 extends Action, T2, T3, R>(fns: [T1, Unary<ReturnType<T1>, T2>, Unary<T2, T3>, Unary<T3, R>]): (...args: Parameters<T1>) => R;
export function pipe<T1 extends Action, T2, T3, T4, R>(fns: [T1, Unary<ReturnType<T1>, T2>, Unary<T2, T3>, Unary<T3, T4>, Unary<T4, R>]): (...args: Parameters<T1>) => R;
export function pipe<T1 extends Action, T2, T3, T4, T5, R>(fns: [T1, Unary<ReturnType<T1>, T2>, Unary<T2, T3>, Unary<T3, T4>, Unary<T4, T5>, Unary<T5, R>]): (...args: Parameters<T1>) => R;
export function pipe<T1 extends Action, T2, T3, T4, T5, T6, R>(fns: [T1, Unary<ReturnType<T1>, T2>, Unary<T2, T3>, Unary<T3, T4>, Unary<T4, T5>, Unary<T5, T6>, Unary<T6, R>]): (...args: Parameters<T1>) => R;
export function pipe<T1 extends Action, T2, T3, T4, T5, T6, T7, R>(fns: [T1, Unary<ReturnType<T1>, T2>, Unary<T2, T3>, Unary<T3, T4>, Unary<T4, T5>, Unary<T5, T6>, Unary<T6, T7>, Unary<T7, R>]): (...args: Parameters<T1>) => R;
export function pipe<T1 extends Action, T2, T3, T4, T5, T6, T7, T8, R>(fns: [T1, Unary<ReturnType<T1>, T2>, Unary<T2, T3>, Unary<T3, T4>, Unary<T4, T5>, Unary<T5, T6>, Unary<T6, T7>, Unary<T7, T8>, Unary<T8, R>]): (...args: Parameters<T1>) => R;
export function pipe<T1 extends Action, T2, T3, T4, T5, T6, T7, T8, T9, R>(fns: [T1, Unary<ReturnType<T1>, T2>, Unary<T2, T3>, Unary<T3, T4>, Unary<T4, T5>, Unary<T5, T6>, Unary<T6, T7>, Unary<T7, T8>, Unary<T8, T9>, Unary<T9, R>]): (...args: Parameters<T1>) => R;
export function pipe(fns: any[]) {
    return (...args) => {
        let firstFn = true;
        let firstArgs = args;
        let currentArg = null;

        for(let i = 0; i < fns.length; i++) {
            let result;
            if(firstFn) {
                firstFn = false;
                result = fns[i](...firstArgs);
            } else {
                result = fns[i](currentArg);
            }
            currentArg = result;
        }

        return currentArg;
    }
}


export function split<T1, T2, R>(fns: [Unary<T1, T2>], fn: (args: [T2]) => R, arg: T1): R
export function split<T1, T2, T3, R>(fns: [
    Unary<T1, T2>,
    Unary<T1, T3>,
], fn: (args: [
    T2,
    T3,
]) => R, arg: T1): R
export function split<T1, T2, T3, T4, R>(fns: [
    Unary<T1, T2>,
    Unary<T1, T3>,
    Unary<T1, T4>,
], fn: (args: [
    T2,
    T3,
    T4,
]) => R, arg: T1): R
export function split<T1, T2, T3, T4, T5, R>(fns: [
    Unary<T1, T2>,
    Unary<T1, T3>,
    Unary<T1, T4>,
    Unary<T1, T5>,
], fn: (args: [
    T2,
    T3,
    T4,
    T5,
]) => R, arg: T1): R
export function split<T1, T2, T3, T4, T5, T6, R>(fns: [
    Unary<T1, T2>,
    Unary<T1, T3>,
    Unary<T1, T4>,
    Unary<T1, T5>,
    Unary<T1, T6>,
], fn: (args: [
    T2,
    T3,
    T4,
    T5,
    T6,
]) => R, arg: T1): R
export function split<T1, T2, T3, T4, T5, T6, T7, R>(fns: [
    Unary<T1, T2>,
    Unary<T1, T3>,
    Unary<T1, T4>,
    Unary<T1, T5>,
    Unary<T1, T6>,
    Unary<T1, T7>,
], fn: (args: [
    T2,
    T3,
    T4,
    T5,
    T6,
    T7,
]) => R, arg: T1): R
export function split<T1, T2, T3, T4, T5, T6, T7, T8, R>(fns: [
    Unary<T1, T2>,
    Unary<T1, T3>,
    Unary<T1, T4>,
    Unary<T1, T5>,
    Unary<T1, T6>,
    Unary<T1, T7>,
    Unary<T1, T8>,
], fn: (args: [
    T2,
    T3,
    T4,
    T5,
    T6,
    T7,
    T8,
]) => R, arg: T1): R
export function split<T1, T2, T3, T4, T5, T6, T7, T8, T9, R>(fns: [
    Unary<T1, T2>,
    Unary<T1, T3>,
    Unary<T1, T4>,
    Unary<T1, T5>,
    Unary<T1, T6>,
    Unary<T1, T7>,
    Unary<T1, T8>,
    Unary<T1, T9>,
], fn: (args: [
    T2,
    T3,
    T4,
    T5,
    T6,
    T7,
    T8,
    T9,
]) => R, arg: T1): R
export function split<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, R>(fns: [
    Unary<T1, T2>,
    Unary<T1, T3>,
    Unary<T1, T4>,
    Unary<T1, T5>,
    Unary<T1, T6>,
    Unary<T1, T7>,
    Unary<T1, T8>,
    Unary<T1, T9>,
    Unary<T1, T10>,
], fn: (args: [
    T2,
    T3,
    T4,
    T5,
    T6,
    T7,
    T8,
    T9,
    T10,
]) => R, arg: T1): R
export function split<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, R>(fns: [
    Unary<T1, T2>,
    Unary<T1, T3>,
    Unary<T1, T4>,
    Unary<T1, T5>,
    Unary<T1, T6>,
    Unary<T1, T7>,
    Unary<T1, T8>,
    Unary<T1, T9>,
    Unary<T1, T10>,
    Unary<T1, T11>,
], fn: (args: [
    T2,
    T3,
    T4,
    T5,
    T6,
    T7,
    T8,
    T9,
    T10,
    T11,
]) => R, arg: T1): R
export function split(fns, fn, arg) {
    const resultArr = [];
    const push = (v) => resultArr.push(v);
    const apply = store(arg);

    forEach(compose([push, apply]), fns);

    return fn(resultArr);
}
