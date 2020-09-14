import {Predicate, Unary} from "./action";

export const not = <T1 extends Predicate>(p: T1) =>
    (...args: Parameters<T1>): boolean => {
        return !p(...args);
    }

/*
export const all = <T1>(fns: Unary<T1, boolean>[]): (arg: T1) => boolean => {
    return (arg: T1) => {
        let okay = true;
        const notOkay = () => okay = false;
        return fo;
    }
}
*/
