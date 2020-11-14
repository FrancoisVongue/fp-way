import {ApplyTo, Curry, Exists, IfElse, Pipe, Unless} from "../core";
import {
    forEach,
    IntersectionBetween,
    MapArr,
    Select,
    SubtractArr
} from "../transformation/array";
import {
    ExcludeProps,
    GetEntries,
    GetKeys,
    Increment,
    IsArray,
    IsString,
    WithDefault
} from "../..";
import {Entry, Predicate} from "../core.types";

export interface ISpecSummary {
    errorCount?: number,
    missing?: string[],
    [key: string]: any,
}
export interface ICheckPropsResult {
    missing: string[],
    propsToCheck: string[],
}
export interface IValidationOptions {
    optionalProps?: string[], // check IF present, [ optional | empty ]
    maxErrors?: number,
    errorHandler?: (e: Error) => string
}

export type ISpec<T1 extends object> = Partial<Record<keyof T1, any>> & {
    __options?: IValidationOptions
}
export type IPropRuleEntry = Entry<Predicate<any>, string | ((any) => string)>

export const preCheckProps = <T1 extends object>(spec: ISpec<T1>, obj: {[key: string]: any}): ICheckPropsResult => {
    const reservedSpecTypeProps = ['__options'];
    const declaredPropsToCheck = SubtractArr(reservedSpecTypeProps, GetKeys(spec));

    if(!IsObject(obj)) {
        return {
            missing: declaredPropsToCheck,
            propsToCheck: [],
        }
    }

    const optionalProps = spec.__options?.optionalProps ?? [];
    const requiredProps = SubtractArr(optionalProps, declaredPropsToCheck);
    const presentProps = Pipe([
        GetEntries,
        Select(([key, value]) => Exists(value)),
        MapArr(([key, value]) => key),
    ])(obj);
    const missingRequiredProps = SubtractArr(presentProps, requiredProps);
    const propsToCheck = IntersectionBetween(declaredPropsToCheck, presentProps);
    
    return {
        missing: missingRequiredProps,
        propsToCheck: propsToCheck
    }
}
const optionsSetup = (userOptions: IValidationOptions): IValidationOptions => {
    const defaultOptions: IValidationOptions = {
        maxErrors: Number.MAX_SAFE_INTEGER,
        optionalProps: [],
        errorHandler: error => error.message
    }
    return WithDefault(defaultOptions, userOptions);
}
const addPropError = (propName: string, msg: string, summary: ISpecSummary) => {
    if(IsArray(summary[propName])) {
        (summary[propName] as Array<string>).push(msg);
    } else {
        summary[propName] = [msg];
    }
}
export const SpecSummary = Curry(<T1 extends object>(spec: ISpec<T1>, obj: T1): ISpecSummary => {
    const summary: ISpecSummary = {errorCount: 0};
    const options = optionsSetup(spec.__options);

    const {propsToCheck, missing} = preCheckProps(spec, obj);
    if(missing?.length > 0)  {
        summary.errorCount++;
        summary.missing = missing;
    }

    forEach(propName => {
        const value = obj[propName];
        const propSpec: IPropRuleEntry[] | ISpec<any> = spec[propName];

        if(propSpec instanceof Array) {                     // array of rules
            forEach((propRule: IPropRuleEntry) => {
                if(summary.errorCount >= options.maxErrors) // if error limit
                    return 0;

                if(IsString(summary[propName]))             // if rule errored
                    return 0;

                const rule = propRule[0];
                const msgOrFn = propRule[1];

                try {
                    if(!rule(value)) {
                        const msg = Unless(IsString, ApplyTo(value))(msgOrFn);
                        summary.errorCount++;
                        addPropError(propName, msg, summary);
                    }
                } catch (e) {                               // if rule errors
                    summary.errorCount++;
                    summary[propName] = options.errorHandler(e);
                }
            }, propSpec);
        } else {                                            // nested spec
            const nestedSummary = SpecSummary(propSpec, obj[propName]);
            summary.errorCount += nestedSummary.errorCount;
            summary[propName] = ExcludeProps(['errorCount'], nestedSummary);
        }
    }, propsToCheck);

    return summary;
});
export const IsObject = o => o instanceof Object;
