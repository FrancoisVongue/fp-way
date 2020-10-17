import {when} from "../basic functions/index";
import {compose} from "../../index";
import {curry} from "../function-transformation/curry";
import {allPass, and, not} from "./boolean";

export const forEach = curry((f, arr) => {
    for(let i = 0; i < arr.length; i++) {
        f(arr[i], i)
    }
});

export const select = curry((p, arr) => arr.filter(p));
export const exclude = curry((p, arr) => select(not(p), arr));
export const map = curry((f, arr) => arr.map(f));
export const reduce = curry((reducer, base, arr) => {
    let intermediateValue = base;

    const updateValue = (currentArrValue, currentIndex) =>
        intermediateValue = reducer(intermediateValue, currentArrValue, currentIndex);

    forEach(updateValue, arr);
    return intermediateValue;
});

export const every = curry((p, arr) => reduce((b, v, i) => b && p(v, i), true, arr));
export const contains = curry((value, arr: any[]) => ~arr.indexOf(value));
export const tail = curry((arr) => arr.length > 1 ? [...arr].slice(1) : [...arr]);
export const head = curry((arr) => arr.length > 1 ? [...arr].slice(0, arr.length - 1) : [...arr]);
export const take = curry((n, arr) => arr.length < n ? [...arr] : [...arr].slice(0, n));
export const takeLast = curry((n, arr) => arr.length < n ? [...arr] : [...arr].slice(-n));
export const append = curry((arr, value) => [...arr, value]);
export const prepend = curry((arr, value) => [value, ...arr]);
export const takeWhile = curry((p, arr) => {
    const newArr = [];
    let stillTaking = true;

    for(let i = 0; i < arr.length && stillTaking; i++) {
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
export const flatten = curry((arr) => arr.reduce((b, v) => b.concat(v), []));
export const subtractArr = curry((arr, arrBase) => {
    const arrSet = new Set(arr);
    const isInSet = v => arrSet.has(v);

    return exclude(isInSet, arrBase);
});
export const mergeArr = curry((arr, anotherArr) => {
    const anotherArrSet = new Set(anotherArr);
    const isNewMember = v => !anotherArrSet.has(v);
    const newMembers = select(isNewMember, arr);

    return [...anotherArr, ...newMembers];
});
export const intersection = curry((arr, anotherArr) => {
    const arrSet = new Set(arr);
    const anotherArrSet = new Set(anotherArr);

    const commonToBoth = allPass([
        (v) => arrSet.has(v),
        (v) => anotherArrSet.has(v),
    ]);

    return select(commonToBoth, [...arr, ...anotherArr]);
});
// todo: multiply?, range?, arrayOfLength(to utils?)
