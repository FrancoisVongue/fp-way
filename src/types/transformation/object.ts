import {Curry, Exists, InCase, Pipe, Return, TRUE} from "../core";
import {Exclude, Head, MapArr, SubtractArr, Tail} from "./array";
import {ContainedIn, IsObject} from "../..";
import {DTO} from "../core.types";

export const PickProps = Curry((props: string[], obj) => { // todo: add Swap (pickFrom)
    const newObj = {};
    props.forEach(p => newObj[p] = obj[p]);

    return newObj;
});
export const PickAProp = Curry((prop: string, obj: DTO) => {
    return obj[prop];
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
export const GetKeys = obj => Object.keys(obj);
export const GetEntries = obj => Object.entries(obj);
export const GetByPath = Curry((path: string[], obj: DTO) => {
    if(path.length > 1) {
        const currentProp = Head(path);
        const pathRemainder = Tail(path);
        const currentLevel = obj[currentProp];
        if(IsObject(currentLevel))
            return GetByPath(currentLevel, pathRemainder);
        else
            return currentLevel
    } else if(path.length == 1) {
        const currentProp = Head(path);
        return obj[currentProp];
    } else {
        return obj;
    }
});
export const SetByPath = Curry((path: string[], obj: DTO, value: any) => {
    if(path.length > 1) {
        const currentProp = Head(path);
        const pathRemainder = Tail(path);
        const currentLevel = obj[currentProp];
        if(IsObject(currentLevel)) {
            SetByPath(currentLevel, pathRemainder, value);
            return obj;
        } else {
            return obj;
        }
    } else if(path.length == 1) {
        const currentProp = Head(path);
        obj[currentProp] = value;
        return obj;
    } else {
        return obj;
    }
});

