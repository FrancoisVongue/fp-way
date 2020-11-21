import {Curry, Is} from "../core";
import {Predicate} from "../core.types";

export const IsTrue = Is(true);
export const IsFalse = Is(false);
export const IsBoolean = v => IsTrue(v) || IsFalse(v);

export const Either = Curry((
    p1: Predicate<any>,
    p2: Predicate<any>,
    v: any
): boolean => p1(v) || p2(v));

export const Both = Curry((
    p1: Predicate<any>,
    p2: Predicate<any>,
    v: any
): boolean => p1(v) && p2(v));

export const Neither = Curry((
    p1: Predicate<any>,
    p2: Predicate<any>,
    v: any
): boolean => !p1(v) && !p2(v));
