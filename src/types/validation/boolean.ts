import {
    Attempt,
    Compose,
    FALSE,
    Identity,
    IfElse,
    InCase,
    Is,
    TapWith,
    TRUE
} from "../core";
import { TranslationError } from "../Errors";

export const IsTrue = Is(true);
export const IsFalse = Is(false);
export const IsBoolean = v => IsTrue(v) || IsFalse(v);

export const Either = (a,b,v) => {
    return a(v) ||b(v);
};
export const Both = (a, b, v) => {
    return a(v) && b(v);
};
export const Neither = (a,b,v) => {
    return !a(v) && !b(v);
};
