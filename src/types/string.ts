import {reduce} from "./array";
import {curry} from "./basic-functions";

/*TRANSFORM*/
export const split = curry((splitter, str) => (str as string).split(splitter));
export const occurrencesOf = curry((unvalidatedRegex, str) => {
    const regex = new RegExp(unvalidatedRegex as RegExp, 'g');
    return (str as string).match(regex);
});
export const concat = curry((s1, s2) => s1 + s2); // todo: change to concatStringTo

/*TRANSLATE*/

export const stringFrom = curry((...strings) => reduce(concat, '', strings));
