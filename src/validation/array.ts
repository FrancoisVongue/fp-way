import {Compose, Curry, Swap} from "../core";
import {Both} from "./boolean";
import {ForEach} from "..";

export const IsArray = arr => Array.isArray(arr);

export const IsArrayOfLength = Curry((n, arr) => IsArray(arr) && arr.length === n);
export const IsEmptyArray = IsArrayOfLength(0);

export const AllElementsAre = Curry((p, arr) => arr.every(p));
export const SomeElementsAre = Curry((p, arr) => arr.some(p));
export const NoneElementIs = Curry((p, arr) => !arr.some(p));

// todo: add types from here to the top
export const Contains = Curry((v, arr) => arr.includes(v));
export const ContainedIn = Swap(Contains);

export const IsSupersetOf = Curry((sub: Array<any>, sup: Array<any>):boolean =>
    sub.every(e => sup.includes(e)));
export const IsSubsetOf = Swap(IsSupersetOf);

export const EqualsArray = Curry((arr: Array<any>, arrUnderTest: Array<any>): boolean => {
    const hasSameLength = IsArrayOfLength(arr.length);
    return Both(hasSameLength, IsSubsetOf(arr))(arrUnderTest);
});

export const EqualsList = Curry((arr: Array<any>, arrUnderTest: Array<any>): boolean => {
    const haveSameLength = arr.length == arrUnderTest.length;
    if(!haveSameLength)
        return false;

    let equal = true;
    for (let i = 0; i < arr.length && equal; i++)
        equal = equal && arr[i] === arrUnderTest[i];

    return equal;
});
