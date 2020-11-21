import {ToNumber} from "./number";

describe('ToNumber', () => {
    it('should transform different values to boolean', () => {
        let p1 = ToNumber(3.14);
        let one = ToNumber(true);
        let zero = ToNumber(false);
        let p2 = ToNumber('3.14');
        let fromInvalid = (a = 'asdfdsf') => ToNumber(a);

        expect(p1).toBe(3.14);
        expect(p2).toBe(3.14);
        expect(one).toBe(1);
        expect(zero).toBe(0);
        expect(fromInvalid).toThrow();
    });
})
