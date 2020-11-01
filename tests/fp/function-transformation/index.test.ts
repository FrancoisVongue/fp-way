import {
    Binary,
    curry,
    memo,
    Skip,
    skipMerge
} from "../../../src/function-transformation/index";

describe('skipMerge', () => {
    it('should skip elements of an array marked as Skip()', () =>{
        let argList1 = [1, Skip(), 3];
        let argList2 = [Skip(), 2];
        const result = skipMerge(argList1, argList2);

        expect(result).toEqual([1, Skip(), 3, 2]);
    })
    it('should skip elements of an array marked as Skip()', () =>{
        let argList1 = [Skip(), Skip(), 3];
        let argList2 = [Skip(), Skip(), 2];
        const result = skipMerge(argList1, argList2);

        expect(result).toEqual([Skip(), Skip(), 3, 2]);
    })
    it('should skip elements of an array marked as Skip()', () =>{
        let argList1 = [3, Skip()];
        let argList2 = [2, 2];
        const result = skipMerge(argList1, argList2);

        expect(result).toEqual([3, 2, 2]);
    })
    it('should skip elements of an array marked as Skip()', () =>{
        let argList1 = [Skip(), Skip()];
        let argList2 = [2, 2];
        const result = skipMerge(argList1, argList2);

        expect(result).toEqual([2, 2]);
    })
    it('should skip elements of an array marked as Skip()', () =>{
        let argList1 = [];
        let argList2 = [2, Skip(), 2];
        const result = skipMerge(argList1, argList2);

        expect(result).toEqual([2, Skip(), 2]);
    })
})
describe('curry', () => {
    it('Should call function when all arguments provided at a time', () => {
        let addFn = (a: number, b:number) => a + b;
        let curriedAddFn = curry(addFn);
        const result = curriedAddFn(2, 2);
        expect(result).toBe(4);
    });
    it('Should return a function when not enough arguments were specified', () => {
        let addFn = (a: number, b:number) => a + b;
        let curriedAddFn = curry(addFn);
        const result = curriedAddFn(1);
        expect(result).toBeInstanceOf(Function);
    })
    it('Should work with different types', () => {
        let addFn = (a, b: string): string => a + b;
        let curriedAddFn = curry(addFn);
        const result = curriedAddFn(1, '2');
        expect(result).toBe('12');
    });
})
describe('binary', () => {
    it('should make function accept only two arguments and no more', () => {
        const add = (...numbers) => numbers.reduce((b, v) => b + v, 0);
        const addBinary = Binary(add);
        const args = [2,2,2,2];

        const resultFromNonBinary = add(...args);
        const result = addBinary(...args);

        expect(result).toBeLessThan(resultFromNonBinary);
        expect(result).toEqual(4);
    })
})
describe('memo', () => {
    it('should cache returns from a unary function', () => {
        const mock = jest.fn();
        const add2AndCallMock = x => {
            mock();
            return x + 2;
        }

        const memoAdd2 = memo(add2AndCallMock);
        for(let i = 0; i < 10; i++) {
            memoAdd2(2);
        }

        expect(mock).toBeCalledTimes(1);
    })
})
