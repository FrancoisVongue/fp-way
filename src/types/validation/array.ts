import { curry, reduce, Swap } from "../..";

export const isArray = arr => Array.isArray(arr);
export const allElementsAre = curry((p, arr) => reduce((b, v, i) => b && p(v, i), true, arr));
export const someElementsAre = curry((p, arr) => reduce((b, v, i) => b || p(v, i), false, arr));
export const contains = curry((v, arr) => arr.includes(v));
export const containedIn = Swap(contains);
export const isSupersetOf = curry((subArr, arr) => allElementsAre(containedIn(arr), subArr));
export const isSubsetOf = Swap(isSupersetOf);
export const isArrayOfLength = curry((n, arr) => isArray(arr) && arr.length === n);