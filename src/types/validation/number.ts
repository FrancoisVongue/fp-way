import {attempt, call, Const, curry, Identity, inCase} from "../..";
import {TranslationError, Type} from "../utility";
import {numberFromBoolean, numberFromString, toNumber} from "../translation/number";
import {both} from "./boolean";

export const isNumber = n => typeof n === 'number' && !isNaN(n);
export const isInt = n => isNumber(n) && n%1 === 0;
export const isFiniteNumber = n => isNumber(n) && n !== Infinity && n !== -Infinity;


export const gt = curry((n1, n2) => {
    return toNumber(n2) > toNumber(n1);
});
export const gte = curry((n1, n2) => {
    return toNumber(n2) >= toNumber(n1);
});
export const lt = curry((n1, n2) => {
    return toNumber(n2) < toNumber(n1);
});
export const lte = curry((n1, n2) => {
    return toNumber(n2) <= toNumber(n1);
});

export const isInRange = curry((n1, n2, n) => {
    return both(gte(n1), lte(n2))(n);
});
export const isPositive = gt(0);
export const isNegative = lt(0);
