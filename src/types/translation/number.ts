import {TranslationError, Type} from "../utility";
import {attempt, Const, FALSE, Identity, inCase, TRUE} from "../core";
import {isNumber} from "../validation/number";

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

export const toNumber = inCase([
    [isNumber, Identity],
    [attempt(numberFromBoolean, TRUE, FALSE), numberFromBoolean],
    [attempt(numberFromString, TRUE, FALSE), numberFromString],
    [Const(true), (n) => {throw new TranslationError(typeof n, Type.Number, n)}],
]);
