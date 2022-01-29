import {Curry, Is} from "../core";

export namespace bool {
    export const IsBool = v => Is(true) || Is(false);
    export const And = Curry((a: boolean, b: boolean) => a && b);
    export const Or = Curry((a: boolean, b: boolean) => a || b);
    export const Not = Curry((a: boolean) => !a);
}