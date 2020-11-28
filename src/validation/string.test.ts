import {
    ContainsString,
    EndsWith,
    IndexOf,
    StartsWith,
    Test
} from "./string";
import arrayContaining = jasmine.arrayContaining;
import {NumberToInt} from "./number";
import {Pipe} from "../core";
import {MapArr, OccurrencesOf} from "..";

describe('Test', () => {
    it('should test a string agains a regex', () => {
        const regex = /^\d{4}\w{3,12}/i;
        const isYearPlusName = Test(regex);
        const twentytwentytiger = '2020tiger';
        const invalid = '12ssssssssssssssssssssssssssssssssss';

        const result = isYearPlusName(twentytwentytiger);
        const invalidResult = isYearPlusName(invalid);

        expect(result).toBe(true);
        expect(invalidResult).toBe(false);
    })
})
describe('IndexOf', () => {
    it('should return index of substring or -1 if is not contained', () => {
        const iofS = IndexOf('S');

        const result = iofS('0123S');
        const invalidresult = iofS('0123');

        expect(result).toBe(4);
        expect(invalidresult).toBe(-1);
    })
})
describe('StartsWith', () => {
    it('should return true or false depending if string starts with another', () => {
        const startsWithFNS = StartsWith('FNS');

        const result = startsWithFNS('FNSdsfsdf')
        const invalidresult = startsWithFNS('dfdffFNS')
        const invalidresult2 = startsWithFNS('fns')

        expect(result).toBe(true);
        expect(invalidresult).toBe(false);
        expect(invalidresult2).toBe(false);
    })
})
describe('EndsWith', () => {
    it('should return true or false depending if string ends with another', () => {
        const endsWith2013 = EndsWith('2013')

        const result = endsWith2013('dfdf2013')
        const invalidresult = endsWith2013('013')
        const invalidresult2 = endsWith2013('2013ddfsf')

        expect(result).toBe(true);
        expect(invalidresult).toBe(false);
        expect(invalidresult2).toBe(false);
    })
})
describe('ContainsString', () => {
    it('should return true or false depending if string contains another', () => {
        const contains13 = ContainsString('13');

        const result = contains13('dfdf2013')
        const invalidresult = contains13('103')

        expect(result).toBe(true);
        expect(invalidresult).toBe(false);
    })
})
// todo: move
describe('OccurrencesOf', () => {
    it('should return all occurences of a regex in a string', () => {
        const numberRegex = /\d+/;
        const numbersCSV = '12, 13, 14, 1, 2';

        const result = Pipe([
            OccurrencesOf(numberRegex),
            MapArr(NumberToInt)
        ], numbersCSV);

        expect(result).toBeInstanceOf(Array);
        expect(result).toEqual(expect.arrayContaining([12,13,1,2]));
    })
})
