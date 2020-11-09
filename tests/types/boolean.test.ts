import {allPass, eitherPass, neitherPass, negate} from "../../src";


describe('not', () => {
    it('should return false if passed function returns true', () => {
        const alwaysTrue = () => true;
        const alwaysFalse = negate(alwaysTrue);
        const result = alwaysFalse('any value');

        expect(result).toBeFalsy();
    })
    it('should return true if passed function returns false', () => {
        const alwaysFalse = () => false;
        const alwaysTrue = negate(alwaysFalse);
        const result = alwaysTrue('any value');

        expect(result).toBeTruthy();
    })
})
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

describe('eitherPass', () => {
    it('should return true if at least one function returns true for given argument', () => {
        const gt0 = x => x > 0;
        const isEven = x => x%2 === 0;
        const isNumber = x => typeof(x) === 'number';
        const atLeastNumber = eitherPass([gt0, isEven, isNumber]);

        const result = atLeastNumber(-1);

        expect(result).toBeTruthy();
    })
    it('should return false if all functions return false for given argument', () => {
        const alwaysFalse = () => false;
        const falseOrFalse = eitherPass([alwaysFalse, alwaysFalse]);

        const result = falseOrFalse('some value');

        expect(result).toBeFalsy();
    })
})
describe('neitherPass', () => {
    it('should return false if at least one function returns true', () => {
        const alwaysFalse = () => false;
        const identity = x => x;

        const nonePasses = neitherPass([alwaysFalse, alwaysFalse, identity]);
        const result = nonePasses(true);

        expect(result).toBeFalsy();
    })
    it('should return true if all functions return false for given argument', () => {
        const alwaysFalse = () => false;
        const falseOrFalse = neitherPass([alwaysFalse, alwaysFalse]);

        const result = falseOrFalse('some value');

        expect(result).toBeTruthy();
    })
})
