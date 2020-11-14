import { Curry, Swap } from "../core";

export const IsArray = arr => Array.isArray(arr);
export const AllElementsAre = Curry((p, arr) => arr.every(p));
export const SomeElementsAre = Curry((p, arr) => arr.some(p));
export const Contains = Curry((v, arr) => arr.includes(v));
export const ContainedIn = Swap(Contains);
export const IsSupersetOf = Curry((sub, sup) => sub.every(e => sup.includes(e)));
export const IsSubsetOf = Swap(IsSupersetOf);
export const IsArrayOfLength = Curry((n, arr) => IsArray(arr) && arr.length === n);