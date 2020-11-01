export const Skip = () => Symbol.for("skip");
export const skipMerge = (arr1, arr2) => {
    const resultOfMerge = [];

    const pushToResult = v => resultOfMerge.push(v);
    const isSkip = v => v === Skip();
    let arr2Cursor = 0;

    for(let i = 0; i < arr1.length; i++) {
        if(isSkip(arr1[i]) && arr2Cursor < arr2.length) {
            if(isSkip(arr2[arr2Cursor])) {
                pushToResult(Skip());
            } else {
                pushToResult(arr2[arr2Cursor]);
            }
            arr2Cursor++;
        } else {
            pushToResult(arr1[i]);
        }
    }
    if(arr2Cursor < arr2.length)  {
        resultOfMerge.push(...arr2.slice(arr2Cursor));
    }

    return resultOfMerge;
}

export function curry (f, ...initialArgs) {
    return function curried(...newArgs) {
        const args = skipMerge(initialArgs, newArgs).slice(0, f.length);
        const containsSkip = args.includes(Skip());

        if(args.length >= f.length && !containsSkip)
            return f(...args);
        else
            return curry(f, ...args);
    }
}

export const toUnary = f => argsArr => f(...argsArr);

export const Unary = f => curry(a => f(a));

export const Binary = f => curry((a,b) => f(a,b));
export const memo = f => {
    const mapOfArgs = new Map();

    return arg => {
        if(!mapOfArgs.has(arg)) {
            let result = f(arg);
            mapOfArgs.set(arg, result);
        }
        return mapOfArgs.get(arg);
    };
}
export const tapWith = curry((f, arg) => (f(arg), arg));
export const tapBefore = curry
(
    (tapper, fn, arg) => {
        tapper(arg);
        return fn(arg);
    }
);
export const tapAfter = curry(
    (tapper, fn, arg) => {
        const result = fn(arg);
        tapper(result);
        return result;
    }
);
export const devourWith = curry(
    (devourer, fn, arg) => devourer(fn, arg)
);
