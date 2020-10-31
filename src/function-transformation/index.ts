export function curry (f, ...initialArgs) {
    return function curried(...newArgs) {
        if(initialArgs.length + newArgs.length >= f.length)
            return f(...initialArgs, ...newArgs);
        else
            return curry(f, ...initialArgs, ...newArgs);
    }
}
/*makes multivariable function take all arguments as an array*/
export const toUnary = f => argsArr => f(...argsArr);

/*forces function to take only one argument*/
export const Unary = f => curry(a => f(a));

/*forces function to take only two arguments*/
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
export const devour = curry(
    (devourer, fn, arg) => devourer(fn, arg)
);
