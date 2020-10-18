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
