import {Curry, Exists, InCase, Pipe, Return, TRUE} from "../core";
import {Exclude, MapArr, SubtractArr} from "./array";
import {ContainedIn, IsObject} from "../..";

export const PickProps = Curry((props: string[], obj) => { // todo: add Swap (pickFrom)
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
    return InCase([
        [IsObject, Return({...def, ...obj})],
        [Exists, () => {throw new Error('WithDefault: obj must be an object')}],
        [TRUE, Return({...def})],
    ], obj);
});
// export const RecursiveMerge = Curry((from, to) => {
//
// });
export const GetKeys = obj => Object.keys(obj);
export const GetEntries = obj => Object.entries(obj);
