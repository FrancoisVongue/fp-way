import {Unary} from "./unary";
import {curry} from "./curry";

export const memo = curry(Unary)((f, mapOfArgs = new Map()) =>
    arg => {
        if(mapOfArgs.has(arg))
            return mapOfArgs.get(arg);
        else {
            let result = f(arg);
            mapOfArgs.set(arg, result);
            return result;
            }
    });
