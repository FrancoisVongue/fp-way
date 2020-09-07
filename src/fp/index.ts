import {softCurry} from './function-transformation/curry'

const concat5 = (a: number, b: string, c: string, d: number, e: number): string => a + b + c + d + e;
const concat5Curry = softCurry(concat5);
let what: string = concat5Curry(5)('a', 'b')(11, 12);

export {
    softCurry
}
