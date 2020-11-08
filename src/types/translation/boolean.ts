import {TranslationError, Type} from "../utility";
import {attempt, Const, Identity, inCase} from "../basic-functions";
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
    [attempt(booleanFromNumber), booleanFromNumber],
    [attempt(booleanFromString), booleanFromString],
    [Const(true), (b) => {throw new TranslationError(typeof b, Type.Boolean, b)}],
]);
