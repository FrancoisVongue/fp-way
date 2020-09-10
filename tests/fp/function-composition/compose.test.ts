import {compose} from "../../../src/index";

describe('compose', () => {
    it('should compose two functions', () => {
        const add = (a:number) => (b: number) => a + b;
        const add1 = add(1);
        const add2 = add(2);
        const add3 = compose([add1, add2]);
        const result = add3(1);

        expect(result).toBe(4);
    })
    it('should compose two different functions', () => {
        const addWithTwoArgs = (a:number, b: number) => a + b;
        const toString = (v): string => '' + v;

        const addAndToString = compose([toString, addWithTwoArgs]);
        const result = addAndToString(12, 14);

        expect(result).toStrictEqual('26');
    })
})
