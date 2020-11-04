import {allElementsAre, forEach, pushTo} from "./array";
import {
    call,
    compose,
    Const,
    curry, delayCall,
    exists,
    ifElse,
    unless,
    when
} from "./basic-functions";
import {lt} from "./number";

/*
* =====================================================================================
* TRANSLATE
* ====================================================================================
* */

/*
* =====================================================================================
* VALIDATE
* ====================================================================================
* */
/*
* example spec and result
const spec = {
    property: [
        [lt(3), 'message'],
        [lt(3), 'anotherMessage'],
    ]
};
const result = {
    valid: true, // or false
    errors: {
        property: [
            'message'
        ]
    }
}
*/
export const satisfiesSpec = (spec, obj) => {
    const validationSummary = {
        valid: true,
        errors: {}
    };

    const objectKeys = getKeys(obj);
    forEach((objKey) => {
        const objValue = obj[objKey];
        const errorsArray = validationSummary.errors[objKey] = [];

        forEach((ruleSet) => {
            const rule = ruleSet[0];
            const message = ruleSet[1];

            if(!rule(objValue)) {
                errorsArray.push(message);
                validationSummary.valid = false;
            }
        }, spec[objKey])

        if(errorsArray.length === 0)
            validationSummary.errors[objKey] = null;
    }, objectKeys);
}
// export const equalTo( ) // deep equality checker

/*TRANSFORM*/
export const getKeys = obj => Object.keys(obj);
export const getEntries = obj => Object.entries(obj);

