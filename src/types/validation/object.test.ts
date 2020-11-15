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
} from "../..";

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
                errorHandler: (key, value, e) =>
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
});
