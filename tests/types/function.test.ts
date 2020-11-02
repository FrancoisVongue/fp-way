import {Binary, memo} from "../../src";

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
