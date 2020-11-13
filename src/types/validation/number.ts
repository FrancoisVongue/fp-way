import { Attempt, Curry, FALSE, Identity, InCase, TRUE } from "../..";
import { TranslationError } from "../Errors";
import { Type } from "../transformation/string";
import {both} from "./boolean";

export const isNumber = n => typeof n === 'number' && !isNaN(n);
export const isInt = n => isNumber(n) && n%1 === 0;
export const isFiniteNumber = n => isNumber(n) && n !== Infinity && n !== -Infinity;

export const Gt = Curry((n1, n2) => {
    return toNumber(n2) > toNumber(n1);
});
export const Gte = Curry((n1, n2) => {
    return toNumber(n2) >= toNumber(n1);
});
export const Lt = Curry((n1, n2) => {
    return toNumber(n2) < toNumber(n1);
});
export const Lte = Curry((n1, n2) => {
    return toNumber(n2) <= toNumber(n1);
});

export const IsInRange = Curry((n1, n2, n) => {
    return both(Gte(n1), Lte(n2), n);
});
export const IsPositive = Gt(0);
export const IsNegative = Lt(0);

export const numberFromBoolean = b => {
    if(typeof b === "boolean") {
        if(b === true) {
            return 1;
        } else if(b === false) {
            return 0;
        }
    } else {
        throw new TranslationError(Type.Boolean, Type.Number, b);
    }
}
export const numberFromString = s => {
    const isString = typeof s === "string";
    const parsedNumber = isString ? parseFloat(s) : NaN;
    
    if (!isNaN(parsedNumber)){
        return parsedNumber;
    } else {
        throw new TranslationError(Type.Boolean, Type.Number, s);
    }
}

export const toNumber = InCase([
    [isNumber, Identity],
    [Attempt(numberFromBoolean, TRUE, FALSE), numberFromBoolean],
    [Attempt(numberFromString, TRUE, FALSE), numberFromString],
    [TRUE, (n) => {throw new TranslationError(typeof n, Type.Number, n)}],
]);