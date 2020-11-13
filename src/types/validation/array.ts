import { Swap } from "../..";

export const isArray = arr => Array.isArray(arr);
export const allElementsAre = (p, arr) => arr.every(p);
export const someElementsAre = (p, arr) => arr.some(p);
export const contains = (v, arr) => arr.includes(v);
export const containedIn = Swap(contains);
export const isSupersetOf = (sub, sup) => sub.every(e => sup.includes(e));
export const isSubsetOf = Swap(isSupersetOf);
export const isArrayOfLength = (n, arr) => isArray(arr) && arr.length === n;