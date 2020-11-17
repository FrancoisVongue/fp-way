import {
    ApplyTo,
    Attempt,
    Curry,
    Exists,
    FALSE, Identity,
    Not,
    Pipe,
    TRUE,
    Unless,
    When
} from "../core";
import {
    ForEach,
    IntersectionBetween,
    MapArr,
    Select,
    SubtractArr
} from "../transformation/array";
import {GetEntries, GetKeys, IsArray, IsEmptyArray, IsString, WithDefault} from "../..";
import {DTO, Entry, Predicate} from "../core.types";

export interface ISpecSummary {
    __valid: boolean,
    __meta: {
        specName: string,
        errorCount: number,
        missingProperties: string[],
        redundantProperties: string[],
    }
    [key: string]: any,
}
export interface ICheckPropsResult {
    missing: string[],
    redundant: string[],
    propsToCheck: string[],
}
export interface IValidationError {
    key: string,
    value: any,
    index: number,
    error: Error
}
export interface IValidationOptions<T = DTO> {
    optionalProps?: (keyof T)[],
    stopWhen?: (summary: ISpecSummary) => boolean,
    errorHandler?: (e: IValidationError) => string,
    invalidWhen?: (summary: ISpecSummary) => boolean,
    redundantIsError?: boolean,
    specName?: string,
}

const reservedSpecTypeProps = ['__options'];
export type ISpec<T1 extends object> = Partial<Record<keyof T1, IPropRuleEntry[] | object>> & {
    __options?: IValidationOptions<T1>
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
    // @ts-ignore
) => summary.__meta[prop] = value);
const defaultOptions: IValidationOptions = {
    stopWhen: FALSE,
    optionalProps: [],
    errorHandler: ({error}) => error.message,
    invalidWhen: summary => summary.__meta.errorCount > 0,
    redundantIsError: false,
    specName: 'Specification'
}
export const SpecSummary = Curry(<T1 extends object>(spec: ISpec<T1>, obj: T1): ISpecSummary => {
    const options = WithDefault(defaultOptions, spec.__options) as IValidationOptions;
    const summary: ISpecSummary = {
        __valid: true,
        __meta: {
            specName: options.specName,
            errorCount: 0,
            missingProperties: [],
            redundantProperties: [],
        }
    };
    const setInvalid = () => summary.__valid = false;
    const incErrors = (n = 1) =>
        setMeta(
            summary,
            "errorCount",
            <number>getMeta(summary, "errorCount") + n);

    const {propsToCheck, missing, redundant} = preCheckProps(spec, obj);

    setMeta(summary, 'missingProperties', missing);
    setMeta(summary, 'redundantProperties', redundant);

    if(!IsEmptyArray(missing))
        incErrors();
    if(options.redundantIsError && !IsEmptyArray(redundant))
        incErrors();
    if(options.invalidWhen(summary))
        setInvalid();
    if(options.stopWhen(summary))
        return summary;

    ForEach(propName => {           // todo: set mark to BREAK THE CYCLE easily
        if(options.stopWhen(summary))                       // if user wants to stop
            return 0;

        const value = obj[propName];
        const propSpec: IPropRuleEntry[] | ISpec<any> = spec[propName];

        if(propSpec instanceof Array) {                     // array of rules
            ForEach((propRule: IPropRuleEntry, index: number) => {
                if(options.stopWhen(summary))               // if user wants to stop
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
                    incErrors();
                    addPropError(
                        propName,
                        options.errorHandler({
                            error: e,
                            index,
                            key: propName,
                            value: value
                        }),
                        summary);
                }

                if(options.invalidWhen(summary))
                    setInvalid();
            }, propSpec);
        } else {                                            // nested spec
            summary[propName] = SpecSummary(propSpec, obj[propName]);
            incErrors(<number>getMeta(summary[propName], "errorCount"));
        }

        if(options.invalidWhen(summary))
            setInvalid();
    }, propsToCheck);

    return summary;
});
export const IsObject = o => o instanceof Object;
