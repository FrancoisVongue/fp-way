import {Const, curry, Return} from "../core";

export const arrayOf = (...v) => [...v];
export const arrayOfLength = (n, v=0) => (new Array(n)).map(Return(v));
export const arrayOfRange = curry((start, finish) => {
    const newArr = [];
    const orderIsNegative = Const(finish < start);
    const futureLength = Math.abs(start - finish) + 1;
    const incBy = orderIsNegative ? -1 : 1;

    for(let i = 0; i < futureLength; i++) {
        newArr.push(start + incBy);
    }

    return newArr;
});
