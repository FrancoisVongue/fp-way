import {Entries, Entry, Predicate, Skip, skipMerge, Unary} from "./utility";

type TIdentity = <T1>(v: any) => T1
export const Identity: TIdentity = v => v;
type TConst = <T1>(v: T1) => (a?: any) => T1
export const Const: TConst = v => (a?) => v;
export const Return = Const;
export const TRUE = Const(true);
export const FALSE = Const(false);
type TVariable = (a?: any) => <T1>(v: T1) => T1
export const Variable: TVariable = (a?) => v => v;
type TDoNothing = () => void
export const DoNothing: TDoNothing = () => {};
type TExists = (a: any) => boolean
export const Exists: TExists = a => !(a === null || a === undefined);
type TSwap = <T1, T2, R>(f: (T1, T2) => R) => (a: T2, b: T1) => R
export const Swap: TSwap = (f) =>  (a, b) => f(b,a);

type TCurry = <T1, R>(f: (...args: T1[]) => R) => ((...args: T1[]) => R)
export const curry: TCurry = function _curry(f, ...initialArgs) {
    return function curried(...newArgs) {
        const args = skipMerge(initialArgs, newArgs).slice(0, f.length);
        const containsSkip = args.includes(Skip());

        if (args.length >= f.length && !containsSkip)
            return f(...args);
        else
            return (_curry as any)(f, ...args);
    }
}

export const is = a => b => a === b;
type TApplyTo = <T1, R>(a: T1) => (f: (a: T1) => R) => R
export const applyTo: TApplyTo = (a) => f => f(a);

type TCall = <T1, R>(f: (a: T1) => R) => (a: T1) => R
export const call: TCall = f => a => f(a);

type TIfElse = <T1, R1, R2>(p: Predicate<[T1]>, T: Unary<T1, R1>, F: Unary<T1, R2>) => (arg: T1) => R1 | R2
export const ifElse: TIfElse = (p, onSuccess, onFail) => arg => p(arg) ? onSuccess(arg) : onFail(arg);

type TWhen = <T1, R1>(p: Predicate<[T1]>, T: Unary<T1, R1>) => (arg: T1) => T1 | R1
export const when: TWhen = (p, f) => arg => p(arg) ? f(arg) : arg;

type TUnless = <T1, R1>(p: Predicate<[T1]>, T: Unary<T1, R1>) => (arg: T1) => T1 | R1
export const unless: TUnless = (p, f) => arg => p(arg) ? arg : f(arg);

type TInCase = <T1, R>(entries: Entries<Predicate<[T1]>, Unary<T1, R>>) => (arg: T1) => R
export const inCase: TInCase = entries => value => {
    for(let entry of entries) {
        const predicate = entry[0];
        const fn = entry[1];
        if(predicate(value)) {
            return fn(value);
        }
    }
};

type TAttempt = <R, SR, ER>(f: (...args: any[]) => R, onSuccess: (arg: R) => SR, onError: (arg: R) => ER) => (arg: R) => SR | ER
export const attempt: TAttempt = (f, onSuccess, onError) => arg => {
    try {
        return onSuccess(f(arg));
    } catch(e) {
        return onError(e);
    }
}

type TNot = <T1>(p: Predicate<T1[]>) => Predicate<T1[]>
export const not: TNot = f => (...args) => !f(...args);

type TCompose = (fns: Function[]) => any
export const compose: TCompose = (fns) => {
    return (...args) => {
        let currentArg = args;
        let firstCall = true;

        for (let i = fns.length - 1; i >= 0; i--) {
            if(firstCall) {
                currentArg = fns[i](...currentArg); // first call may have multiple args
                firstCall = false;
            } else {
                currentArg = fns[i](currentArg);
            }
        }

        return currentArg;
    }
}

export const pipe = (fns) => compose([...fns].reverse());
// todo: create fn from 1. context 2. function 3. args

type TCreateFn = <R>(f: (...args: any[]) => R, argsArr: any[], ctx?: any) => () => R
export const createFn: TCreateFn = (fn, argsArr, ctx = null) => () => {
    const boundFN = fn.bind(ctx);
    return boundFN(...argsArr);
}

type TMemo = <T1>(f: Unary<T1, any>) => Unary<T1, any>
export const memo: TMemo = f => {
    const mapOfArgs = new Map();

    return arg => {
        if (!mapOfArgs.has(arg)) {
            let result = f(arg);
            mapOfArgs.set(arg, result);
        }
        return mapOfArgs.get(arg);
    };
}

type TTapWith = <T1>(f: (arg: T1) => any) => (arg: T1) => T1
export const tapWith: TTapWith = f => arg => (f(arg), arg);

type changerApi<T1, R> = {
    hookBefore?: Unary<T1, R>,
    hookAfter?: Unary<T1, R>,
    guard?: Predicate<[T1]>,
}
type TChangeWithHooks = <T1, R>(obj: changerApi<T1, R>, f: Unary<T1, R>) => (arg: T1) => R | null
export const changeWithHooks: TChangeWithHooks = (obj, fn) => arg => {
    if(obj.guard ? obj.guard(arg) : false) {
        return compose([obj.hookAfter ?? Identity, fn, obj.hookBefore ?? Identity])(arg);
    } 
    return null;
}

type TPassToFunctions = <T1, R>(fns: Unary<T1, R>[]) => (arg: T1) => R[]
export const passToFunctions: TPassToFunctions = fns => arg => { 
    const resultArr = [];

    for (let i = 0; i < fns.length; i++) {
        resultArr.push(fns[i](arg));
    }

    return resultArr;
}

export const allPass = (fns) => (arg) => fns.every(f => f(arg));
export const eitherPass = (fns) => (arg) => fns.some(f => f(arg));
export const neitherPass = (fns) => (arg) => not(eitherPass(fns)(arg));
