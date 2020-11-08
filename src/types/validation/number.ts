import { curry } from "../..";
import { serialize, serializeInvalidValue } from "../utility";

export const isNumber = n => typeof n === 'number' && n === n;
export const isInt = n => isNumber(n) && n%1 === 0;
export const isFiniteNumber = n => isNumber(n) && n !== Infinity && n !== -Infinity;

export const gt = curry((n1, n2) => {
    if(!isNumber(n1) || !isNumber(n2)) 
        return false;

    return n2 > n1;
});
export const gte = curry((n1, n2) => {
    if(!isNumber(n1) || !isNumber(n2)) 
        return false;

    return n2 >= n1;
});
export const lt = curry((n1, n2) => {
    if(!isNumber(n1) || !isNumber(n2)) 
        return false;

    return n2 < n1;
});
export const lte = curry((n1, n2) => {
    if(!isNumber(n1) || !isNumber(n2)) 
        return false;

    return n2 <= n1;
});
export const isInsideRange = curry((n1, n2, n) => {
    if(!isNumber(n1) || !isNumber(n2) || !isNumber(n)) 
        return false;

    return n2 <= n1;
});
export const isPositive = gt(0);
export const isNegative = lt(0);