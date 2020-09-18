import {not, when} from "../basic functions/index";
import {compose} from "../../index";
import {curry} from "../function-transformation/curry";
import {all} from "./boolean";

export const forEach = (f, arr) => {
    for(let i = 0; i < arr.length; i++) {
        f(arr[i], i)
    }
}

export const select = (p, arr) => {
        const newArr = [];
        const push = v => newArr.push(v);

        forEach(v => when(p, push, v), arr);
        return newArr;
}
export const exclude = (p, arr) => select(not(p), arr);

export const map = (f, arr) => {
    const newArr = [];
    const push = v => newArr.push(v);

    forEach(compose([push, f]), arr);
    return newArr;
}

export const reduce = (reducer, base, arr) => {
    let intermediateValue = base;

    const updateValue = (currentArrValue, currentIndex) =>
        intermediateValue = reducer(intermediateValue, currentArrValue, currentIndex);

    forEach(updateValue, arr);
    return intermediateValue;
}

export const contains = (value, arr: any[]) => ~arr.indexOf(value);
export const tail = arr => arr.length > 1 ? [...arr].slice(1) : [...arr];
export const head = arr => arr.length > 1 ? [...arr].slice(0, arr.length - 1) : [...arr];
export const take = (n, arr) => arr.length < n ? [...arr] : [...arr].slice(0, n);
export const takeLast = (n, arr) => arr.length < n ? [...arr] : [...arr].slice(-n);
export const append = (arr, value) => [...arr, value];
export const prepend = (arr, value) => [value, ...arr];
export const takeWhile = (p, arr) => {
    const newArr = [];
    let stillTaking = true;

    for(let i = 0; i < arr.length && stillTaking; i++) {
        stillTaking = p(arr[i], i);

        if(stillTaking)
            newArr.push(arr[i]);
    }

    return newArr;
}
export const skipWhile = (p, arr) => {
    const newArr = [];
    let skipping = true;

    for(let i = 0; i < arr.length; i++) {
        skipping = p(arr[i], i) && skipping;

        if(!skipping)
            newArr.push(arr[i]);
    }

    return newArr;
}
export const flatten = arr => arr.reduce((b, v) => b.concat(v), []);
export const subtractArr = (arr, arrBase) => {
    const arrSet = new Set(arr);
    const isInSet = v => arrSet.has(v);

    return exclude(isInSet, arrBase);
}
export const mergeArr = (arr, anotherArr) => {
    const anotherArrSet = new Set(anotherArr);
    const isNewMember = v => !anotherArrSet.has(v);
    const newMembers = select(isNewMember, arr);

    return [...anotherArr, ...newMembers];
}
export const intersection = (arr, anotherArr) => {
    const arrSet = new Set(arr);
    const anotherArrSet = new Set(anotherArr);
    const isCommon = curry(all)([
        (v) => arrSet.has(v),
        (v) => anotherArrSet.has(v),
    ]);

    const commonMembers = select(isCommon, [...arr, ...anotherArr]);

    return commonMembers;
}
