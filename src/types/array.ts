import {
    Const,
    curry,
    ifElse,
    Return,
    Swap,
    when,
    tap,
} from "./basic-functions";
import {allPass, negate} from "./boolean";
import {abs, add, difference, increment, lt, negateNumber} from "./number";
import {compose, pipe} from "./construction/function";

/*
* =====================================================================================
* TRANSLATE
* ====================================================================================
* */


/*
* =====================================================================================
* VALIDATE
* ====================================================================================
* */
export const isArray = arr => Array.isArray(arr);
export const allElementsAre = curry((p, arr) => reduce((b, v, i) => b && p(v, i), true, arr));
export const someElementsAre = curry((p, arr) => reduce((b, v, i) => b || p(v, i), false, arr));
export const contains = curry((v, arr) => arr.includes(v));
export const containedIn = Swap(contains);
export const isSupersetOf = curry((subArr, arr) => allElementsAre(containedIn(arr), subArr));
export const isArrayOfLength = curry((n, arr) => isArray(arr) && arr.length === n);


/*
* =====================================================================================
* TRANSFORM
* ====================================================================================
* */
export const forEach = curry((f, arr) => {
    for(let i = 0; i < arr.length; i++) {
        f(arr[i], i);
    }
});
export const forNumberOfTimes = curry((n, f) => {
    for(let i = 0; i < n; i++) {
        f(i);
    }
});

export const select = curry((p, arr) => arr.filter(p));
export const exclude = curry((p, arr) => select(negate(p), arr));
export const map = curry((f, arr) => arr.map(f));
export const reduce = curry((reducer, base, arr) => {
    let intermediateValue = base;

    const updateValue = (currentArrValue, currentIndex) =>
        intermediateValue = reducer(intermediateValue, currentArrValue, currentIndex);

    forEach(updateValue, arr);
    return intermediateValue;
});
export const concatTo = curry((arr, arrOfValues) => arr.push(...arrOfValues));
export const pushTo = curry((arr, v) => arr.push(v));
export const tail = curry((arr) => arr.length > 1 ? [...arr].slice(1) : [...arr]);
export const nose = curry((arr) => arr.length > 1 ? [...arr].slice(0, arr.length - 1) : [...arr]);
export const take = curry((n, arr) => arr.length < n ? [...arr] : [...arr].slice(0, n));
export const takeLast = curry((n, arr) => arr.length < n ? [...arr] : [...arr].slice(-n));
export const append = curry((arr, value) => [...arr, value]);
export const prepend = curry((arr, value) => [value, ...arr]);
export const takeWhile = curry((p, arr) => {
    const newArr = [];
    let stillTaking = true;

    for(let i = 0; i < arr.length && stillTaking; i++) { // todo: refactor to when(p(arr[i], i), push)
        stillTaking = p(arr[i], i);

        if(stillTaking) {
            newArr.push(arr[i]);
        }
    }

    return newArr;
});
export const skipWhile = curry((p, arr) => {
    const newArr = [];
    let skipping = true;

    for(let i = 0; i < arr.length; i++) {
        skipping = p(arr[i], i) && skipping;

        if(!skipping)
            newArr.push(arr[i]);
    }

    return newArr;
});
export const flatten = arr => {
    const newArr = [];
    const flattenAndConcat = compose([concatTo(newArr), flatten]);
    const pushOne = pushTo(newArr);

    forEach((v, i) => {
        ifElse(isArray, flattenAndConcat, pushOne)(v);
    }, arr);

    return newArr;
}
export const subtractArr = curry((subtractionArr, baseArr) => {
    const subtractionArrSet = new Set(subtractionArr);
    const isInSubtractionArr = v => subtractionArrSet.has(v);

    return exclude(isInSubtractionArr, baseArr);
});
export const concatUnique = curry((extraArr, baseArr) => {
    const baseArrSet = new Set(baseArr);
    const isNewMember = negate(containedIn(baseArrSet));
    const newMembers = select(isNewMember, extraArr);

    return [...baseArr, ...newMembers];
});
export const intersectWith = curry((arr, anotherArr) => {
    const arrSet = new Set(arr);
    const anotherArrSet = new Set(anotherArr);

    const smallerArr = arr.length > anotherArr.length ? anotherArr : arr;
    const commonToBoth = allPass([
        containedIn(arrSet),
        containedIn(anotherArrSet),
    ]);

    return select(commonToBoth, [smallerArr]);
});
const allCombinations_2 = curry((arr1, arr2) => {
    const combinations = [];
    forEach(v => {
        forEach(v2 => {
            combinations.push([v, v2]);
        }, arr2);
    }, arr1);

    return combinations;
});
export function allCombinations(arrs) {
    switch (arrs.length) {
        case 1:
            return arrs[0];
        case 2:
            return allCombinations_2(...arrs);
        default:
            return compose([
                map(flatten),
                allCombinations_2(arrs[0]),
                allCombinations,
                tail
            ])(arrs);
    }
};
