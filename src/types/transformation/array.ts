import { Compose, Curry, IfElse, Not, Variable } from "../core";
import { containedIn as ContainedIn, contains, isArray } from "../validation/array";

export const forEach = Curry((f, arr) => {
    for(let i = 0; i < arr.length; i++) {
        f(arr[i], i);
    }
});
export const forNumberOfTimes = Curry((n, f) => {
    for(let i = 0; i < n; i++) {
        f(i);
    }
});

export const Select = Curry((p, arr) => arr.filter(p));
export const Exclude = Compose([Select, Not]);
export const Map = Curry((f, arr) => arr.map(f));
export const Reduce = Curry((reducer, base, arr) => arr.reduce(reducer, base));
export const ConcatTo = Curry((arr, arrOfValues) => arr.push(...arrOfValues));
export const PushTo = Curry((arr, v) => arr.push(v));
export const Tail = (arr) => arr.length > 1 ? [...arr].slice(1) : [...arr];
export const Nose = (arr) => arr.length > 1 ? [...arr].slice(0, arr.length - 1) : [...arr];
export const Take = Curry((n, arr) => arr.length < n ? [...arr] : [...arr].slice(0, n));
export const TakeLast = Curry((n, arr) => arr.length < n ? [...arr] : [...arr].slice(-n));
export const Append = Curry((value, arr) => [...arr, value]);
export const Prepend = Curry((arr, value) => [value, ...arr]);
export const Flatten = arr => {
    const newArr = [];
    const flattenAndConcat = Compose([ConcatTo(newArr), Flatten]);
    forEach((v, i) => {
        IfElse(isArray, flattenAndConcat, PushTo(newArr))(v);
    }, arr);

    return newArr;
}
export const subtractArr = Compose([Exclude, ContainedIn, Variable()]);
export const intersectionBetween = Curry((arr1, arr2) => {
    const [smallerArr, BiggerArr] = arr1.length > arr2.length 
        ? [arr2, arr1] 
        : [arr1, arr2];
    
    const bigset  = new Set(BiggerArr);
    return Exclude(v => bigset.has(v))(smallerArr);
});
const allCombinations_2 = Curry((arr1, arr2) => {
    const combinations = [];
    forEach(v => {
        forEach(v2 => {
            combinations.push([v, v2]);
        }, arr2);
    }, arr1);

    return combinations;
});
export function allCombinations(arrs: [any, any][]) {
    switch (arrs.length) {
        case 1:
            return arrs[0];
        case 2:
            return allCombinations_2(...arrs);
        default:
            return Compose([
                Map(Flatten),
                allCombinations_2(arrs[0]),
                allCombinations,
                Tail
            ])(arrs);
    }
};