export function compose(fns) {
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
