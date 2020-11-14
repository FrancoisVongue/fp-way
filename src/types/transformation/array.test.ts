import {IntersectionBetween, SubtractArr} from './array'

describe('SubtractArr', () => {
    it('should subtract specified array from the target array', () => {
        const removeThese = [1, 12, 3];
        const arr = [1, 5, 6 , 3, 12, 8];
        const result = SubtractArr(removeThese, arr);
        
        expect(result).toEqual([5, 6, 8]);
    })
});
describe('IntersectionBetween', () => {
    it('should return common values between two arrays', () => {
        const arr1 = [5, 1, 1221, 12, 18, 3];
        const arr2 = [1, 5, 6 , 3, 12, 8];
        const result = IntersectionBetween(arr1, arr2);
        
        expect(result).toEqual(expect.arrayContaining([1, 5, 3, 12]));
        expect(result.length).toEqual(4);
    })
});