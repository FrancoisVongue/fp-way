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
    return ToBoolean(a(v)) || ToBoolean(b(v));
};
export const Both = (a, b, v) => {
    return ToBoolean(a(v)) && ToBoolean(b(v));
};
export const Neither = (a,b,v) => {
    return !ToBoolean(a(v)) && !ToBoolean(b(v));
};

const IsNumber = n => (typeof n === 'number');
const IsString = n => (typeof n === 'string');
const Gt = (a: number) => b => b > a;
export const ToBoolean = InCase([
    [IsBoolean, Identity],
    [IsNumber, IfElse(Gt(0), TRUE, FALSE)],
    [IsString, InCase([
        [Is('true'), TRUE],
        [Is('false'), FALSE],
        [TRUE, (v) => {throw new TranslationError('string', 'boolean', v)}],
    ])],
    [TRUE, (v) => {throw new TranslationError('string', 'boolean', v)}]
]);
