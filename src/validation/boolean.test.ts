import {Either, IsBoolean} from "./boolean";
import {Is} from "../core";

describe('Either', () => {
    it(`should return true if at least one of two
        predicates returns true for the argument`, () => {
        const Either5or8 = (Either as Either<number>)(Is(5), Is(8));

        const result = Either5or8(8);
        const failedResult = Either5or8(12);

        expect(result).toBe(true);
        expect(failedResult).toBe(false);
    })
})
describe('IsBoolean', () => {
    it('should return true if the argument is of type boolean', () => {
        const trueResult1 = IsBoolean(true);
        const trueResult2 = IsBoolean(false);

        const result1 = IsBoolean('true');
        const result2 = IsBoolean(0);
        const result3 = IsBoolean({name: 'Cali'});

        expect(trueResult1).toBe(true);
        expect(trueResult2).toBe(true);

        expect(result1).toBe(false);
        expect(result2).toBe(false);
        expect(result3).toBe(false);
    })
})
