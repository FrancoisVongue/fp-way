import {curry} from "./basic-functions";
import {compose} from "./construction/function";

/*
* =====================================================================================
* TRANSFORM
* ====================================================================================
* */
export const negateValue = v => !v;

/**
 * Negates the return value of a function
 * @param f - function to negate
 * @returns - negated function */
export const negate = curry((f) => (v) => !f(v));
export const allPass = curry((fns, arg) => fns.every(f => f(arg)));
export const eitherPass = curry( (fns, arg) => fns.some(f => f(arg)));
export const neitherPass = curry((fns, arg) => !fns.some(f => f(arg)));
