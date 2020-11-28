import {Compose, Curry, Is, Not} from "../core";
import {Gte} from "./number";
import {Both} from "./boolean";

export const IsString = s => typeof s === 'string';
export const IsStringOfLength = Curry((n: number, s: string) =>
    Both(IsString, s => s.length === n, s));

export const IsUpperCase = (s: string) => s.toUpperCase() === s;
export const IsLowerCase = (s: string) => s.toLowerCase() === s;
export const Test = Curry((regex: RegExp, str: string) => regex.test(str));
export const Matches = Test;
export const IndexOf = Curry((s: string, base: string) => base.indexOf(s));
export const LastIndexOf = Curry((s: string, base: string) => base.lastIndexOf(s));

export const StartsWith = Curry((start:string, str:string) =>
    (Compose as Compose<string, boolean>)
    ([Is(0), IndexOf(start)], str));

export const EndsWith = Curry((end:string, str:string) =>
    (Compose as Compose<string, boolean>)
    ([Both(
        Gte(0),
        Is(str.length - end.length)
    ), LastIndexOf(end)], str));

export const ContainsString = Curry((sub: string, str: string) =>
    (Compose as Compose<string, boolean>)
    ([Not(Is(-1)), IndexOf(sub)], str));

