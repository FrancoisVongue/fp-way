import {allElementsAre} from "./array";
import {curry} from "./basic-functions";

/*VALIDATE*/
export const satisfiesSpec = (spec, obj) => {
    const entrySatisfies = curry((spec, entry) => {
        const key = entry[0];
        const value = entry[1];
        const validator = spec[key];

        return validator(value, obj);
    });

    return allElementsAre(entrySatisfies(spec), Object.entries(obj));
}
// export const equalTo( ) // deep equality checker
/*TRANSFORM*/

/*TRANSLATE*/
