import {obj} from "./index";
import ValidationOptionsSym = obj.ValidationOptionsSym;
import ObjectMapSpec = obj.ObjectMapSpec;
import {Identity, IsOfType, Return, TRUE} from "../core";
import _defaultValidationOptions = obj._defaultValidationOptions;
import ValidationSpecWithPopulatedOptions = obj.ValidationSpecWithPopulatedOptions;
import PopulatedValidationOptions = obj.PopulatedValidationOptions;
import Validate = obj.Validate;

type CatParent = {
    age: number;
    name?: string;
    amountOfLegs: number;
    childCat: Cat;
}
type Cat = {
    age: number;
    name?: string;
    amountOfLegs: number;
    child?: CatChild
}
type CatChild = Partial<Omit<Cat, 'child'>>


describe('WithDefault', () => {
    let defCat: Partial<Cat>;
    let partialCat: Partial<Cat>;

    beforeEach(() => {
        defCat = {
            amountOfLegs: 4,
            child: {
                age: 1,
                amountOfLegs: 4
            }
        }
        partialCat = {
            age: 5,
            name: 'Johny',
            child: {
                amountOfLegs: 3,
                name: 'Johny Jr.',
            }
        }
    });

    it('Should provide default properties for objects', () => {
        const cat = obj.WithDefault(defCat, partialCat) as Cat;

        expect(cat.amountOfLegs).toBe(defCat.amountOfLegs); // should take default
        expect(cat.child?.age).toBe(defCat.child?.age); // should take default
        expect(cat.child?.amountOfLegs).toBe(3); // should preserve existing
    })

    it('Should not have link to the default object', () => {
        const cat = obj.WithDefault(defCat, partialCat) as Cat;
        cat.amountOfLegs = 3;

        expect(cat.amountOfLegs).toBe(3);
        expect(defCat.amountOfLegs).toBe(4);
    })
})
describe('ExcludeProps', () => {
    it('Should remove properties from objects', () => {
        const cat = {
            age: 8,
            name: 'John',
            amountOfLegs: 4
        };

        const catWOAge: Partial<Cat> = obj.Exclude(["age"], cat);

        expect(catWOAge.age).toBeUndefined();
        expect(catWOAge.name).toBeDefined();
    })

    it('Should have no link with the old obj', () => {
        const cat = {
            age: 8,
            name: 'John',
            amountOfLegs: 4
        };

        const catWOAge: Partial<Cat> = obj.Exclude(["age"], cat);
        catWOAge.amountOfLegs = 444;

        expect(cat.amountOfLegs).toBe(4);
    })
})
describe('Pick', () => {
    it('Should pick properties from objects', () => {
        const cat = {
            age: 8,
            name: 'John',
            amountOfLegs: 4
        };

        const catWOAge: Partial<Cat> = obj.Pick(["name", "amountOfLegs"], cat);

        expect(catWOAge.age).toBeUndefined();
        expect(catWOAge.name).toBeDefined();
        expect(catWOAge.amountOfLegs).toBeDefined();
    })

    it('Should have no link with the old obj', () => {
        const cat = {
            age: 8,
            name: 'John',
            amountOfLegs: 4
        };

        const catWithAge: Partial<Cat> = obj.Pick(["age"], cat);
        catWithAge.age = 444;

        expect(cat.age).toBe(8);
    })
})
describe('Map', () => {
    type AnimalOwner = {
        name: string,
        animal: Animal
    }
    type CatOwner = {
        name: string,
        cat: Cat
    }
    type Animal = {
        alive: boolean;
        name: string;
        legs: number;
    }
    type Cat = Pick<Animal, "alive" | "name"> & {
        amountOfLegs: 4;
        mustacheLength: number;
    }

    let animal1: Animal;
    const AnimalToCatSpec: ObjectMapSpec<Animal, Cat> = {
        map: [
            ["legs", Return(4), "amountOfLegs"],
            ["", (v, o) => o.legs * 2,  "mustacheLength"],
        ],
        transfer: ['name', 'alive']
    }

    beforeEach(() => {
        animal1 = {
            alive: false,
            name: 'John',
            legs: 2
        }
    })

    it('Should map one type to another', () => {
        const cat = obj.Map(AnimalToCatSpec, animal1);

        expect(cat.amountOfLegs).toBe(4);
        expect(cat.mustacheLength).toBe(animal1.legs * 2);
        expect(cat.alive).toBe(animal1.alive);
        expect(cat.name).toBe(animal1.name);
    })

    it('Should directly map specified properties', () => {
        const cat = obj.Map(AnimalToCatSpec, animal1);

        expect(cat.name).toBe(animal1.name);
    })

    it('Should allow to map nested objects by passing a spec', () => {
        const animalOwner: AnimalOwner = {
            name: 'John',
            animal: {
                alive: true,
                legs: 3,
                name: 'Tonny'
            }
        }

        const catOwner = obj.Map<AnimalOwner, CatOwner>({
            transfer: ['name'],
            map: [
                ['animal', AnimalToCatSpec, 'cat']
            ]
        }, animalOwner);

        expect(catOwner.cat.amountOfLegs).toBe(4);
        expect(catOwner.cat.mustacheLength).toBeGreaterThan(0);
    })
})
describe('_preCheckProps', () => {
    let catSpec: ValidationSpecWithPopulatedOptions<Cat> = {
        age: [
            [IsOfType("number"), 'age must be a number'],
        ],
        name: [
            [IsOfType("string"), 'name must be string'],
        ],
        amountOfLegs: [
            [IsOfType("string"), 'amountOfLegs must be number'],
        ],
        child: [
            [IsOfType("string"), 'child must be partial cat'],
        ],
        [ValidationOptionsSym]: _defaultValidationOptions as PopulatedValidationOptions<Cat>
    }
    it('Should return missing properties', () => {
        const catWOage: Partial<Cat> = {
            // age: 12,
            amountOfLegs: 4,
            name: 'Tony'
        }
        const result = obj._validationPreCheckProps(catSpec, catWOage);

        expect(result.missing).toEqual(['age', 'child']);
    })
    it('Should return redundant properties', () => {
        const catWithTailLength: Partial<Cat> & {tailLen: number} = {
            age: 12,
            amountOfLegs: 4,
            name: 'Tony',
            tailLen: 22
        }
        const result = obj._validationPreCheckProps(catSpec, catWithTailLength as any);

        expect(result.redundant).toEqual(['tailLen']);
    })
    it('Should return properties that need to be checked', () => {
        const catWOageWithTailLen: Partial<Cat> & {tailLen: number} = {
            // age: 12, -- missing
            amountOfLegs: 4,
            name: 'Tony',
            tailLen: 22  // -- redundant
        }
        const result = obj._validationPreCheckProps(catSpec, catWOageWithTailLen as any);

        expect(result.propsToCheck).toEqual(['amountOfLegs', 'name']);
    })
})
describe('Validate', () => {
    const CatChildSpec: obj.ValidationSpec<CatChild> = {
        age: [
            [IsOfType('number'), 'age must be a number']
        ],
        name: [
            [IsOfType('string'),  'name must be a number']
        ],
        amountOfLegs: [
            [IsOfType('number'),  'amountOfLegs must be a number']
        ],
        [ValidationOptionsSym]: {
            optionalProps: ['name', 'age', 'amountOfLegs']
        }
    }

    const CatSpec: obj.ValidationSpec<Cat> = {
        age: [
            [IsOfType('number'), 'age must be a number']
        ],
        name: [
            [IsOfType('string'),  'name must be a number']
        ],
        amountOfLegs: [
            [IsOfType('number'),  'amountOfLegs must be a number']
        ],
        child: CatChildSpec,
        [ValidationOptionsSym]: {
            optionalProps: ['name']
        }
    }

    const CatParentSpec: obj.ValidationSpec<CatParent> = {
        age: [
            [IsOfType('number'), 'age must be a number']
        ],
        name: [
            [IsOfType('string'),  'name must be a number']
        ],
        amountOfLegs: [
            [IsOfType('number'),  'amountOfLegs must be a number']
        ],
        childCat: CatSpec,
        [ValidationOptionsSym]: {
            optionalProps: ['name']
        }
    }

    it('should return valid summary if an object is valid', () => {

        const cat: Cat = {
            age: 1,
            name: 'Tonny',
            amountOfLegs: 4,
            child: {}
        }

        const result = Validate(CatSpec, cat);

        expect(result.valid).toBe(true);
    })
    it('should return valid summary if an object is invalid', () => {

        const cat: Cat = {
            age: '1' as any, // str instead of a number
            name: 'Tonny',
            amountOfLegs: 4,
            child: [] as any // arr instead of an obj
        }

        const result = Validate(CatSpec, cat);

        expect(result.valid).toBe(false);
    })
    it('should return number of errors and invalid keys', () => {

        const cat: Cat = {
            age: '1' as any, // str instead of a number
            name: 'Tonny',
            amountOfLegs: 4,
            child: [] as any // arr instead of an obj
        }

        const result = Validate(CatSpec, cat);

        expect(result.errors.name).toBeUndefined();
        expect(result.errors.amountOfLegs).toBeUndefined();

        expect(result.errors.age).toBeDefined();
        expect(result.errors['child._self']).toBeDefined();
        expect(result.errorCount).toBe(2);
        expect(result.valid).toBe(false);
    })
    it('should not error optional properties if they were omitted', () => {
        const cat: Cat = {
            age: 1,
            // name: 'Tonny',  <-- optional
            amountOfLegs: 4,
            child: {},
        }

        const result = Validate(CatSpec, cat);

        expect(result.valid).toBe(true);
    })
    it('should error optional properties if they are present', () => {
        const cat: Cat = {
            age: 1,
            name: 1 as any, // should be string
            amountOfLegs: 4,
            child: {},
        }

        const result = Validate(CatSpec, cat);

        expect(result.valid).toBe(false);
        expect(result.errors.name).toBeDefined();
    })
    it('should error redundant properties by default', () => {
        const cat: Cat & any = {
            age: 1,
            name: 'Tonny',
            amountOfLegs: 4,
            child: {},
            redProp: 'what', // redundant
        }

        const result = Validate(CatSpec, cat);

        expect(result.redundantProperties?.length).toBeGreaterThan(0);
    })
    it('should validate specs even if they are deeply nested', () => {
        const cat: Cat = {
            age: 1,
            name: 1 as any, // SHOULD BE A STRING
            amountOfLegs: 4,
            child: {
                name: 'Tonny jr',
                age: '1' as any, // SHOULD BE A NUMBER
            },
        }
        const catParent: CatParent = {
            age: 1,
            name: 'Tonny Sr',
            amountOfLegs: '4' as any, // SHOULD BE NUMBER
            childCat: cat
        }

        const result = Validate(CatParentSpec, catParent);

        expect(result.errorCount).toBe(3);
        expect(result.valid).toBe(false);
    })
    it('should validate an object in less than 3ms', () => {
        const cat: Cat = {
            age: 1,
            name: 1 as any, // SHOULD BE A STRING
            amountOfLegs: 4,
            child: {
                name: 'Tonny jr',
                age: '1' as any, // SHOULD BE A NUMBER
            },
        }
        const catParent: CatParent = {
            age: 1,
            name: 'Tonny Sr',
            amountOfLegs: '4' as any, // SHOULD BE NUMBER
            childCat: cat
        }

        const ITERATIONS = 100;

        const start = process.hrtime();
        for(let i = 0; i < ITERATIONS; i++) {
            Validate(CatParentSpec, catParent);
        }
        const [_, ms6] = process.hrtime(start);
        const ms = ms6 / 10**6 / ITERATIONS

        expect(ms).toBeLessThan(3);
    })
})
describe('DeepCopy', () => {
    it('should create a deep copy of an object', () => {
        const humanFriendHeight = 188;
        const human = {
            name: 'jogn',
            height: 182,
            friend: {
                name: 'lenny',
                height: humanFriendHeight
            }
        };

        const humanCopy = obj.DeepCopy(human);
        humanCopy.friend.height = 155;

        expect(human.friend.height).toEqual(humanFriendHeight); // should not change
        expect(humanCopy.name).toEqual(human.name);
        expect(humanCopy.friend.name).toEqual(human.friend.name);
    })
})
