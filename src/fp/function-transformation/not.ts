import {Predicate} from "../types/function";

export const not = <T1 extends Predicate>(p: T1) =>
    (...args: Parameters<T1>):boolean => {
        return !p(...args);
    }
