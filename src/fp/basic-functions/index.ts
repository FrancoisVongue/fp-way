import {Function, Predicate} from '../types/function'
import {not} from "../function-transformation/not";
const identity = x => x;

const call = <T1 extends Function>(f: T1, args: Parameters<T1>):
    ReturnType<T1> =>
    f(...args);

const delayCall = <T1 extends Function>(f: T1, args: Parameters<T1>):
    () => ReturnType<T1> =>
    () => f(...args);

export const when = <F extends Function>(predicate: (...args: Parameters<F>) => boolean, whenTrue: F) => {
    return (...args: Parameters<F>): ReturnType<F> | void => {
        if(predicate(...args)) {
            return whenTrue(...args);
        } else {
            return void 0;
        }
    }
}
const unless = <F extends Function>(predicate: (...args: Parameters<F>) => boolean, whenTrue: F) => {
    return (...args: Parameters<F>): ReturnType<F> | void => {
        if(not(predicate)(...args)) {
            return whenTrue(...args);
        } else {
            return void 0;
        }
    }
}

