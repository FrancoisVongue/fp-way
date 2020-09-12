function Binary<T1, T2, R>(f: (...args: [T1, T2, ...any[]]) => R) {
    return (t1: T1, t2: T2) => f(t1, t2);
}
