import {Curry, Exists} from "../core";
import {Exclude, SubtractArr} from "./array";
import {ContainedIn} from "../..";

export const PickProps = Curry((props: string[], obj) => {
    const newObj = {};
    props.forEach(p => newObj[p] = obj[p]);

    return newObj;
});
export const ExcludeProps = Curry((propsToExclude: string[], obj) => {
    const newObj = {};
    const propsToInclude = SubtractArr(propsToExclude, GetKeys(obj));
    propsToInclude.forEach(p => newObj[p] = obj[p]);

    return newObj;
});
export const WithDefault = Curry(<T1 extends object>(def: Partial<T1>, obj: Partial<T1>): Partial<T1> => {
    const result = {...obj};

    for(let defProp of GetKeys(def)) {
        if(!Exists(result[defProp])) {
            result[defProp] = def[defProp];
        }
    }
    
    return result;
});
export const GetKeys = obj => Object.keys(obj);
export const GetEntries = obj => Object.entries(obj);