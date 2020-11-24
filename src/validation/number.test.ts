import {NumberToInt} from "./number";

describe('NumberToInt', () => {
    it('should conver float to int', () => {
        const pi = 3.14;
        const result = NumberToInt(pi);
        expect(result).toBe(3);
    })
})
