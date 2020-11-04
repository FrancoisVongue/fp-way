import {allCombinations, allElementsAre, arrayOf, arrayOfLength, arrayOfRange, Const, flatten, is, lt} from "../../src";

/*
* =====================================================================================
* TRANSLATE
* ====================================================================================
* */
describe('arrayOf', () => {
    it('should create an array from arguments', () => {
        const result = arrayOf(1,2,3, [1,3]);
        expect(result).toEqual([1,2,3, [1,3]]);
    })
})
describe('arrayOfLength', () => {
    it('should create an array of specified length', () => {
        const result = arrayOfLength(12);
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toEqual(12);
    })
    it('should create an array of specified length with specified filler', () => {
        const result = arrayOfLength(12, 4);

        expect(result.every(is(4))).toBeTruthy();
    })
})
describe('arrayOfRange', () => {
    it('should create an array from a specified range', () => {
        const result = arrayOfRange(4, 8);

        expect(result).toEqual([4,5,6,7,8]);
    })
    it('should work with desc order', () => {
        const result = arrayOfRange(8, 4);

        expect(result).toEqual([8,7,6,5,4]);
    })
    it('should work with negative numbers', () => {
        const result = arrayOfRange(2, -2);

        expect(result).toEqual([2,1,0,-1,-2]);
    })
})
describe('allElementsAre', () => {
    it('should return true if predicate returns true for all elements', () => {
        const result = allElementsAre(Const(true), [1,2,-2]);

        expect(result).toBeTruthy();
    })
    it('should return false if predicate returns false for any element', () => {
        const result = allElementsAre(lt(8), [1,2,-2,8]);

        expect(result).toBeFalsy();
    })
})



describe('flatten', () => {
    it('should flatten an array of ONE level depth', () => {
        const nestedArray = [
            [1, 2],
            [3, 4]
        ];

        const result = flatten(nestedArray);

        expect(result).toEqual([1,2,3,4]);
    })
})
    it('should flatten an array of THREE level depth', () => {
        const deeplyNestedArray = [
            [1, 2],
            [[3, 4]],
            [[[5, [6]]]],
        ];

        const result = flatten(deeplyNestedArray);

        expect(result).toEqual([1,2,3,4,5,6]);
})

describe('allCombinations', () => {
    it('should return all combinations for a single array', () => {
        const array = [1,2,3];
        const combinations = allCombinations([array]);

        expect(combinations).toEqual(expect.arrayContaining([1,2,3]));
    })
    it('should return all combinations for two arrays', () => {
        const array1 = [1,2,3];
        const array2 = [1,2,3];
        const combinations = allCombinations([array1, array2]);

        expect(combinations).toEqual(expect.arrayContaining([
            [1,3],
            [2,3],
            [3,1]
        ]));
    })
    it('should return all combinations for five arrays', () => {
        const array1 = [1,2,3];
        const array2 = [1,2,3];
        const array3 = ['a', 'b'];
        const array4 = ['l', 'm', 'n'];
        const array5 = [8, 6];
        const combinations = allCombinations([
            array1,
            array2,
            array3,
            array4,
            array5,
        ]);

        expect(combinations).toEqual(expect.arrayContaining([
            [1,3,'b', 'n', 8],
            [3,1,'b', 'm', 6],
            [2,2,'a', 'l', 8],
        ]));
    })
})
