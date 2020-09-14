import {softCurry} from "../../../src/fp/function-transformation/curry";

describe('softCurry', () => {
    it('Should call function when all arguments provided at a time', () => {
        let addFn = (a: number, b:number) => a + b;
        let curriedAddFn = softCurry(addFn);
        const result = curriedAddFn(2, 2);
        expect(result).toBe(4);
    });
    it('Should return a function when not enough arguments were specified', () => {
        let addFn = (a: number, b:number) => a + b;
        let curriedAddFn = softCurry(addFn);
        const result = curriedAddFn(1);
        expect(result).toBeInstanceOf(Function);
    })
    it('Should work with different types', () => {
        let addFn = (a, b: string): string => a + b;
        let curriedAddFn = softCurry(addFn);
        const result = curriedAddFn(1, '2');
        expect(result).toBe('12');
    });
})
