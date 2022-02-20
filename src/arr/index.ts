import {Curry, Not,} from "../core";
import {Binary, Predicate, Ternary, Unary} from "../core.types";
import {num} from "../num";

export namespace arr {
    // create
    export const OfValues = <T>(...v: T[]) => [...v];
    export const OfLength = Curry((n: number) => Array(n).fill(null));
    export const FromRange = Curry((
        start: number,
        finish: number,
        step: number
    ): number[] => {
        if(start >= finish || step <= 0) {
            throw Error(`Invalid input to FromRange: start:${start} finish:${finish} step:${step}`)
        } if (!num.IsQuotientOf(1, step)) {
            throw Error(`Invalid input to FromRange: step must be integer`)
        }

        const result: number[] = []

        let current = start;
        while(current <= finish) {
            result.push(current)
            current += step;
        }

        return result
    });

    // transform
    export const Select: {
        <T1>(
            p: Predicate,
            arr: T1[]
        ): T1[]
        <T1>(
            p: Predicate,
        ): Unary<T1[], T1[]>
    } = Curry((p: Predicate, arr: any[]) => arr.filter(p));
    export const Exclude: {
        <T1>(
            p: Predicate,
            arr: T1[]
        ): T1[]
        <T1>(
            p: Predicate,
        ): Unary<T1[], T1[]>
    } = Curry((p: Predicate, arr: any[]) => arr.filter(Not(p)));
    export const MapArr: {
        <T1, T2>(
            f: Unary<T1, T2>,
            arr: T1[]
        ): T2[]

        <T1, T2>(
            f: Unary<T1, T2>,
        ): Unary<T1[], T2[]>
    } = Curry((f, arr) => arr.map(f));
    export const Reduce: {
        <T1, R>(
            reducer: Ternary<R, T1, T1[], R>,
            base: R,
            arr: T1[]
        ): R
        <T1, R>(
            reducer: Ternary<R, T1, T1[], R>,
            base: R,
        ): Unary<T1[], R>
        <T1, R>(
            reducer: Ternary<R, T1, T1[], R>,
        ): Binary<R, T1[], R>
    } = Curry((reducer, base, arr) => arr.reduce(reducer, base));
    export const ConcatTo: {
        <T1>(
            arr: T1[],
            arr2: T1[],
        ): T1[]
        <T1>(
            arr: T1[],
        ): Unary<T1[], T1[]>
    } = Curry((arr, arrOfValues) => arr.push(...arrOfValues));
    export const Tail = (arr) => arr.length > 1
        ? arr.slice(1)
        : [...arr];
    export const Nose = (arr) => arr.length > 1 ? arr.slice(0, arr.length - 1) : [...arr];
    export const Head = <T1>(arr: T1[]): T1 | undefined => arr[0];
    export const Butt = <T1>(arr: T1[]): T1 | undefined => arr.length >= 1
        ? arr[arr.length - 1]
        : arr[0]
    export const TakeNFirst = Curry((n, arr) => arr.length < n
        ? [...arr]
        : arr.slice(0, n));
    export const TakeNLast = Curry((n, arr) => arr.length < n
        ? [...arr]
        : arr.slice(-n));
    export const Append = Curry((value: any, arr: any[]) => [...arr, value]);
    export const Prepend = Curry((value: any, arr: any[]) => [value, ...arr]);
    export const Flatten = function Flatten<T1>(arr: any[]): T1[] {
        const result: any[] = [];

        for(const v of arr) {
            if (Array.isArray(v)) {
                const flattenedArray = Flatten(v);
                result.push(...flattenedArray);
            } else {
                result.push(v);
            }
        }
        return result;
    }
    export const Intersection: {
        <T1>(
            arr1: T1[],
            arr2: T1[],
        ): T1[]
        <T1>(
            arr1: T1[],
        ): Unary<T1[], T1[]>
    } = Curry((arr1: any[], arr2: any[]) => {
        const [smallerArr, biggerArr] = arr1.length > arr2.length
            ? [arr2, arr1]
            : [arr1, arr2];

        const smallSet = new Set(smallerArr);
        return biggerArr.filter(v => smallSet.has(v));
    })
    export const Subtract: {
        <T1>(
            arr1: T1[],
            arr2: T1[],
        ): T1[]
        <T1>(
            arr1: T1[],
        ): Unary<T1[], T1[]>
    } = Curry((deduction, source) => {
        const dedSet = new Set(deduction);
        return source.filter(v => !dedSet.has(v));
    })

    // validate
    export const IsArray = (arr: any[]) => Array.isArray(arr);
    export const AllElementsAre = Curry((
        p: Predicate,
        arr: any[]
    ): boolean => arr.every(p));
    export const SomeElementsAre =  Curry((
        p: Predicate,
        arr: any[]
    ): boolean => arr.some(p));
    export const NoElementIs =  Curry((
        p: Predicate,
        arr: any[]
    ): boolean => !arr.some(p));
    export const ContainedIn: {
        <T1>(
            arr: T1[],
            v: T1
        ): boolean
        <T1>(
            arr: T1[],
        ): Unary<T1, boolean>
    } = Curry((arr: any[], v) => arr.includes(v))
    export const Contains: {
        <T1>(
            v: T1,
            arr: T1[],
        ): boolean
        <T1>(
            v: T1,
        ): Unary<T1[], boolean>
    } = Curry((v, arr: any[]) => arr.includes(v))
    export const IsSupersetOf: {
        <T1>(
            sub: T1[],
            sup: T1[],
        ): boolean
        <T1>(
            sub: T1[],
        ): Unary<T1[], boolean>
    } = Curry((sub: any[], sup: any[]) => {
        const supSet = new Set(sup);
        return sub.every(subel => supSet.has(subel));
    });
    export const IsSubsetOf: {
        <T1>(
            sup: T1[],
            sub: T1[],
        ): boolean
        <T1>(
            sup: T1[],
        ): Unary<T1[], boolean>
    } = Curry((sup: any[], sub: any[]) => {
        const supSet = new Set(sup);
        return sub.every(subel => supSet.has(subel));
    });
    export const EqualsArray =  Curry((arr: any[], arrUnderTest: any[]): boolean => {
        if(arr.length !== arrUnderTest.length) {
            return false
        } else {
            const set = new Set(arr);
            return arrUnderTest.every(v => set.has(v));
        }
    });
    export const IsUnique = (arr: any[]) => {
        const arrSet = new Set(arr);
        return arrSet.size === arr.length;
    }
}