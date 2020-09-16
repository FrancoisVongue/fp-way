export function compose(fns) {
    return (...args) => {
        let firstFn = true;
        let firstArgs = args;
        let currentArg = null;

        for(let i = fns.length - 1; i >= 0; i--) {
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
