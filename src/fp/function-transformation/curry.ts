export function curry (f, ...initialArgs) {
    return function curried(...newArgs) {
        if(initialArgs.length + newArgs.length >= f.length)
            return f(...initialArgs, ...newArgs);
        else
            return curry(f, ...initialArgs, ...newArgs);
    }
}
