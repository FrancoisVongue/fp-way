import {
    applyTo, call,
    Const, delayCall,
    identity,
    Swap, unless,
    Variable, when
} from "../../../src/index";

describe('identity', () => {
    it('should return what has been passed to it', () => {
        const thing = {value: 'something'};
        const result = identity(thing);

        expect(result).toEqual(thing);
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
