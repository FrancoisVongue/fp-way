import {Const, curry, is} from "../core";
import {toString} from "../translation/string";

export const isString = s => typeof s === 'string';
export const test = (regex, str) => regex.test(toString(str));
export const matches = test;
export const startsWith = (start, str) => {
    const startString = toString(start);
    const targetString = toString(str);

    return startString.length < targetString.length &&
        is(startString)(targetString.slice(0, startString.length));
};
export const endsWith = (end, str) => {
    const endString = toString(end);
    const targetString = toString(str);

    return endString.length < targetString.length &&
        is(endString)(targetString.slice(-endString.length));
};
export const containsString = curry((str, target) => {
    return (toString(target)).includes(toString(str));
});
