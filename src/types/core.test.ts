import {Compose} from "./core";
import {MapArr, Select} from "./transformation/array";

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
