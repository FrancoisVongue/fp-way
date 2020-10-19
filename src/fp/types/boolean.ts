import {curry} from "../function-transformation/index";

export const not = curry((f) => (v) => !f(v));
export const allPass = curry((fns, arg) => fns.every(f => f(arg)));
export const eitherPass = curry( (fns, arg) => fns.some(f => f(arg)));
export const neitherPass = curry((fns, arg) => !fns.some(f => f(arg)));
