import {Curry, Swap} from "../core";
import {Both} from "./boolean";
import {Curried, Predicate} from "../core.types";

export const IsArray = arr => Array.isArray(arr);

export const IsArrayOfLength = Curry((n: number, arr: any[]) =>
    IsArray(arr) && arr.length === n);

export const IsEmptyArray = IsArrayOfLength(0);

export type TAllElementsAre<T1 = any> = (
    p: Predicate<T1>,
    arr: T1[]
) => boolean
export type AllElementsAre<T1> = Curried<TAllElementsAre<T1>>
export const AllElementsAre = Curry((p, arr) => arr.every(p));

export type SomeElementsAre<T1> = Curried<TAllElementsAre<T1>>
export const SomeElementsAre = Curry((p, arr) => arr.some(p));

export type NoneElementIs<T1> = Curried<TAllElementsAre<T1>>
export const NoneElementIs = Curry((p, arr) => !arr.some(p));

export const Contains = Curry((v, arr: any[]) => arr.includes(v));
export const ContainedIn = Swap(Contains);

export const IsSupersetOf = Curry((sub: any[], sup: any[]):boolean =>
    AllElementsAre(ContainedIn(sup), sub));
export const IsArrayContaining = IsSupersetOf;

export const IsSubsetOf = Swap(IsSupersetOf);

export const EqualsArray = Curry((arr: any[], arrUnderTest: any[]): boolean => {
    const hasSameLength = IsArrayOfLength(arr.length);
    return Both(hasSameLength, IsSubsetOf(arr))(arrUnderTest);
});

export const EqualsList = Curry((arr: any[], arrUnderTest: any[]): boolean => {
    const haveSameLength = arr.length == arrUnderTest.length;
    if(!haveSameLength)
        return false;

    let equal = true;
    for (let i = 0; i < arr.length && equal; i++)
        equal = equal && arr[i] === arrUnderTest[i];

    return equal;
});
