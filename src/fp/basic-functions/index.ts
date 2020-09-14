import {Action, Predicate, Function, Unary} from '../types/action'
import {not} from "../types/boolean";
const identity = x => x;

// todo: test this function first then test the split
export const store = <T1>(args: T1): (Unary<T1, any>) => any =>
    (f: Unary<T1, any>) => f(args);

export const call = <T1 extends Action>(f: T1, args: Parameters<T1>):
    ReturnType<T1> =>
    f(...args);

export const delayCall = <T1 extends Action>(f: T1, args: Parameters<T1>):
    () => ReturnType<T1> =>
    () => f(...args);

export const when = <F extends Action>(predicate: (...args: Parameters<F>) => boolean, whenTrue: F) => {
    return (...args: Parameters<F>): ReturnType<F> | void => {
        if(predicate(...args)) {
            return whenTrue(...args);
        } else {
            return void 0;
        }
    }
}
export const unless = <F extends Action>(predicate: (...args: Parameters<F>) => boolean, whenTrue: F) => {
    return (...args: Parameters<F>): ReturnType<F> | void => {
        if(not(predicate)(...args)) {
            return whenTrue(...args);
        } else {
            return void 0;
        }
    }
}

