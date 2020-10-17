import {curry} from "../function-transformation/curry";

export const gt = curry((n1, n2) => n2 > n1);
export const gte = curry((n1, n2) => n2 >= n1);
export const lt = curry((n1, n2) => n2 < n1);
export const lte = curry((n1, n2) => n2 <= n1);
export const max = curry((maxNumber, n2) => n2 > maxNumber ? maxNumber : n2);
export const min = curry((minNumber, n2) => n2 < minNumber ? minNumber : n2);
export const add = curry((a, b) => a + b);
export const subtract = curry((a, b) => b - a );
export const multiplyBy = curry((a, b) => b * a );
export const divideBy = curry((a, b) => b / a );
export const pow = curry((extent, a) => a**extent);
