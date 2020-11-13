export const Identity = v => v;
export const Const = v => () => v;
export const Return = Const;
export const TRUE = Const(true);
export const FALSE = Const(false);
export const Variable = () => v => v;
export const DoNothing = () => {};
export const Exists = a => !(a === null || a === undefined);
export const Swap = (f) => Curry((a, b) => f(b,a));

export const Not = f => (...args) => !f(...args);
export const Compose = (fns) => arg => fns.reduce((b, f) => f(b), arg);
export const Pipe = (fns) => Compose([...fns].reverse());
export const CreateFn = (fn, argsArr, ctx = null) => () => fn.bind(ctx)(argsArr);

export function Curry(f, ...initialArgs) {
    return function curried(...newArgs) {
        const args = [...initialArgs, ...newArgs];

        if (args.length >= f.length)
            return f(...args);
        else
            return (Curry as any)(f, ...args);
    }
}

export const Is = Curry((a, b) => a === b);
export const ApplyTo = Curry((a, f) => f(a));
export const Call = Curry((f, a) => f(a));
export const IfElse = Curry((p, onSuccess, onFail, arg) => p(arg) ? onSuccess(arg) : onFail(arg));
export const When = Curry((p, f, arg) => p(arg) ? f(arg) : arg);
export const Unless = Curry((p, f, arg) => p(arg) ? arg : f(arg));
export const AllPass = Curry((fns, arg) => fns.every(f => f(arg)));
export const EitherPass = Curry((fns, arg) => fns.some(f => f(arg)));
export const NeitherPass = Curry((fns, arg) => Not(EitherPass(fns))(arg));
/**
 * @param entries = [predicate, functionToCall]
 * @param value = value to check
 */
export const InCase = Curry((entries, value) => {
    for(let entry of entries) {
        const predicate = entry[0];
        const fn = entry[1];
        if(predicate(value)) {
            return fn(value);
        }
    }
});

export const Attempt = Curry((f, onSuccess, onError) => arg => {
    try {
        return onSuccess(f(arg));
    } catch(e) {
        return onError(e);
    }
});

export const TapWith = f => arg => (f(arg), arg);
export const ChangeWithHooks = (obj, fn) => arg => {
    if(obj.guard && obj.guard(arg)) {
        return Compose([obj.hookAfter ?? Identity, fn, obj.hookBefore ?? Identity])(arg);
    } 
    return null;
}
export const PassToFunctions = fns => arg => { 
    const resultArr = [];

    for (let i = 0; i < fns.length; i++) {
        resultArr.push(fns[i](arg));
    }

    return resultArr;
}