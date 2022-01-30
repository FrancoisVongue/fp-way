import {obj} from "./index";
import ObjectMapSpec = obj.ObjectMapSpec;
import {Return, TRUE} from "../core";
import ObjectMapper = obj.ObjectMapper;

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
        expect(cat.child.age).toBe(defCat.child.age); // should take default
        expect(cat.child.amountOfLegs).toBe(3); // should preserve existing
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
describe('PickProps', () => {
    it('Should pick properties from objects', () => {
        const cat = {
            age: 8,
            name: 'John',
            amountOfLegs: 4
        };

        const catWOAge: Partial<Cat> = obj.PickProps(["name", "amountOfLegs"], cat);

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

        const catWithAge: Partial<Cat> = obj.PickProps(["age"], cat);
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