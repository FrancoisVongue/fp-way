import {reduce} from "./array";

/*VALIDATE*/
export const test = (regex, string) => (regex as RegExp).test(string);

/*TRANSFORM*/
export const split = (splitter, str) => (str as string).split(splitter);
export const occurrencesOf = (unvalidatedRegex, str) => {
    const regex = new RegExp(unvalidatedRegex as RegExp, 'g');
    return (str as string).match(regex);
}
export const concat = (s1, s2) => s1 + s2;

/*TRANSLATE*/

export const stringFrom = (...strings) => reduce(concat, '', strings);
