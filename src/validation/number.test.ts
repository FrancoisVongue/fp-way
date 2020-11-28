import {IsNumber, NumberToInt} from "./number";

describe('NumberToInt', () => {
    it('should conver float to int', () => {
        const pi = 3.14;
        const result = NumberToInt(pi);
        expect(result).toBe(3);
    })
})
describe('IsNumber', () => {
    it('should return true if argument is a number', () => {
        const result1 = IsNumber('1');
        const result2 = IsNumber(true);
        const result3 = IsNumber({});
        const result4 = IsNumber([1,2]);

        const result = result1 || result2 || result3 || result4;

        expect(result).toBe(false);
    })
})
describe('NumberToInt', () => {
    it('Should return number without decimal fraction', () => {
        const resultFive = NumberToInt(5.123213);
        const resultMinusFive = NumberToInt(-5.123213);

        expect(resultFive).toBe(5);
        expect(resultMinusFive).toBe(-5);
    })
    it('Should return NaN in case argument is not a number', () => {
        // @ts-ignore
        const resultNan = NumberToInt('five');

        expect(isNaN(resultNan)).toBe(true);
    })
})
