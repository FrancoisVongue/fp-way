import {applyTo} from "../../../src/fp/basic functions/index";
import {curry} from "../../../src/fp/function-transformation/curry";

describe('applyTo', () => {
    it('should apply a functions to an argument', () => {
        const add = (a:number) => (b: number) => a + b;
        const inc = add(1);
        const one = 1;
        const result = applyTo(one, inc);

        expect(result).toBe(2);
    });
    it('should apply a functions to multiple arguments', () => {
        const add3 = v => v+3;
        const add2 = v => v + 2;
        const fnArr = [add3, add2];
        const one = 1;
        const applyToOne = curry(applyTo)(one);

        const result = fnArr.map(applyToOne);

        expect(result).toEqual([4, 3]);
    });
})
