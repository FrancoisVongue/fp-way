import {Curry} from "../core";

export const ToUpperCase = (s: string) => s.toUpperCase();
export const ToLowerCase = (s: string) => s.toLowerCase();
export const Split = (splitter, str) => (str as string).split(splitter);
export const Concat = (s1, s2) => s1 + s2;
export const Serialize = v => JSON.stringify(v);
export const OccurrencesOf = Curry((R: RegExp, str: string) => {
    const regex = R.global ? R : new RegExp(R as RegExp, 'g');
    return (str as string).match(regex);
});
