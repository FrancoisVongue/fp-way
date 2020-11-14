import {
    Attempt,
    Compose,
    Curry,
    FALSE,
    Identity,
    IfElse,
    InCase,
    Is,
    Return,
    TRUE
} from "../core";
import { TranslationError } from "../Errors";
import {both, IsBoolean} from "./boolean";
import {NegateBool} from "../transformation/boolean";

export const IsNumber = n => typeof n === 'number' && !isNaN(n);
export const isInt = n => IsNumber(n) && n%1 === 0;
export const isFiniteNumber = n => IsNumber(n) && n !== Infinity && n !== -Infinity;

export const Gt = Curry((n1, n2) => {
    return ToNumber(n2) > ToNumber(n1);
});
export const Gte = Curry((n1, n2) => {
    return ToNumber(n2) >= ToNumber(n1);
});
export const Lt = Curry((n1, n2) => {
    return ToNumber(n2) < ToNumber(n1);
});
export const Lte = Curry((n1, n2) => {
    return ToNumber(n2) <= ToNumber(n1);
});

export const IsInRange = Curry((n1, n2, n) => {
    return both(Gte(n1), Lte(n2), n);
});
export const IsPositive = Gt(0);
export const IsNegative = Lt(0);

export const ParseFloat = n => Number.parseFloat(n);
export const IsNaN = n => Number.isNaN(n);
export const ToInteger = n => {
    const number = ToNumber(n);
    return number - number % 1;
}
const IsString = s => (typeof s === 'string');
export const ToNumber = InCase([
    [IsNumber, Identity],
    [IsBoolean, IfElse(Identity, Return(1), Return(0))],
    [IsString, InCase([
        [Compose([NegateBool, IsNaN, ParseFloat]), ParseFloat],
        [TRUE, (v) => {throw new TranslationError('string', 'number', v)}]
    ])],
    [TRUE, (v) => {throw new TranslationError('string', 'number', v)}]
]);
