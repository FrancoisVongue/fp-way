import {allCombinations, flatten} from "../../src";

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
