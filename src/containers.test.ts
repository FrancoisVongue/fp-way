import {Just, Maybe, Nothing} from "./containers";

describe('Maybe', () => {
    it('should create a Nothing container in case null value was passed', () => {
        const nothingContainer = Maybe.of(null);

        expect(nothingContainer).toBeInstanceOf(Nothing);
    })
    it('should create a Just container in case existing value was passed', () => {
        const nothingContainer = Maybe.of(4);

        expect(nothingContainer).toBeInstanceOf(Just);
    })
})
