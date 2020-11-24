import {preCheckProps, ISpec, SpecSummary, ISpecSummary} from "./object";
import {
    GetEntries,
    Gt,
    IsInRange,
    IsLowerCase,
    IsNumber,
    IsString,
    Lt,
    Matches
} from "../index";

describe('checkProps', () => {
    it('should show required and properties to check', () => {
        type Person = {
            name: string,
            age: number,
            salary: number,
        }
        const obj = {
            name: 'francois',
            age: 22,
            salary: null,
        };
        const spec: ISpec<Person> = {
            name: [],
            age: [],
            salary: [],  // missing prop
            __options: {
                optionalProps: ['age']
            }
        }

        const checkResult = preCheckProps(spec, obj);
        
        expect(checkResult.missing).toEqual(['salary']);
        expect(checkResult.propsToCheck).toEqual(['name', 'age']);
    })
});

describe('get entries', () => {
    it('should return key-value pairs of an obj', () => {
        const obj = {
            name: 'francois',
            age: 22
        };
        const entries = GetEntries(obj);

        expect(entries).toEqual([
            ['name', 'francois'],
            ['age', 22],
        ])
    })
});

describe('specSummary', () => {
    it('should return error according to spec', () => {
        interface Kid {
            name: string,
            age: number
        }
        interface Person {
            name: string,
            age?: number,
            kid: Kid
        }
        const kidSpec: ISpec<Kid> = {
            name: [
                [IsString, 'name must be a string'],
                [IsLowerCase, 'name of a kid must be in lowercase']
            ],
            age: [
                [Lt(20), 'age of a kid must be less than 20']
            ],
            __options: {
                errorHandler: ({key, value}) =>
                    `Key "${key}" with value <\\${value}\\> could not be validated` +
                    `Presumably, completely different type`,
            }
        };
        const personSpec: ISpec<Person> = {
            name: [
                [IsString, 'name must be a string'],
                [Matches(/[a-z]{2,20}/i), 'name must consist of latin letters and be from 2 to 20 characters long']
            ],
            age: [
                // [IsNumber, 'age must be a number'],
                [IsInRange(8, 90), value => `Age must be in range between 8 and 90 but was ${value}`],
                [Gt(5), 'Age must be greater than 5']
            ],
            kid: kidSpec,
            __options: {
                // stopWhen: (summary: ISpecSummary) => summary.__meta.__errorCount > 1,
            }
        }
        const person = {
            "name": "Mandela",
            "age": '4',
            "kid": {
                name: "Aloha",
                age: 'dfsdf'
            }
        }
        const summary = SpecSummary(personSpec, person);

        console.log(JSON.stringify(summary, null, '   '))
    })

    it('should err when there are missing properties', () => {
        interface Kid {
            name: string,
            age: number
        }
        const kidSpec: ISpec<Kid> = {
            name: [
                [IsString, 'name must be a string'],
                [IsLowerCase, 'name of a kid must be in lowercase']
            ],
            age: [
                [Lt(20), 'age of a kid must be less than 20']
            ],
            __options: {
                errorHandler: ({key, value}) =>
                    `Key "${key}" with value <\\${value}\\> could not be validated` +
                    `Presumably, completely different type`,
            }
        };
        const kid = {
            name: "aloha",
        }

        const summary = SpecSummary(kidSpec, kid);
        console.log(JSON.stringify(summary, null, '   '))
        expect(summary.__meta.missingProperties.length).toBe(1);
        expect(summary.__meta.errorCount).toBeGreaterThan(0);
    })

    it('should account redundantIsError option', () => {
        interface Kid {
            name: string,
            age: number
        }
        const kidSpec: ISpec<Kid> = {
            name: [
                [IsString, 'name must be a string'],
            ],
            age: [
                [Lt(20), 'age of a kid must be less than 20']
            ],
        };
        const kidSpecStrict = {...kidSpec,
            __options: {
                redundantIsError: true,
            }
        }
        const kid = {
            name: "aloha",
            age: 3,
            redundantProp: 'some value'
        }

        const summaryStrict = SpecSummary(kidSpecStrict, kid);
        const summary = SpecSummary(kidSpec, kid);

        expect(summary.__meta.errorCount)
            .toBeLessThan(summaryStrict.__meta.errorCount);
    })

    it('should account specName option', () => {
        interface Kid {
            name: string,
            age: number
        }
        const kidSpecName = 'Kid Specification';
        const kidSpec: ISpec<Kid> = {
            name: [
                [IsString, 'name must be a string'],
            ],
            age: [
                [Lt(20), 'age of a kid must be less than 20']
            ],
            __options: {
                specName: kidSpecName
            }
        };
        const kid = {
            name: "aloha",
            age: 3,
        }

        const summary = SpecSummary(kidSpec, kid);

        console.log(summary);

        expect(summary.__meta.specName)
            .toEqual(kidSpecName);
    })

    it('should account for invalidWhen option', () => {
        interface Kid {
            name: string,
            age: number
        }
        const kidSpec: ISpec<Kid> = {
            name: [
                [IsString, 'name must be a string'],
            ],
            age: [
                [Lt(20), 'age of a kid must be less than 20']
            ],
            __options: {
                invalidWhen: (s: ISpecSummary) => s.__meta.errorCount > 3,
            }
        };
        const kidSpecStrict = {...kidSpec,
            __options: {}
        }
        const kid = {
            name: "aloha",
            age: 23,
        }

        const summary = SpecSummary(kidSpec, kid);
        const strictSummary  = SpecSummary(kidSpecStrict, kid);

        console.log(summary);
        console.log(strictSummary);

        expect(summary.__valid).toEqual(true);
        expect(strictSummary.__valid).toEqual(false);
    })
});
