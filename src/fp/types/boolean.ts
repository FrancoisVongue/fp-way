import {curry} from "../function-transformation/curry";

const allPass = (fns, arg) => fns.every(f => f(arg));
const eitherPass = (fns, arg) => fns.some(f => f(arg))
const neitherPass = (fns, arg) => !fns.some(f => f(arg))
const not = f => (v) => !f(v);
const and = (p1, p2, v) => p1(v) && p2(v);
const or = (p1, p2, v) => p1(v) || p2(v);


const curriedAllPass = curry(allPass);
const curriedEither = curry(eitherPass);
const curriedNeither = curry(neitherPass);
const curriedNot = curry(not);
const curriedAnd = curry(and);
const curriedOr = curry(or);


export {
    curriedAllPass as all,
    curriedEither as either,
    curriedNeither as neither,
    curriedNot as not,
    curriedAnd as and,
    curriedOr as or
}
