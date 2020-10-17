/*VALIDATE*/
import {every} from "./array";
import {curry} from "../function-transformation/curry";

export const satisfiesSpec = (spec, obj) => {
    const entrySatisfies = curry((spec, entry) => {
        const key = entry[0];
        const value = entry[1];
        const validator = spec[key];

        return validator(value, obj);
    });

    return every(entrySatisfies(spec), Object.entries(obj));
}
// export const equalTo( ) // deep equality checker
/*TRANSFORM*/

/*TRANSLATE*/
