import {Binary, Quaternary, Ternary, Unary, Function} from "../types/index";

export function pipe<T1 extends Function, R>(fns: [T1, Unary<ReturnType<T1>, R>]): (...args: Parameters<T1>) => R;
export function pipe<T1 extends Function, T2, R>(fns: [T1, Unary<ReturnType<T1>, T2>, Unary<T2, R>]): (...args: Parameters<T1>) => R;
export function pipe<T1 extends Function, T2, T3, R>(fns: [T1, Unary<ReturnType<T1>, T2>, Unary<T2, T3>, Unary<T3, R>]): (...args: Parameters<T1>) => R;
export function pipe<T1 extends Function, T2, T3, T4, R>(fns: [T1, Unary<ReturnType<T1>, T2>, Unary<T2, T3>, Unary<T3, T4>, Unary<T4, R>]): (...args: Parameters<T1>) => R;
export function pipe<T1 extends Function, T2, T3, T4, T5, R>(fns: [T1, Unary<ReturnType<T1>, T2>, Unary<T2, T3>, Unary<T3, T4>, Unary<T4, T5>, Unary<T5, R>]): (...args: Parameters<T1>) => R;
export function pipe<T1 extends Function, T2, T3, T4, T5, T6, R>(fns: [T1, Unary<ReturnType<T1>, T2>, Unary<T2, T3>, Unary<T3, T4>, Unary<T4, T5>, Unary<T5, T6>, Unary<T6, R>]): (...args: Parameters<T1>) => R;
export function pipe<T1 extends Function, T2, T3, T4, T5, T6, T7, R>(fns: [T1, Unary<ReturnType<T1>, T2>, Unary<T2, T3>, Unary<T3, T4>, Unary<T4, T5>, Unary<T5, T6>, Unary<T6, T7>, Unary<T7, R>]): (...args: Parameters<T1>) => R;
export function pipe<T1 extends Function, T2, T3, T4, T5, T6, T7, T8, R>(fns: [T1, Unary<ReturnType<T1>, T2>, Unary<T2, T3>, Unary<T3, T4>, Unary<T4, T5>, Unary<T5, T6>, Unary<T6, T7>, Unary<T7, T8>, Unary<T8, R>]): (...args: Parameters<T1>) => R;
export function pipe<T1 extends Function, T2, T3, T4, T5, T6, T7, T8, T9, R>(fns: [T1, Unary<ReturnType<T1>, T2>, Unary<T2, T3>, Unary<T3, T4>, Unary<T4, T5>, Unary<T5, T6>, Unary<T6, T7>, Unary<T7, T8>, Unary<T8, T9>, Unary<T9, R>]): (...args: Parameters<T1>) => R;
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
