import {obj} from "./index";

describe('WithDefault', () => {
    type Cat = {
        age: number;
        name: string;
        amountOfLegs: number;
        child?: Partial<Cat>;
    }
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
        } as const;
        
        const catWOAge = obj.ExcludeProps(["age"], cat);
        
        expect(catWOAge.age).toBeUndefined();
        expect(catWOAge.name).toBeDefined();
    })
    
    it('Should have no link with the old obj', () => {
        const cat = {
            age: 8,
            name: 'John',
            amountOfLegs: 4
        };

        const catWOAge = obj.ExcludeProps(["age"], cat);
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
        } as const;

        const catWOAge = obj.PickProps(["name", "amountOfLegs"], cat);

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

        const catWithAge = obj.PickProps(["age"], cat);
        catWithAge.age = 444;

        expect(cat.age).toBe(8);
    })
})
