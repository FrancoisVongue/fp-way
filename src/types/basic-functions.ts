export const Skip = () => Symbol.for("fp-way-skip");
/*
merges two arrays of arguments that may contain Skip() variable
* see docs for more information*/
export const skipMerge = (arr1, arr2) => {
    const resultOfMerge = [];

    const pushToResult = v => resultOfMerge.push(v);
    const isSkip = v => v === Skip();
    let arr2Cursor = 0;

    for (let i = 0; i < arr1.length; i++) {
        if (isSkip(arr1[i]) && arr2Cursor < arr2.length) {
            if (isSkip(arr2[arr2Cursor])) {
                pushToResult(Skip());
            } else {
                pushToResult(arr2[arr2Cursor]);
            }
            arr2Cursor++;
        } else {
            pushToResult(arr1[i]);
        }
    }
    if (arr2Cursor < arr2.length) {
        resultOfMerge.push(...arr2.slice(arr2Cursor));
    }

    return resultOfMerge;
}

export function curry(f, ...initialArgs) {
    return function curried(...newArgs) {
        const args = skipMerge(initialArgs, newArgs).slice(0, f.length);
        const containsSkip = args.includes(Skip());

        if (args.length >= f.length && !containsSkip)
            return f(...args);
        else
            return curry(f, ...args);
    }
}

export const doNothing = () => {};
export const identity = x => x;
export const Const = a => b => a;
export const Return = Const;
export const Variable = a => b => b;
export const tap = curry((f, v) => (f(v), v));

export const Swap = curry((f, a, b) => f(b, a));

export const applyTo = curry((arg, f) => f(arg));
export const applyTo_2 = curry((arg1, arg2, f) => f(arg1, arg2));
export const applyTo_3 = curry((arg1, arg2, arg3, f) => f(arg1, arg2, arg3));
export const call = curry((f, arg) => f(arg));
export const call_2 = curry((f, arg1, arg2) => f(arg1, arg2));
export const call_3 = curry((f, arg1, arg2, arg3) => f(arg1, arg2, arg3));
export const delayCall = curry((f, arg) => () => call(f, arg)); // todo : remove (no need, you have Return already)

export const ifElse = curry((p, onSuccess, onFail, arg) =>
    p(arg) ? onSuccess(arg) : onFail(arg));
export const when = curry((p, f, arg) => p(arg) ? f(arg) : arg);
export const unless = curry((p, f, arg) => p(arg) ? arg : f(arg));
export const is = curry((a, b) => a === b);
export const exists = a => !(a === null || a === undefined);

export function compose(fns) {
    return arg => {
        let currentArg = arg;
        for (let i = fns.length - 1; i >= 0; i--)
            currentArg = fns[i](currentArg);

        return currentArg;
    }
}
export function pipe(fns) {
    return arg => {
        let currentArg = arg;

        for (let i = 0; i < fns.length; i++)
            currentArg = fns[i](currentArg);

        return currentArg;
    }
}
export function spreadResult(fns, arg) {
    const resultArr = [];

    for (let i = 0; i < fns.length; i++) {
        resultArr.push(fns[i](arg));
    }

    return resultArr;
}
