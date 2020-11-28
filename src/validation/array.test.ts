import {
    AllElementsAre,
    ContainedIn, EqualsArray, EqualsList,
    IsArrayOfLength,
    IsEmptyArray, IsSubsetOf,
    IsSupersetOf
} from "./array";
import {IsInt} from "./number";

describe('IsArrayOfLength', () => {
    it('should return true if it is an array of a given length', () => {
        const arrofThree = [1,2,3];
        const result = IsArrayOfLength(3, arrofThree);

        expect(result).toBe(true);
    })
    it('should return false if it is not an array of a given length', () => {
        const stringOfLengthThree = 'sss';
        const arrayOfLengthFive = [1,2,3,4,5];
        const nil = null;

        const result1 = IsArrayOfLength(3, arrayOfLengthFive);
        const result2 = IsArrayOfLength(3, stringOfLengthThree);
        const result3 = IsArrayOfLength(3, nil);

        const result = result1 || result2  || result3;

        expect(result).toBe(false);
    })
})
describe('IsEmptyArray', () => {
    it('should return true if array if empty', () => {
        const arrofThree = [];
        const result = IsEmptyArray(arrofThree);

        expect(result).toBe(true);
    })
    it('should return false if what is passed is not an empty array', () => {
        const emptyString = '';
        const stringOfLengthThree = 'sss';
        const arrayOfLengthFive = [1,2,3,4,5];
        const nil = null;

        const result1 = IsArrayOfLength(3, arrayOfLengthFive);
        const result2 = IsArrayOfLength(3, stringOfLengthThree);
        const result3 = IsArrayOfLength(3, nil);
        const result4 = IsArrayOfLength(3, emptyString);

        const result = result1 || result2  || result3 || result4;

        expect(result).toBe(false);
    })
})
describe('AllElementsAre', () => {
    it('should return true if predicate returns true for all elements', () => {
        const arrOfInts = [1,2,3,4];
        const result = AllElementsAre(IsInt, arrOfInts);

        expect(result).toBe(true);
    })
    it('should return false if at least a single element returns false to the predicate', () => {
        const arrOfNumbers = [1,2,3,3.14];

        const result = AllElementsAre(IsInt, arrOfNumbers);

        expect(result).toBe(false);
    })
})
describe('ContainedIn', () => {
    it('should return true if an elemnet is contained within an array', () => {
        const arrOfNumbers = [1,2,3];
        const contained = ContainedIn(arrOfNumbers, 1);
        const notcontained = ContainedIn(arrOfNumbers, 8);

        expect(contained).toBe(true);
        expect(notcontained).toBe(false);
    })
})
describe('IsSubsetOf', () => {
    it('should return true if an array is strict subset of another array', () => {
        const sup = [1,2,3];
        const sub = [1,2];
        const result = IsSubsetOf(sup, sub);
        const falseresult = IsSubsetOf(sub, sup);

        expect(result).toBe(true);
        expect(falseresult).toBe(false);
    })
})
describe('EqualsArray', () => {
    it('should return true if arrays contain the same set of values', () => {
        const arr1 = [1,2,3,4,5];
        const arr2 = [1,2,4,5,3];

        const result = EqualsArray(arr1, arr2);
        expect(result).toBe(true);
    })
    it('should return false if arrays contain different values', () => {
        const arr1 = [1,2,3,4,5];
        const arr2 = [1,2,8,4,5]; // 8 instead of 3

        const result = EqualsArray(arr1, arr2);
        expect(result).toBe(false);
    })
})
describe('EqualsList', () => {
    it('should return true if arrays have same values in the same order', () => {
        const arr1 = [1,2,3,4,5];
        const arr2 = [1,2,3,4,5];

        const result = EqualsList(arr1, arr2);
        expect(result).toBe(true);
    })
    it('should return false if arrays contain different values ' +
        'or values are arranged in different order', () => {
        const arr1 = [1,2,3,4,5];
        const arr2 = [1,2,4,5,3]; // 3 is misarranged

        const result = EqualsList(arr1, arr2);
        expect(result).toBe(false);
    })
})
