export const all = (fns: Function[], arg) => fns.every(f => f(arg));
export const either = (fns: Function[], arg) => fns.some(f => f(arg))
export const neither = (fns: Function[], arg) => !fns.every(f => f(arg))
