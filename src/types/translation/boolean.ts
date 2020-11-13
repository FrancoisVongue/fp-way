import {TranslationError, Type} from "../utility";
import {attempt, Const, FALSE, TRUE, Identity, inCase} from "../core";
import {isBoolean} from "../validation/boolean";

export const booleanFromString = s => {
    if (s === 'true') {
        return true;
    } else if (s === 'false') {
        return false;
    } else {
        throw new TranslationError(Type.String, Type.Boolean, s);
    }
}
export const booleanFromNumber = n => {
    if(n > 0) {
        return true;
    } else if (n <= 0) {
        return false;
    } else {
        throw new TranslationError(Type.Number, Type.Boolean, n);
    }
}

export const toBoolean = inCase([
    [isBoolean, Identity],
    [attempt(booleanFromNumber, TRUE, FALSE), booleanFromNumber],
    [attempt(booleanFromString, TRUE, FALSE), booleanFromString],
    [TRUE, (b) => {throw new TranslationError(typeof b, Type.Boolean, b)}],
]);
