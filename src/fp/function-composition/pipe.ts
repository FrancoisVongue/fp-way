export function pipe(fns) {
    return (...args) => {
        let firstFn = true;
        let firstArgs = args;
        let currentArg = null;

        for(let i = 0; i < fns.length; i++) {
            if(firstFn) {
                currentArg = fns[i](...firstArgs);
                firstFn = false;
            } else {
                currentArg = fns[i](currentArg);
            }
        }

        return currentArg;
    }
}
