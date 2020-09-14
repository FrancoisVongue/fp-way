function Unary<T1, R>(f: (...args: [T1, ...any[]]) => R) {
    return (single: T1): R => f(single);
}
