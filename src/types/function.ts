import {curry} from "./basic-functions";

export const toUnary = f => argsArr => f(...argsArr);
export const Unary = f => curry(a => f(a));
export const Binary = f => curry((a, b) => f(a, b));
export const memo = f => {
    const mapOfArgs = new Map();

    return arg => {
        if (!mapOfArgs.has(arg)) {
            let result = f(arg);
            mapOfArgs.set(arg, result);
        }
        return mapOfArgs.get(arg);
    };
}
export const tapWith = curry((f, arg) => (f(arg), arg));
export const tapBefore = curry
(
    (tapper, fn, arg) => {
        tapper(arg);
        return fn(arg);
    }
);
export const tapAfter = curry(
    (tapper, fn, arg) => {
        const result = fn(arg);
        tapper(result);
        return result;
    }
);
export const devourWith = curry(
    (devourer, fn, arg) => devourer(fn, arg)
);
