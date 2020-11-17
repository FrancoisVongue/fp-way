import { Compose, Curry, IfElse, Not, Variable } from "../core";
import { ContainedIn, Contains, IsArray } from "../validation/array";

export const ForEach = Curry(<T1>(f: (arg: T1, index?: number) => any, arr: T1[]) => {
    for(let i = 0; i < arr.length; i++) {
        f(arr[i], i);
    }
});
export const ForNumberOfTimes = Curry((n, f) => {
    for(let i = 0; i < n; i++) {
        f(i);
    }
});

export const Select = Curry((p, arr) => arr.filter(p));
export const Exclude = Curry((p, arr) => arr.filter(Not(p)))
export const MapArr = Curry((f, arr) => arr.map(f));
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
    ForEach((v, i) => {
        IfElse(IsArray, flattenAndConcat, PushTo(newArr))(v);
    }, arr);

    return newArr;
}
export const SubtractArr = Curry((values, target) => Exclude(ContainedIn(values), target))
export const IntersectionBetween = Curry((arr1, arr2) => {
    const [smallerArr, BiggerArr] = arr1.length > arr2.length 
        ? [arr2, arr1] 
        : [arr1, arr2];
    
    const bigset = new Set(BiggerArr);
    return Select(v => bigset.has(v), smallerArr);
});
export const EqualsArray = Curry((arr, arrUnderTest) => {
    const sameLength = arr.length === arrUnderTest.length;
    const sameElems = SubtractArr(arr, arrUnderTest).length === 0;
    return sameLength && sameElems;
});
const allCombinations_2 = Curry((arr1, arr2) => {
    const combinations = [];
    ForEach(v => {
        ForEach(v2 => {
            combinations.push([v, v2]);
        }, arr2);
    }, arr1);

    return combinations;
});
export function AllCombinations(arrs: any[][]) {
    switch (arrs.length) {
        case 1:
            return arrs[0];
        case 2:
            return allCombinations_2(arrs[0], arrs[1]);
        default:
            return Compose([
                MapArr(Flatten),
                allCombinations_2(arrs[0]),
                AllCombinations,
                Tail
            ])(arrs);
    }
};
