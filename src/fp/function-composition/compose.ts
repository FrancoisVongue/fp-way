import {Binary, Quaternary, Ternary, Unary} from "../types/index";

export function compose<T1, R>(fns: [Unary<any, R>, Unary<T1, any>])
export function compose<T1, T2, R>(fns: [Unary<any, R>, Binary<T1, T2, any>])
export function compose<T1, T2, T3, R>(fns: [Unary<any, R>, Ternary<T1, T2, T3, any>])
export function compose<T1, T2, T3, T4, R>(fns: [Unary<any, R>, Quaternary<T1, T2, T3, T4, any>])
export function compose(fns: any[]) {
    return (...args) => {
        let firstArgs = args;
        let currentArg: any;

        for(let i = fns.length - 1; i >= 0; i--) {
            let result;
            if(i === fns.length - 1) {
                result = fns[i](...firstArgs);
            } else {
                result = fns[i](currentArg);
            }
            currentArg = result;
        }

        return currentArg;
    }
}
