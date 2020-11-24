import {
    AllPass,
    Compose,
    CreateAction,
    Identity,
    InCase,
    Is,
    Pipe, TapWith,
    TInCase,
    TPipe
} from "./core";
import {MapArr, Reduce, Select} from "./transformation/array";
import {Curried} from "./core.types";

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
    });
    it('should work with arrays', () => {
        const numbers = [1,2,3,4]
        const selectNumbers = Compose([
            MapArr(n => n * 3),
            Select(n => n%2 == 0)
        ]);
        const result = selectNumbers(numbers);
        expect(result).toEqual([6, 12]);
    });
});
describe('CreateAction', () => {
    it('should create an action from a function, args and context', () => {
        let number = 0;
        const AddFiveToNumberAction = CreateAction((n) => {
            console.log(typeof n);
            console.log(n);
            number += n;
            return number;
        }, [5]);

        AddFiveToNumberAction();
        expect(number).toBe(5);
    })
});
describe('AllPass', () => {
    it('should return true if all functions return true for the arg', function () {
        const greaterThen2 = arg => arg > 2;
        const even = arg => arg%2 === 0;

        const result = AllPass([greaterThen2, even])(18);

        expect(result).toBe(true);
    });
    it('should return false if some functions return false for the arg', function () {
        const greaterThen2 = arg => arg > 2;
        const even = arg => arg%2 === 0;
        const lessThan15 = arg => arg < 15;

        const result = AllPass([greaterThen2, even, lessThan15])(18);

        expect(result).toBe(false);
    });
})
describe('InCase', () => {
    it('should return depending on what function first returns true for the arg', function () {
        const numberThree = 3;
        const two = 'two';
        const three = 'three';
        const five = 'five';

        const result = (InCase as Curried<TInCase<number, string>>)([
            [Is(5), n => 'five'],
            [Is(3), n => 'three'],
            [Is(2), n => 'two'],
        ], numberThree);

        expect(result).toBe(three);
    });
})
describe('Pipe', () => {
    it('should pass return from one function to another in sequence', function () {
        let three;
        let five;
        const minusTwo = v => v - 2;
        const result = Pipe([
            Identity,
            TapWith(v => five = v),
            minusTwo,
            TapWith(v => three = v),
            Identity
        ], 5);

        expect(result).toBe(3);
        expect(five).toBe(5);
        expect(three).toBe(3);
    });
})
