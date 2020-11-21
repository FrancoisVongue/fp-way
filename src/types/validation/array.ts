import {Compose, Curry, Swap} from "../core";
import {Both} from "./boolean";

export const IsArray = arr => Array.isArray(arr);

export const IsArrayOfLength = Curry((n, arr) => IsArray(arr) && arr.length === n);
export const IsEmptyArray = IsArrayOfLength(0);
export const AllElementsAre = Curry((p, arr) => arr.every(p));
export const SomeElementsAre = Curry((p, arr) => arr.some(p));
export const Contains = Curry((v, arr) => arr.includes(v));
export const ContainedIn = Swap(Contains);
export const IsSupersetOf = Curry((sub, sup):boolean => sub.every(e => sup.includes(e)));
export const IsSubsetOf = Swap(IsSupersetOf);
export const EqualsArray = Curry((arr, arrUnderTest) => {
    const hasSameLength = IsArrayOfLength(arr.length);
    return Both(hasSameLength, IsSubsetOf(arr))(arrUnderTest);
});
