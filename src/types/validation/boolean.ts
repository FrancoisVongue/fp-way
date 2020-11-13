import { Attempt, FALSE, Identity, InCase, Is, TRUE } from "../core";
import { TranslationError } from "../Errors";
import { Type } from "../transformation/string";

export const isTrue = Is(true);
export const isFalse = Is(false);
export const isBoolean = v => isTrue(v) || isFalse(v);

export const either = (a,b,v) => {
    return toBoolean(a(v)) || toBoolean(b(v));
};
export const both = (a,b,v) => {
    return toBoolean(a(v)) && toBoolean(b(v));
};
export const neither = (a,b,v) => {
    return !toBoolean(a(v)) && !toBoolean(b(v));
};

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

export const toBoolean = InCase([
    [isBoolean, Identity],
    [Attempt(booleanFromNumber, TRUE, FALSE), booleanFromNumber],
    [Attempt(booleanFromString, TRUE, FALSE), booleanFromString],
    [TRUE, (b) => {throw new TranslationError(typeof b, Type.Boolean, b)}],
]);
