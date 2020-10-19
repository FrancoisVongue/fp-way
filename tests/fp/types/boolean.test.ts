import {allPass} from "../../../src/fp/types/boolean";

describe('allPass', () => {
    it('should return true if all functions return true for given argument', () => {
        const gt0 = x => x > 0;
        const isEven = x => x%2 === 0;
        const isEvenAndGreaterThanZero = allPass([gt0, isEven]);

        const result = isEvenAndGreaterThanZero(8);

        expect(result).toBeTruthy();
    })
    it('should return false if at least one function returns false for given argument', () => {
        const gt0 = x => x > 0;
        const isEven = x => x%2 === 0;
        const canBeDividedBy6 = x => x%6 === 0;
        const even_gt0_canBeDividedBy6 = allPass([gt0, isEven, canBeDividedBy6]);

        const result = even_gt0_canBeDividedBy6(8);

        expect(result).toBeFalsy();
    })
})
