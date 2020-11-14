import {ToBoolean} from "./boolean";

describe('ToBoolean', () => {
    it('should transform different values to boolean', () => {
        let t1 = ToBoolean(true);
        let t2 = ToBoolean(2);
        let t3 = ToBoolean('true');
        let fromInvalid = (a = 'asdfdsf') => ToBoolean(a);

        expect(t1).toBe(true);
        expect(t2).toBe(true);
        expect(t3).toBe(true);
        expect(fromInvalid).toThrow();
    });
})