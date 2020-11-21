import {ArrayOf, ArrayOfLength, ArrayOfRange} from "./array";

describe('ArrayOf', () => {
    it('should create an array of specified arguments', () => {
        const args = [1, 2, 5];
        const result = ArrayOf(...args);

        expect(result).toEqual(expect.arrayContaining([1,2,5]));
    })
})
describe('ArrayOfLength', () => {
    it('should create an array of specified length', () => {
        const desiredLength = 17;
        const result = ArrayOfLength(desiredLength);

        expect(result.length).toBe(desiredLength);
    });
    it('should fill array with specified values', () => {
        const desiredLength = 17;
        const result = ArrayOfLength(desiredLength, 0);

        expect(result).toEqual(expect.arrayContaining([0,0,0,0,0,0]));
    });
})
describe('ArrayOfRange', () => {
    it('should create an array of specified range', () => {
        const start = 5;
        const finish = 13;
        const desiredLength = 13 - 5 + 1;

        const range = [start, finish];
        const result = ArrayOfRange(range[0], range[1]);

        expect(result.length).toBe(desiredLength);
        expect(result).toEqual(expect.arrayContaining([5,6,7,8,11]));
    })
    it('should work properly with negative ranges', () => {
        const start = 5;
        const finish = -13;
        const desiredLength = 5 + 13 + 1;

        const range = [start, finish];
        const result = ArrayOfRange(range[0], range[1]);

        expect(result.length).toBe(desiredLength);
        expect(result).toEqual(expect.arrayContaining([5,4,-7,-8,-11]));
    })
})
