export const all = (fns, arg) => fns.every(f => f(arg));
export const either = (fns, arg) => fns.some(f => f(arg))
export const neither = (fns, arg) => !fns.every(f => f(arg))
