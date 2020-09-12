function Ternary<T1, T2, T3, R>(f: (...args: [T1, T2, T3, ...any[]]) => R) {
    return (t1: T1, t2: T2, t3: T3) => f(t1, t2, t3);
}
