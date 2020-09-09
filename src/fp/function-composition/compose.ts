import {Binary, Quaternary, Ternary, Unary, Function} from "../types/index";

export function compose<T1 extends Function, T2>(fns: [Unary<any, T2>, T1]): (...args: Parameters<T1>) => T2;
export function compose<T1 extends Function, T2>(fns: [Unary<any, T2>, Function, T1]): (...args: Parameters<T1>) => T2;
export function compose<T1 extends Function, T2>(fns: [Unary<any, T2>, Function, Function, T1]): (...args: Parameters<T1>) => T2;
export function compose<T1 extends Function, T2>(fns: [Unary<any, T2>, Function, Function, Function, T1]): (...args: Parameters<T1>) => T2;
export function compose<T1 extends Function, T2>(fns: [Unary<any, T2>, Function, Function, Function, Function, T1]): (...args: Parameters<T1>) => T2;
export function compose<T1 extends Function, T2>(fns: [Unary<any, T2>, Function, Function, Function, Function, Function, T1]): (...args: Parameters<T1>) => T2;
export function compose<T1 extends Function, T2>(fns: [Unary<any, T2>, Function, Function, Function, Function, Function, Function, T1]): (...args: Parameters<T1>) => T2;
export function compose<T1 extends Function, T2>(fns: [Unary<any, T2>, Function, Function, Function, Function, Function, Function, Function, T1]): (...args: Parameters<T1>) => T2;
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
