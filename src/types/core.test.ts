import {Compose, Curry} from "./core";
import {MapArr, Select} from "./transformation/array";
import {Curried2, Unary} from "./core.types";

describe('Compose', () => {
    it('should pass return from one function to another', () => {
        const add = a => b => a + b ;
        const compositeAdd = Compose([
            add(1),
            add(4),
            add(5),
        ]);
        const result = compositeAdd(5);
        expect(result).toEqual(15);
    })
    it('should work with arrays', () => {
        const numbers = [1,2,3,4]
        const selectNumbers = Compose([
            MapArr(n => n * 3),
            Select(n => n%2 == 0)
        ]);
        const result = selectNumbers(numbers);
        expect(result).toEqual([6, 12]);
    })
});
describe('Curry', () => {
    it('should preserve types with generic functions', () => {
        const MapArr = <T1, R>(f: Unary<T1, R>, arr: T1[]): R[] => arr.map(f);
        const CurriedMap = Curry(MapArr);
        type TMultiply = (a: number) => number;
        const multiply: TMultiply = (a) => a * a;
        const useCurriedMap = CurriedMap as Curried2<TMultiply, number[], ReturnType<TMultiply>[]>;
        const mustBeArrayOfTypeNumber = useCurriedMap((a: number) => a * 2, [1]);
    })
});
