import {arr} from "./index";
import {num} from "../num";
import {IsOfType, Not} from "../core";

describe('OfLength', function () {
    it('Should create an arr of length n', () => {
        const arrOfLength5 = arr.OfLength(5);

        expect(arrOfLength5.length).toBe(5)
    })
});
describe('FromRange', function () {
    it('Should create an arr from range of numeric values', () => {
        const arr4to6 = arr.FromRange(4, 6, 1)

        expect(arr.Butt(arr4to6)).toBe(6);
        expect(arr4to6.length).toBe(3);
    })
});
describe('Select', function () {
    it('Should select values from an arr by predicate', () => {
        const Even = num.IsQuotientOf(2);
        const arr4to16 = arr.FromRange(4, 16, 1);
        const arr4to16even = arr.Select(Even, arr4to16);

        const True = arr4to16even.every(Even);

        expect(True).toBe(true);
    })
});
describe('Flatten', function () {
    it('Should flatten an array of any depth', () => {
        const groupedArr = [
            [1, 2],
            [3, [4, 5]]
        ];
        const numArr = arr.Flatten(groupedArr)

        expect(numArr.every(IsOfType('number'))).toBe(true);
    })
});
describe('Subtract', function () {
    it('Should subtract value of one arr from another', () => {
        const Even = num.IsQuotientOf(2);
        const Odd = Not(num.IsQuotientOf(2));

        const arr1to100 = arr.FromRange(1, 100, 1);
        const even = arr.Select(Even, arr1to100);
        const odd = arr.Subtract(even, arr1to100);

        expect(odd.every(Odd)).toBe(true);
        expect(odd.length).toBeGreaterThan(48);
        expect(odd.length).toBeLessThan(52);
    })
});
describe('IsSubsetOf', function () {
    it('Should check if arr is subset of another', () => {
        const Even = num.IsQuotientOf(2);
        const arr1to100 = arr.FromRange(1, 100, 1);
        const even = arr.Select(Even, arr1to100);

        const result = arr.IsSubsetOf(arr1to100, even)
        const falseResult = arr.IsSubsetOf(arr1to100, [...even, 101]) // 101 is not in range

        expect(result).toBe(true);
        expect(falseResult).toBe(false);
    })
});
describe('IsUnique', function () {
    it('Should check if arr is unique', () => {
        const uniqueArr = [1,2,3,4,5];
        const notUniqueArr = [1,2,3,4,5,1];

        const result = arr.IsUnique(uniqueArr);
        const falseRes = arr.IsUnique(notUniqueArr);

        expect(result).toBe(true);
        expect(falseRes).toBe(false);
    })
});
