import {
    ApplyTo,
    Curry,
    Exists,
    FALSE,
    IfElse,
    IndependentInCase, Not,
    Pipe,
    Unless, When
} from "../core";
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
    IsArray, IsEmptyArray,
    IsString,
    WithDefault
} from "../..";
import {Entry, Predicate} from "../core.types";

export interface ISpecSummary {
    __meta: {
        __errorCount: number,
        __missingProperties: string[],
        __redundantProperties: string[],
    }
    [key: string]: any,
}
export interface ICheckPropsResult {
    missing: string[],
    redundant: string[],
    propsToCheck: string[],
}
export interface IValidationOptions {
    optionalProps?: string[], // check IF present, ( empty by default )
    stopWhen?: (summary: ISpecSummary) => boolean,
    errorHandler?: (key: string, value: any, e: Error) => string
}

const reservedSpecTypeProps = ['__options'];
export type ISpec<T1 extends object> = Partial<Record<keyof T1, IPropRuleEntry[] | object>> & {
    __options?: IValidationOptions
}
export type IPropRuleEntry = Entry<Predicate<any>, string | ((any) => string)>

export const preCheckProps = <T1 extends object>(spec: ISpec<T1>, obj: {[key: string]: any}): ICheckPropsResult => {
    const declaredPropsToCheck = SubtractArr(reservedSpecTypeProps, GetKeys(spec));
    const optionalProps = spec.__options?.optionalProps ?? [];
    const requiredProps = SubtractArr(optionalProps, declaredPropsToCheck);

    if(!IsObject(obj)) {
        return {
            missing: requiredProps,
            redundant: [],
            propsToCheck: [],
        }
    }

    const presentProps = Pipe([
        GetEntries,
        Select(([key, value]) => Exists(value)),
        MapArr(([key, value]) => key),
    ])(obj);
    const missingRequiredProps = SubtractArr(presentProps, requiredProps);
    const propsToCheck = IntersectionBetween(declaredPropsToCheck, presentProps);
    const redundantProps = SubtractArr(declaredPropsToCheck, presentProps);
    
    return {
        missing: missingRequiredProps,
        propsToCheck: propsToCheck,
        redundant: redundantProps,
    }
}
const addPropError = (propName: string, msg: string, summary: ISpecSummary) => {
    if(IsArray(summary[propName])) {
        (summary[propName] as Array<string>).push(msg);
    } else {
        summary[propName] = [msg];
    }
}
const getMeta = Curry((
    summary: ISpecSummary,
    prop: keyof ISpecSummary["__meta"]
) => summary.__meta[prop]);
const setMeta = Curry((
    summary: ISpecSummary,
    prop: keyof ISpecSummary["__meta"],
    value: any
) => summary.__meta[prop] = value);
const defaultOptions: IValidationOptions = {
    stopWhen: FALSE,
    optionalProps: [],
    errorHandler: (key, value, error) => error.message,
}
export const SpecSummary = Curry(<T1 extends object>(spec: ISpec<T1>, obj: T1): ISpecSummary => {
    const options = WithDefault(defaultOptions, spec.__options) as IValidationOptions;
    const summary: ISpecSummary = {
        __meta: {
            __errorCount: 0,
            __missingProperties: [],
            __redundantProperties: [],
        }
    };
    const incErrors = (n = 1) =>
        setMeta(
            summary,
            "__errorCount",
            <number>getMeta(summary, "__errorCount") + n);

    const {propsToCheck, missing, redundant} = preCheckProps(spec, obj);

    When(Not(IsEmptyArray), setMeta(summary, "__missingProperties"), missing);
    When(Not(IsEmptyArray), setMeta(summary, "__redundantProperties"), redundant);

    if(options.stopWhen(summary))
        return summary;

    forEach(propName => {
        const value = obj[propName];
        const propSpec: IPropRuleEntry[] | ISpec<any> = spec[propName];
        const errorsBeforePropCheck = <number>getMeta(summary, "__errorCount");

        if(options.stopWhen(summary))                       // if user wants to stop
            return 0;

        if(propSpec instanceof Array) {                     // array of rules
            forEach((propRule: IPropRuleEntry) => {
                if(options.stopWhen(summary))               // if user wants to stop
                    return 0;

                if(IsString(summary[propName]))             // if rule errored
                    return 0;

                const rule = propRule[0];
                const msgOrFn = propRule[1];

                try {
                    if(!rule(value)) {
                        const msg = Unless(IsString, ApplyTo(value))(msgOrFn);
                        incErrors();
                        addPropError(propName, msg, summary);
                    }
                } catch (e) {                               // if rule errors
                    setMeta(summary, "__errorCount", errorsBeforePropCheck + 1);
                    summary[propName] = options.errorHandler(propName, value, e);
                }
            }, propSpec);
        } else {                                            // nested spec
            summary[propName] = SpecSummary(propSpec, obj[propName]);
            incErrors(<number>getMeta(summary[propName], "__errorCount"));
        }
    }, propsToCheck);

    return summary;
});
export const IsObject = o => o instanceof Object;
