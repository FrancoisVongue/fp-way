import {reduce} from "./array";
import {curry} from "../function-transformation/curry";

/*VALIDATE*/
export const test = curry((regex, string) => (regex as RegExp).test(string));

/*TRANSFORM*/
export const split = curry((splitter, str) => (str as string).split(splitter));
export const occurrencesOf = curry((unvalidatedRegex, str) => {
    const regex = new RegExp(unvalidatedRegex as RegExp, 'g');
    return (str as string).match(regex);
});
export const concat = curry((s1, s2) => s1 + s2);

/*TRANSLATE*/

export const stringFrom = curry((...strings) => reduce(concat, '', strings));
