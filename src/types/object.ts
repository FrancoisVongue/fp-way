import {
    allElementsAre, exclude,
    forEach, isArray,
    isArrayOfLength,
    map,
    pushTo,
    reduce,
    select, take
} from "./array";
import {
    call,
    Const,
    curry, delayCall,
    Exists,
    ifElse,
    unless,
    when
} from "./basic-functions";
import {lt} from "./number";
import {is, pipe, Return} from "../index";
import {isString} from "./string";
import {compose} from "./construction/function";

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
const isNestedSpec = s => !isArray(s); // todo: change (currently speck != array)
export const specSummary = curry((spec, obj) => {
    const messageForValue = value => (specRuleEntry) => {
        const [rule, message] = specRuleEntry;
        if(rule(value)) {
            return null;
        } else {
            if(isString(message)) {
                return message
            } else {
                return message(value);
            }
        }
    }

    return reduce((summary, entry) => {
        const [key, value] = entry;

        summary[key] = ifElse(
            isNestedSpec,
            spec => specSummary(spec, value),
            pipe([
                map(messageForValue(value)),
                exclude(is(null))
            ])
        )(spec[key]);

        return summary;
    }, {}, getEntries(obj));
});
// export const equalTo( ) // deep equality checker

/*
* =====================================================================================
* TRANSFORM
* ====================================================================================
* */
export const getKeys = obj => Object.keys(obj);
export const getEntries = obj => Object.entries(obj);

