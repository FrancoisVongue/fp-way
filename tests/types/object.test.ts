import {
    Exists,
    gt,
    isPositive,
    lt,
    specSummary,
    isNumber,
    isString,
    inRange, test
} from "../../src";

describe('errorSummary', () => {
    it('should return an error object in case object doesnt satisfy spec', () => {
        const ageError = 'Must be older than 18 years';
        const salaryError = 'Salary must be a positive number';

        const adultSpec = {
            age: [
                [gt(18), ageError],
            ],
            salary: [
                [isPositive, salaryError]
            ],
        };
        const person = {
            age: 7,
            salary: 0
        }
        const isAnAdult = specSummary(adultSpec);
        const validationResult = isAnAdult(person);

        expect(validationResult).toEqual({
            age: [ageError],
            salary: [salaryError]
        })
    })
    it('should support nested specs', () => {
        const adultAgeError = 'Must be older than 18 years';
        const adultSalaryError = 'Salary must be a positive number';
        const kidAgeError = 'Kid must be younger than 18 years';

        const kidSpec = {
            age: [
                [lt(18), kidAgeError],
            ],
        }
        const adultWithKidSpec = {
            age: [
                [gt(18), adultAgeError],
            ],
            salary: [
                [isPositive, adultSalaryError]
            ],
            kid: kidSpec
        };
        const person = {
            age: 7,
            salary: 0,
            kid: {
                age: 22,
            }
        }
        const isAnAdultWithaKid = specSummary(adultWithKidSpec);
        const validationResult = isAnAdultWithaKid(person);

        expect(validationResult).toEqual({
            age: [adultAgeError],
            salary: [adultSalaryError],
            kid: {
                age: [kidAgeError]
            }
        })
    })
    it('should support BOTH string and callback messages', () => {
        const kidSpec = {
            age: [
                [lt(18), (value) => `Kid's age must be less than 18 but was ${value}`],
                [lt(110), `Kids age must make sense`],
            ],
        }

        const kid = {
            age: 122,
        }
        const isAnAdultWithaKid = specSummary(kidSpec);
        const validationResult = isAnAdultWithaKid(kid);

        expect(validationResult).toEqual({
            age: [
                'Kid\'s age must be less than 18 but was 122',
                `Kids age must make sense`
            ]
        })
    })
    it('should pass example', () => {
        const personSpec = {
            name: [
                [isString, 'name must be a string'],
                [test(/[a-z]{2,20}/i), 'name must consist of latin letters and be from 2 to 20 characters long']
            ],
            age: [
                [isNumber, 'age must be a number'],
                [inRange(8, 90), value => `Age must be in range between 8 and 90 but was ${value}`]
            ],
        }

        const parentSpec = {
            ...personSpec,
            kid: personSpec
        }

        const parent = {
            "name": "Mandela",
            "age": 22,
            "kid": {
                "name": 1,
                "age": 0,
            }
        }

        console.log(specSummary(parentSpec, parent));
    })
});
