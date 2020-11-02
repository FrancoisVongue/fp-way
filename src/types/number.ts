import {compose, curry, identity, ifElse, unless, when} from "./basic-functions";
import {allPass} from "./boolean";

/*
* =====================================================================================
* TRANSLATE
* ====================================================================================
* */
export const parseNumber = str => parseFloat(str);


/*
* =====================================================================================
* VALIDATE
* ====================================================================================
* */
export const isNumber = n => typeof n === 'number' && n === n;
export const isInt = n => isNumber(n) && n%1 === 0;
export const gt = curry((n1, n2) => n2 > n1);
export const gte = curry((n1, n2) => n2 >= n1);
export const lt = curry((n1, n2) => n2 < n1);
export const lte = curry((n1, n2) => n2 <= n1);
export const inRange = curry((min, max, n) => allPass([gte(min), lte(max)])(n));
export const isPositive = gt(0);
export const isNegative = lt(0);


/*
* =====================================================================================
* TRANSFORM
* ====================================================================================
* */
export const negateNumber = v => -v;
export const abs = v => when(isNegative, negateNumber);
export const max = curry((maxNumber, n2) => n2 > maxNumber ? maxNumber : n2);
export const min = curry((minNumber, n2) => n2 < minNumber ? minNumber : n2);
export const add = curry((a, b) => a + b);
export const subtract = curry((a, b) => b - a );
export const multiplyBy = curry((a, b) => b * a );
export const divideBy = curry((a, b) => b / a );
export const pow = curry((extent, a) => a**extent);
