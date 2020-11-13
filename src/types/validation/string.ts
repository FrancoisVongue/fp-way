import {Const, Curry, Is} from "../core";

export const IsString = s => typeof s === 'string';
export const IsUpperCase = (s: string) => s.toUpperCase() === s;
export const IsLowerCase = (s: string) => s.toLowerCase() === s;
export const Test = (regex, str) => regex.test(ToString(str));
export const Matches = test;
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
export const OccurrencesOf = (unvalidatedRegex, str) => {
    const regex = new RegExp(unvalidatedRegex as RegExp, 'g');
    return (str as string).match(regex);
};
