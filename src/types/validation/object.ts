import { Curry, Not } from "../core";
import { IsArray } from "./array";
import { IsString } from "./string";

const isNestedSpec = Not(IsArray);
// const checkProperty = (name, options, obj)
export const specSummary = Curry((spec, obj) => {
    const reservedKeys = ['__options'];
    const messageForValue = value => (specRuleEntry) => {
        const [rule, message] = specRuleEntry;
        if(rule(value)) {
            return null;
        } else {
            if(IsString(message)) {
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

export const getKeys = obj => Object.keys(obj);
export const getEntries = obj => Object.entries(obj);