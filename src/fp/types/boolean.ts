import {curry} from "../function-transformation/curry";

export const allPass = curry( (fns, arg) => fns.every(f => f(arg)) );
export const eitherPass = curry( (fns, arg) => fns.some(f => f(arg)));
export const neitherPass = curry((fns, arg) => !fns.some(f => f(arg)));
export const not = curry((f) => (v) => !f(v));
export const and = curry((p1, p2, v) => p1(v) && p2(v));
export const or = curry((p1, p2, v) => p1(v) || p2(v));
