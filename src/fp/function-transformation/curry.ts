import {
    Binary, Novenary, Octonary,
    Quaternary,
    Quinary,
    Senary,
    Septenary,
    Ternary,
    Unary
} from "../types/index";

interface Curried1<T1, R> {
    (): Curried1<T1, R>;
    (t1: T1): R;
}
interface Curried2<T1, T2, R> {
    (): Curried2<T1, T2, R>;
    (t1: T1): Curried1<T2, R>;
    (t1: T1, t2: T2): R;
}
interface Curried3<T1, T2, T3, R> {
    (): Curried3<T1, T2, T3, R>;
    (t1: T1): Curried2<T2, T3, R>;
    (t1: T1, t2: T2): Curried1<T3, R>;
    (t1: T1, t2: T2, t3: T3): R;
}
interface Curried4<T1, T2, T3, T4, R> {
    (): Curried4<T1, T2, T3, T4, R>;
    (t1: T1): Curried3<T2, T3, T4, R>;
    (t1: T1, t2: T2): Curried2<T3, T4, R>;
    (t1: T1, t2: T2, t3: T3): Curried1<T4, R>;
    (t1: T1, t2: T2, t3: T3, t4: T4): R;
}
interface Curried5<T1, T2, T3, T4, T5, R> {
    (): Curried5<T1, T2, T3, T4, T5, R>;
    (t1: T1): Curried4<T2, T3, T4, T5, R>;
    (t1: T1, t2: T2): Curried3<T3, T4, T5, R>;
    (t1: T1, t2: T2, t3: T3): Curried2<T4, T5, R>;
    (t1: T1, t2: T2, t3: T3, t4: T4): Curried1<T5, R>;
    (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): R;
}
interface Curried6<T1, T2, T3, T4, T5, T6, R> {
    (): Curried6<T1, T2, T3, T4, T5, T6, R>;
    (t1: T1): Curried5<T2, T3, T4, T5, T6, R>;
    (t1: T1, t2: T2): Curried4<T3, T4, T5, T6, R>;
    (t1: T1, t2: T2, t3: T3): Curried3<T4, T5, T6, R>;
    (t1: T1, t2: T2, t3: T3, t4: T4): Curried2<T5, T6, R>;
    (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): Curried1<T6, R>;
    (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): R;
}
interface Curried7<T1, T2, T3, T4, T5, T6, T7, R> {
    (): Curried7<T1, T2, T3, T4, T5, T6, T7, R>;
    (t1: T1): Curried6<T2, T3, T4, T5, T6, T7, R>;
    (t1: T1, t2: T2): Curried5<T3, T4, T5, T6, T7, R>;
    (t1: T1, t2: T2, t3: T3): Curried4<T4, T5, T6, T7, R>;
    (t1: T1, t2: T2, t3: T3, t4: T4): Curried3<T5, T6, T7, R>;
    (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): Curried2<T6, T7, R>;
    (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6): Curried1<T7, R>;
    (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7): R;
}
interface Curried8<T1, T2, T3, T4, T5, T6, T7, T8, R> {
    (): Curried8<T1, T2, T3, T4, T5, T6, T7, T8, R>;
    (t1: T1): Curried7<T2, T3, T4, T5, T6, T7, T8, R>;
    (t1: T1, t2: T2): Curried6<T3, T4, T5, T6, T7, T8, R>;
    (t1: T1, t2: T2, t3: T3): Curried5<T4, T5, T6, T7, T8, R>;
    (t1: T1, t2: T2, t3: T3, t4: T4): Curried4<T5, T6, T7, T8, R>;
    (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): Curried3<T6, T7, T8, R>;
    (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6): Curried2<T7, T8, R>;
    (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7): Curried1<T8, R>;
    (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8): R;
}
interface Curried9<T1, T2, T3, T4, T5, T6, T7, T8, T9, R> {
    (): Curried9<T1, T2, T3, T4, T5, T6, T7, T8, T9, R>
    (t1: T1): Curried8<T2, T3, T4, T5, T6, T7, T8, T9, R>;
    (t1: T1, t2: T2): Curried7<T3, T4, T5, T6, T7, T8, T9, R>;
    (t1: T1, t2: T2, t3: T3): Curried6<T4, T5, T6, T7, T8, T9, R>;
    (t1: T1, t2: T2, t3: T3, t4: T4): Curried5<T5, T6, T7, T8, T9, R>;
    (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): Curried4<T6, T7, T8, T9, R>;
    (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6): Curried3<T7, T8, T9, R>;
    (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7): Curried2<T8, T9, R>;
    (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8): Curried1<T9, R>;
    (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9): R;
}

export function softCurry<T1, R>(f: Unary<T1, R>): Curried1<T1, R>;
export function softCurry<T1, T2, R>(f: Binary<T1, T2, R>): Curried2<T1, T2, R>;
export function softCurry<T1, T2, T3, R>(f: Ternary<T1, T2, T3, R>): Curried3<T1, T2, T3, R>;
export function softCurry<T1, T2, T3, T4, R>(f: Quaternary<T1, T2, T3, T4, R>): Curried4<T1, T2, T3, T4, R>;
export function softCurry<T1, T2, T3, T4, T5, R>(f: Quinary<T1, T2, T3, T4, T5, R>): Curried5<T1, T2, T3, T4, T5, R>;
export function softCurry<T1, T2, T3, T4, T5, T6, R>(f: Senary<T1, T2, T3, T4, T5, T6, R>): Curried6<T1, T2, T3, T4, T5, T6, R>;
export function softCurry<T1, T2, T3, T4, T5, T6, T7, R>(f: Septenary<T1, T2, T3, T4, T5, T6, T7, R>): Curried7<T1, T2, T3, T4, T5, T6, T7, R>;
export function softCurry<T1, T2, T3, T4, T5, T6, T7, T8, R>(f: Octonary<T1, T2, T3, T4, T5, T6, T7, T8, R>): Curried8<T1, T2, T3, T4, T5, T6, T7, T8, R>;
export function softCurry<T1, T2, T3, T4, T5, T6, T7, T8, T9, R>(f: Novenary<T1, T2, T3, T4, T5, T6, T7, T8, T9, R>): Curried9<T1, T2, T3, T4, T5, T6, T7, T8, T9, R>;
export function softCurry (f: any) {
    let args = [];

    return function curried(...newArgs) {
        args = [...args, ...newArgs];

        if(args.length >= f.length)
            return f(...args);
        else
            return curried;
    }
}
