import {ErrorBase} from "./utility";

describe('ErroBase', () => {
    it('should create a base error and set proper name, stack and message', () => {
        const message = 'hello world';
        const baseError = new ErrorBase(message);

        expect(baseError.name).toBe("ErrorBase");
        expect(baseError.message).toBe(message);
        expect(typeof baseError.stack).toBe('string');
    })
    it('When other classes inherit from it, name and stack are set automatically', () => {
        const message = 'hello world';
        class MyError extends ErrorBase {
            constructor(message) {
                super(message);
            }
        }
        const baseError = new MyError(message);

        expect(baseError.name).toBe("MyError");
        expect(baseError.message).toBe(message);
        expect(typeof baseError.stack).toBe('string');
    })
})
