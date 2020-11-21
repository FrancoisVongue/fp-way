import {
    Curry,
} from "../core";
import {Both} from "./boolean";

export const IsNumber = n => typeof n === 'number' && !isNaN(n);
export const IsInt = n => IsNumber(n) && n%1 === 0;

export const Gt = Curry((n1, n2) => {
    return (n2) > (n1);
});
export const Gte = Curry((n1, n2) => {
    return (n2) >= (n1);
});
export const Lt = Curry((n1, n2) => {
    return (n2) < (n1);
});
export const Lte = Curry((n1, n2) => {
    return (n2) <= (n1);
});

export const IsInRange = Curry((n1, n2, n) => {
    return Both(Gte(n1), Lte(n2), n);
});
export const IsPositive = Gt(0);
export const IsNegative = Lt(0);

export const ParseFloat = n => Number.parseFloat(n);
export const IsNaN = n => Number.isNaN(n);
export const ToInteger = (n: number):number => ~~n;
