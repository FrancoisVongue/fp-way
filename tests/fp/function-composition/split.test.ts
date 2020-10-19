import {spreadResult} from "../../../src/fp/function-composition/spreadResult";

describe('split', () => {
    it('should split by the number of functions', () => {
        const mul2 = v => v*2;
        const add2 = v => v+2;
        const fnArr = [mul2, add2];
        const result = spreadResult(fnArr, 4);

        expect(result).toEqual([8, 6])
    })
})
