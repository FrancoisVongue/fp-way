import {allCombinations} from "../../../src/fp/types/array";

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
