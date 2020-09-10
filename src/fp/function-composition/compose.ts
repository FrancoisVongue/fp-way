import {Unary, Function} from "../types/index";

export function compose<T1 extends Function, R>(fns: [Unary<ReturnType<T1>, R>, T1]): (...args: Parameters<T1>) => R;
export function compose<T1 extends Function, T2, R>(fns: [Unary<T2, R>,Unary<ReturnType<T1>, T2>,T1]): (...args: Parameters<T1>) => R;

export function compose<T1 extends Function, T2, T3, R>(fns: [
    Unary<T3, R>,
    Unary<T2, T3>,
    Unary<ReturnType<T1>, T2>, T1
]): (...args: Parameters<T1>) => R;
export function compose<T1 extends Function, T2, T3, T4, R>(fns: [
    Unary<T4, R>,
    Unary<T3, T4>,
    Unary<T2, T3>,
    Unary<ReturnType<T1>, T2>, T1
]): (...args: Parameters<T1>) => R;
export function compose<T1 extends Function, T2, T3, T4, T5, R>(fns: [
    Unary<T5, R>,
    Unary<T4, T5>,
    Unary<T3, T4>,
    Unary<T2, T3>,
    Unary<ReturnType<T1>, T2>, T1
]): (...args: Parameters<T1>) => R;
export function compose<T1 extends Function, T2, T3, T4, T5, T6, R>(fns: [
    Unary<T6, R>,
    Unary<T5, T6>,
    Unary<T4, T5>,
    Unary<T3, T4>,
    Unary<T2, T3>,
    Unary<ReturnType<T1>, T2>, T1
]): (...args: Parameters<T1>) => R;
export function compose<T1 extends Function, T2, T3, T4, T5, T6, T7, R>(fns: [
    Unary<T7, R>,
    Unary<T6, T7>,
    Unary<T5, T6>,
    Unary<T4, T5>,
    Unary<T3, T4>,
    Unary<T2, T3>,
    Unary<ReturnType<T1>, T2>, T1
]): (...args: Parameters<T1>) => R;
export function compose<T1 extends Function, T2, T3, T4, T5, T6, T7, T8, R>(fns: [
    Unary<T8, R>,
    Unary<T7, T8>,
    Unary<T6, T7>,
    Unary<T5, T6>,
    Unary<T4, T5>,
    Unary<T3, T4>,
    Unary<T2, T3>,
    Unary<ReturnType<T1>, T2>, T1
]): (...args: Parameters<T1>) => R;
export function compose<T1 extends Function, T2, T3, T4, T5, T6, T7, T8, T9, R>(fns: [
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
