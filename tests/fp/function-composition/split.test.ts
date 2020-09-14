import {split} from "../../../src/index";

describe('split', () => {
    it('should split two functions', () => {
        const mul2 = (v: number): number => v * 2;
        const add2 = (v: number): number => v + 2;
        const addTwoNumbers = (numbers: [number, number]): number => numbers[0] + numbers[1];

        const result = split([add2, mul2], addTwoNumbers, 2);
        expect(result).toEqual(6);
    })
    it('should preserve the order', () => {
        const mul2 = (v: number): number => v * 2;
        const add2 = (v: number): number => v + 2;
        const subtract2 = (v: number): number => v - 2;
        const K = v => _ => v;
        const concat = (arr: any[]) => arr.join('');

        const result = split([add2, mul2, K('hello'), subtract2], concat, 8);
        expect(result).toEqual('1016hello6');
    })
})
