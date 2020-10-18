import {curry} from "../function-transformation/curry";

export const identity = x => x;
export const Const = a => b => a;
export const Variable = a => b => b;

export const Swap = curry((f, a, b) => f(b, a));

export const applyTo = curry((arg, f) => f(arg));
export const applyTo_2 = curry((arg1, arg2, f) => f(arg1, arg2));
export const applyTo_3 = curry((arg1, arg2, arg3, f) => f(arg1, arg2, arg3));
export const call = curry((f, arg) => f(arg));
export const delayCall = curry((f, arg) => () => call(f, arg));
export const call_2 = curry((f, arg1, arg2) => f(arg1, arg2));
export const call_3 = curry((f, arg1, arg2, arg3) => f(arg1, arg2, arg3));

export const when = curry((p, f, arg) => p(arg) ? f(arg) : arg);
export const unless = curry((p, f, arg) => p(arg) ? arg : f(arg));
