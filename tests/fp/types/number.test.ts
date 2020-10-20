import {divideBy, gt, lt, max, min, pow, subtract} from "../../../src/fp/types/number";

describe('gt', () => {
    it('should return true if second value is bigger than the first', () => {
        const gt3 = gt(3);
        const TwoIsGreaterThanThree = gt3(2);
        const FourIsGreaterThanThree = gt3(4);

        expect(TwoIsGreaterThanThree).toBeFalsy();
        expect(FourIsGreaterThanThree).toBeTruthy();
    })
})
describe('lt', () => {
    it('should return true if second value is smaller than the first', () => {
        const lt3 = lt(3);
        const TwoIsLessThanThree = lt3(2);
        const FourIsLessThanThree = lt3(4);

        expect(TwoIsLessThanThree).toBeTruthy();
        expect(FourIsLessThanThree).toBeFalsy();
    })
})
describe('max', () => {
    it('should return specified max number in case argument is bigger', () => {
        const max5 = max(5);
        const five = max5(100);

        expect(five).toBe(5);
    })
    it('should return second value if it is smaller than the first one', () => {
        const max5 = max(5);
        const three = max5(3);

        expect(three).toBe(3);
    })
})
describe('min', () => {
    it('should return specified min number in case argument is smaller', () => {
        const min5 = min(5);
        const five = min5(2);

        expect(five).toBe(5);
    })
    it('should return second value if it is bigger than the first one', () => {
        const min5 = min(5);
        const ten = min5(10);

        expect(ten).toBe(10);
    })
})
describe('subtract', () => {
    it('should subtract specified value from any numeric value passed as a second argument', () => {
        const sbtr5 = subtract(5);
        const five = sbtr5(10);

        expect(five).toBe(5);
    })
})
describe('divide', () => {
    it('should divide by specified value any numeric value passed as a second argument', () => {
        const divideBy5 = divideBy(5);
        const five = divideBy5(25);

        expect(five).toBe(5);
    })
})
describe('pow', () => {
    it('should raise to given extent any number passed as a second argument', () => {
        const toTheSecondExtend = pow(2);
        const TwentyFive = toTheSecondExtend(5);

        expect(TwentyFive).toBe(25);
    })
})
