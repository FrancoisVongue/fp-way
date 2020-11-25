import {Curry, Is} from "../core";
import {Curried, Predicate} from "../core.types";

export type TEither<T1> = (p1: Predicate<T1>, p2: Predicate<T1>, arg: T1) => boolean
export type Either<T1> = Curried<TEither<T1>>
export const Either = Curry((
    p1: Predicate<any>,
    p2: Predicate<any>,
    v: any
): boolean => p1(v) || p2(v));

export type TBoth<T1> = TEither<T1>
export type Both<T1> = Curried<TBoth<T1>>
export const Both = Curry((
    p1: Predicate<any>,
    p2: Predicate<any>,
    v: any
): boolean => p1(v) && p2(v));

export type TNeither<T1> = TEither<T1>
export type Neither<T1> = Curried<TNeither<T1>>
export const Neither = Curry((
    p1: Predicate<any>,
    p2: Predicate<any>,
    v: any
): boolean => !p1(v) && !p2(v));

export const IsTrue = Is(true);
export const IsFalse = Is(false);
export const IsBoolean = Either(IsTrue, IsFalse);

