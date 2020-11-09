export const Const = a => (b = null) => a;
export const Return = Const;
export const Variable = (a = null) => b => b;
export const Identity = Variable();
export const DoNothing = () => {};
export const Do = (f = DoNothing) => f();
export const Exists = a => !(a === null || a === undefined);

export const Skip = Return(Symbol.for("fp-way-skip"));
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


export const tap = curry((f, v) => (f(v), v)); // todo: move to function transformation?
export const attempt = curry((f, arg) => {
    try {
        f(arg);
        return true;
    } catch (e) {
        return false;
    }
});
export const is = curry((a, b) => a === b);
export const Swap = curry((f, a, b) => f(b, a));
export const applyTo = curry((arg, f) => f(arg));
export const call = curry((f, arg) => f(arg));

export const ifElse = curry((p, onSuccess, onFail, arg) =>
    p(arg) ? onSuccess(arg) : onFail(arg));
export const when = curry((p, f, arg) => p(arg) ? f(arg) : arg);
export const unless = curry((p, f, arg) => p(arg) ? arg : f(arg));
export const inCase = curry((entries, value) => {
    const getPredicate = entry => entry[0];
    const getFn = entry => entry[0];

    for(let entry of entries) {
        const predicate = getPredicate(entry);
        if(predicate(value)) {
            const fn = getFn(entry);
            return fn(value);
        }
    }
});

export const not = f => (...args) => !f(...args);
