import {Binary, Ternary, Unary} from "./function";
import {when} from "../basic-functions/index";
import {not} from "../function-transformation/not";
import {compose} from "../function-composition/compose";

const forEach = <T1, R>(f: Binary<T1, number, R>, arr: T1[]) => {
    for(let i = 0; i < arr.length; i++) {
        f(arr[i], i)
    }
}

const select = <T1>(p: Unary<T1, boolean>, arr: T1[]): T1[] => {
        const newArr: T1[] = [];
        const push = (value: T1) => newArr.push(value);

        forEach(when(p, push), arr);
        return newArr;
}

const exclude = <T1>(p: Unary<T1, boolean>, arr: T1[]): T1[] => {
    return select(not(p), arr);
}

const map = <T1, R>(f: Binary<T1, number, R>, arr: T1[]): R[] => {
    const newArr: R[] = [];
    const push = (value: R) => newArr.push(value);

    forEach(compose([push, f]), arr);
    return newArr;
}

const reduce = <T1, T2, R>(reducer: Ternary<T1, T2, number, T1>, base: T1 = null, arr: T2[]) => {
    let intermediateValue = base;
    const updateValue = (currentArrValue: T2, currentIndex: number) => {
        intermediateValue = reducer(intermediateValue, currentArrValue, currentIndex);
    }

    forEach(updateValue, arr);
}
