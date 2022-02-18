import {obj} from "./index";
import ValidationOptionsSym = obj.ValidationOptionsSym;
import ObjectMapSpec = obj.ObjectMapSpec;
import {IsOfType, Return, TRUE} from "../core";
import _defaultValidationOptions = obj._defaultValidationOptions;
import ValidationSpecWithPopulatedOptions = obj.ValidationSpecWithPopulatedOptions;
import PopulatedValidationOptions = obj.PopulatedValidationOptions;
import Validate = obj.Validate;

type Cat = {
    age: number;
    name: string;
    amountOfLegs: number;
    child?: Partial<Cat>;
}


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
        
        const catWOAge: Partial<Cat> = obj.ExcludeProps(["age"], cat);
        
        expect(catWOAge.age).toBeUndefined();
        expect(catWOAge.name).toBeDefined();
    })
    
    it('Should have no link with the old obj', () => {
        const cat = {
            age: 8,
            name: 'John',
            amountOfLegs: 4
        };

        const catWOAge: Partial<Cat> = obj.ExcludeProps(["age"], cat);
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
    type Animal = {
        alive: boolean;
        name: string;
        legs: number;
    }
    type Cat = Pick<Animal, "alive" | "name"> & {
        amountOfLegs: number;
        mustacheLength: number;
    }
    
    let animal1: Animal;
    
    beforeEach(() => {
        animal1 = {
            alive: false,
            name: 'John',
            legs: 2
        }
    })
    
    it('Should map one type to another', () => {
        const mapSpec: ObjectMapSpec<Animal, Cat> = {
            map: [
                ["alive", TRUE, "alive"],
                ["legs", Return(4), "amountOfLegs"],
                ["", (v, o) => o.legs * 2,  "mustacheLength"],
            ],
        }
        
        const cat = obj.Map(mapSpec, animal1);
        
        expect(cat.amountOfLegs).toBe(4);
        expect(cat.alive).toBe(true);
        expect(cat.mustacheLength).toBe(animal1.legs * 2);
        expect(cat.name).toBeUndefined();
    })
    
    it('Should directly map specified properties', () => {
        const mapSpec: ObjectMapSpec<Animal, Cat> = {
            map: [
                ["alive", TRUE, "alive"],
                ["legs", Return(4), "amountOfLegs"],
                ["", (v, o) => o.legs * 2,  "mustacheLength"],
            ],
            transfer: ["name"] // leave animal name as it is
        }

        const cat = obj.Map(mapSpec, animal1);

        expect(cat.name).toBe(animal1.name);
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
    it('should validate an object', () => {
        const CatSpec: obj.ValidationSpec<Cat> = {
            age: [IsOfType('number')],
            name: [IsOfType('string')],
            amountOfLegs: [IsOfType('number')],
            child: [IsOfType('object')],
        }
        
        const cat: Cat = {
            age: 1,
            name: 'Tonny',
            amountOfLegs: 4,
            child: {}
        }
        
        const result = Validate(CatSpec, cat);
        
        expect(result.valid).toBe(true);
    })
})