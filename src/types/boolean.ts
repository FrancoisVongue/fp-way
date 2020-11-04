import {compose, curry} from "./basic-functions";
/*
* =====================================================================================
* TRANSLATE
* ====================================================================================
* */
export const toBoolean = v => !!v;


/*
* =====================================================================================
* VALIDATE
* ====================================================================================
* */
export const isBoolean = v => v === true || v === false;
export const isTrue = v => v === true;
export const isFalse = v => v === false;

/*
* =====================================================================================
* TRANSFORM
* ====================================================================================
* */
export const negateValue = v => !v;
export const either = curry((a,b) => toBoolean(a || b));
export const both = curry((a,b) => toBoolean(a && b));
export const none = curry((a,b) => compose([negateValue, either(a, b)]));

/**
 * Negates the return value of a function
 * @param f - function to negate
 * @returns - negated function */
export const negate = curry((f) => (v) => !f(v));
export const allPass = curry((fns, arg) => fns.every(f => f(arg)));
export const eitherPass = curry( (fns, arg) => fns.some(f => f(arg)));
export const neitherPass = curry((fns, arg) => !fns.some(f => f(arg)));
