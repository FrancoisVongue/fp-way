import {ObjectFromEntries} from "./object";

describe('ObjectFromEntries', () => {
    it('should create an object from entries', () => {
        const entries: [string, any][] = [
            ['name', 'darina'],
            ['age', 5],
        ];
        const result = ObjectFromEntries(entries);

        expect(result.name).toBe('darina');
        expect(result.age).toBe(5);
    })
})
