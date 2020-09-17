export const Const = a => b => a;
export const Variable = a => b => b;
export const Swap = (f, a, b) => f(b, a);
export const identity = x => x;
export const applyTo = (arg, f) => f(arg);
export const applyTo_2 = (arg1, arg2, f) => f(arg1, arg2);
export const applyTo_3 = (arg1, arg2, arg3, f) => f(arg1, arg2, arg3);
export const call = (f, arg) => f(arg);
export const call_2 = (f, arg1, arg2) => f(arg1, arg2);
export const call_3 = (f, arg1, arg2, arg3) => f(arg1, arg2, arg3);
export const delayCall = (f, arg) => () => f(arg);
export const not = f => (...args) => !f(...args);
export const when = (p, f, arg) => p(arg) ? f(arg) : arg;
export const unless = (p, f, arg) => p(arg) ? arg : f(arg);

