import {
    Curry, IfElse, InCase, Return,
} from "../core";
import {Both} from "./boolean";
import {Curried} from "../core.types";

export const IsNumber = n => typeof n === 'number' && !isNaN(n);
export const IsInt = n => IsNumber(n) && n%1 === 0;

export type TGt = (arg: number, target: number) => boolean;
export type Gt = Curried<TGt>
export const Gt = Curry((n1, n2) => n2 > n1 );

export type Gte = Gt
export const Gte: Gte = Curry((n1, n2) => n2 >= n1 );

export type Lt = Gt
export const Lt: Lt = Curry((n1, n2) => n2 < n1 );

export type Lte = Gt
export const Lte: Lte = Curry((n1, n2) => n2 <= n1 );

export type TIsPositive = (arg: number) => boolean;
export const IsPositive: TIsPositive = Gt(0);

export type TIsNegative = (arg: number) => boolean;
export const IsNegative: TIsNegative = Lt(0);

export type TIsInRange = (start: number, end: number, target: number) => boolean
export type IsInRange = Curried<TIsInRange>
export const IsInRange: IsInRange = Curry((n1, n2, n) => Both(Gte(n1), Lte(n2), n) );

export const ParseInt = (s: string) => Number.parseInt(s);
export const ParseFloat = (s: string) => Number.parseFloat(s);
export const Floor = (n: number) => Math.floor(n);
export const Ceil= (n: number) => Math.ceil(n);
export const IsNaN = n => Number.isNaN(n);
export const NumberToInt = (InCase as InCase<number, number>)([
        [IsPositive, Floor],
        [IsNegative, Ceil],
    ]);
