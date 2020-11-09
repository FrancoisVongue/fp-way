import {
    applyTo, call, compose,
    Const, curry, delayCall, DoNothing,
    Identity, pipe, Skip, skipMerge, spreadArg,
    Swap, unless,
    Variable, when
} from "../../src";

describe('identity', () => {
    it('should return what has been passed to it', () => {
        const thing = {value: 'something'};
        const result = Identity(thing);

        expect(result).toEqual(thing);
    })
})
describe('doNothing', () => {
    it('should do nothing', () => {
        let result = DoNothing();

        expect(result).toBeUndefined();
    })
})
describe('Const', () => {
    it('should return what has been passed to it FIRST ', () => {
        const thing = {value: 'something'};
        const constantFn = Const(thing);
        const result = constantFn(2);

        expect(result).toEqual(thing);
    })
})
describe('Variable', () => {
    it('should return what has been passed to it LAST', () => {
        const thing = {value: 'something'};
        const variableFn = Variable('something else');
        const result = variableFn(thing);

        expect(result).toEqual(thing);
    })
})
describe('Swap', () => {
    it('should call function with reversed parameters', () => {
        const subtract = (a, b) => a - b;
        const reversedSubtract = Swap(subtract);
        const smallerNumber = 1;
        const biggerNumber = 2;

        const result = reversedSubtract(smallerNumber, biggerNumber);

        expect(result).toBeGreaterThan(0);
    })
})
describe('applyTo', () => {
    it('should apply given function on giver argument', () => {
        const addTwo = n => n + 2;
        const two = 2;
        const result = applyTo(two)(addTwo);

        expect(result).toEqual(4);
    })
})
describe('call', () => {
    it('should call given function with giver argument', () => {
        const addTwo = n => n + 2;
        const two = 2;
        const result = call(addTwo)(two);

        expect(result).toEqual(4);
    })
})
describe('delayCall', () => {
    it('should call given function with giver argument after hollow call', () => {
        const addTwo = n => n + 2;
        const two = 2;
        const delayed = delayCall(addTwo)(two);
        const result = delayed();

        expect(result).toEqual(4);
    })
})
describe('when', () => {
    it('should call given function if predicate is satisfied', () => {
        let called = false;

        const setCalled = () => called = true;
        const alwaysTrue = () => true;

        when(alwaysTrue, setCalled)('some value');

        expect(called).toBeTruthy();
    })
    it('should not call given function if predicate is not satisfied', () => {
        let called = false;

        const setCalled = () => called = true;
        const alwaysFalse = () => false;

        when(alwaysFalse, setCalled)('some value');

        expect(called).toBeFalsy();
    })
})
describe('unless', () => {
    it('should call given function if predicate is not satisfied', () => {
        let called = false;

        const setCalled = () => called = true;
        const alwaysFalse = () => false;

        unless(alwaysFalse, setCalled)('some value');

        expect(called).toBeTruthy();
    })
    it('should not call given function if predicate is satisfied', () => {
        let called = false;

        const setCalled = () => called = true;
        const alwaysTrue = () => true;

        unless(alwaysTrue, setCalled)('some value');

        expect(called).toBeFalsy();
    })
    it('should return result of calling function in case it was called', () => {
        const getTwo = () => 2;
        const alwaysFalse = () => false;

        const result = unless(alwaysFalse, getTwo)('some value');

        expect(result).toEqual(2);
    })
    it('should return passed value in case function was not called', () => {
        const someValue = {value: 1};
        const getTwo = () => 2;
        const alwaysTrue = () => true;

        const result = unless(alwaysTrue, getTwo)(someValue);

        expect(result).toEqual(someValue);
    })
})
describe('spreadResult', () => {
    it('should split by the number of functions', () => {
        const mul2 = v => v*2;
        const add2 = v => v+2;
        const fnArr = [mul2, add2];
        const result = spreadArg(fnArr, 4);

        expect(result).toEqual([8, 6])
    })
})
describe('pipe', () => {
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
describe('compose', () => {
    it('should compose two functions', () => {
        const add = (a:number) => (b: number) => a + b;
        const add1 = add(1);
        const add2 = add(2);
        const add3 = compose([add1, add2]);
        const result = add3(1);

        expect(result).toBe(4);
    })
})
describe('skipMerge', () => {
    it('should skip elements of an array marked as Skip()', () =>{
        let argList1 = [1, Skip(), 3];
        let argList2 = [Skip(), 2];
        const result = skipMerge(argList1, argList2);

        expect(result).toEqual([1, Skip(), 3, 2]);
    })
    it('should skip elements of an array marked as Skip()', () =>{
        let argList1 = [Skip(), Skip(), 3];
        let argList2 = [Skip(), Skip(), 2];
        const result = skipMerge(argList1, argList2);

        expect(result).toEqual([Skip(), Skip(), 3, 2]);
    })
    it('should skip elements of an array marked as Skip()', () =>{
        let argList1 = [3, Skip()];
        let argList2 = [2, 2];
        const result = skipMerge(argList1, argList2);

        expect(result).toEqual([3, 2, 2]);
    })
    it('should skip elements of an array marked as Skip()', () =>{
        let argList1 = [Skip(), Skip()];
        let argList2 = [2, 2];
        const result = skipMerge(argList1, argList2);

        expect(result).toEqual([2, 2]);
    })
    it('should skip elements of an array marked as Skip()', () =>{
        let argList1 = [];
        let argList2 = [2, Skip(), 2];
        const result = skipMerge(argList1, argList2);

        expect(result).toEqual([2, Skip(), 2]);
    })
})
describe('curry', () => {
    it('Should call function when all arguments provided at a time', () => {
        let addFn = (a: number, b:number) => a + b;
        let curriedAddFn = curry(addFn);
        const result = curriedAddFn(2, 2);
        expect(result).toBe(4);
    });
    it('Should return a function when not enough arguments were specified', () => {
        let addFn = (a: number, b:number) => a + b;
        let curriedAddFn = curry(addFn);
        const result = curriedAddFn(1);
        expect(result).toBeInstanceOf(Function);
    })
    it('Should work with different types', () => {
        let addFn = (a, b: string): string => a + b;
        let curriedAddFn = curry(addFn);
        const result = curriedAddFn(1, '2');
        expect(result).toBe('12');
    });
})
