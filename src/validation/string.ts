import {Const, Curry, Is} from "../core";

export const IsString = s => typeof s === 'string';
export const IsUpperCase = (s: string) => s.toUpperCase() === s;
export const IsLowerCase = (s: string) => s.toLowerCase() === s;
export const Test = Curry((regex: RegExp, str: string) => regex.test(ToString(str))); // todo: remove toString, it fails (test)
export const Matches = Test;
export const StartsWith = (start, str) => {
    const startString = ToString(start);
    const targetString = ToString(str);

    return startString.length < targetString.length &&
        Is(startString)(targetString.slice(0, startString.length));
};
export const EndsWith = (end, str) => {
    const endString = ToString(end);
    const targetString = ToString(str);

    return endString.length < targetString.length &&
        Is(endString)(targetString.slice(-endString.length));
};
export const ContainsString = Curry((str, target) => {
    return (ToString(target)).includes(ToString(str));
});

export const ToString = v => JSON.stringify(v);
export const OccurrencesOf = (R, str) => {
    const regex = new RegExp(R as RegExp, 'g');
    return (str as string).match(regex);
};
