import {pipe} from "../../../src/index";
import {compose} from "../../../src/index";

describe('pipe', () => {
    it('should pipe two functions', () => {
        const addWithTwoArgs = (a:number, b: number) => a + b;
        const toString = (v): string => '' + v;

        const addAndToString = pipe([addWithTwoArgs, toString]);
        const result = addAndToString(12, 14);

        expect(result).toStrictEqual('26');
    })
    it('should equal to compose with reversed order of functions', () => {
        const add = (a: number) => (b: number) => a + b;
        const mul = (a: number) => (b: number) => a * b;

        const add2 = add(2);
        const mulBy2 = mul(2);

        const functionArray = [add2, mulBy2];
        const functionArrayReversed = [mulBy2, add2];

        const pipeResult = pipe(functionArray);
        const composeResult = compose(functionArrayReversed);

        expect(pipeResult(1)).toStrictEqual(composeResult(1));
    })
})
