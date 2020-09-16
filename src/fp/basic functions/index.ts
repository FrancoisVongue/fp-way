import {Action, Predicate, Function, Unary} from '../types/action'
import {not} from "../types/boolean";

// todo: test this function first then test the split
// todo: separate TS from JS
export const Const = a => b => a;
export const Variable = a => b => b;
export const Swap = (f, a, b) => f(b, a);
export const identity = x => x;
export const store = (arg, f) => f(arg);
export const store_2 = (arg1, arg2, f) => f(arg1, arg2);
export const store_3 = (arg1, arg2, arg3, f) => f(arg1, arg2, arg3);
export const call = (f, arg) => f(arg);
export const call_2 = (f, arg1, arg2) => f(arg1, arg2);
export const call_3 = (f, arg1, arg2, arg3) => f(arg1, arg2, arg3);
export const delayCall = (f, arg) => () => f(arg);
export const when = (p, f, arg) => {
    if(p(arg)) {
        return f(arg);
    } else {
        return arg;
    }
}
export const unless = (p, f, arg) => {
    return when(not(p), f, arg);
}

