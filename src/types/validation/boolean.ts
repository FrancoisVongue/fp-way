import {attempt, Const, curry, Identity, inCase, is} from "../..";
import {TranslationError, Type} from "../utility";
import {booleanFromNumber, booleanFromString, toBoolean} from "../translation/boolean";

export const isTrue = is(true);
export const isFalse = is(false);
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
