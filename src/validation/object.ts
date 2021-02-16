import {ApplyTo, Curry, Exists, FALSE, Pipe, Unless} from "../core";
import {
    ForEach,
    IntersectionBetween,
    MapArr,
    Select,
    SubtractArr
} from "../transformation/array";
import {Curried, DTO, Entry, Predicate} from "../core.types";
import {IsArray, IsEmptyArray} from "./array";
import {IsString} from "./string";

export interface ISpecSummary {
    valid: boolean,
    specName: string,
    errorCount: number,
    missingProperties?: string[],
    redundantProperties?: string[],
    errors?: {
        [key: string]: any,
    }
}
export interface IValidationError {
    key: string,
    value: any,
    index: number,
    error: Error
}
export type ISpecOptions<T = DTO> = {
    stopWhen?: (summary: ISpecSummary) => boolean,
    errorHandler?: (e: IValidationError) => string,
    invalidWhen?: (summary: ISpecSummary) => boolean,
    redundantIsError?: boolean,
    specName?: string,
    optionalProps?: (keyof T)[] | true,
    requiredProps?: (keyof T)[]
    // todo: add maxErrorsPerKey and change custom cycle to default for to BREAK easily
}

export type IPropRuleEntry<T1 = any> = Entry<Predicate<any, T1 | undefined>, string | ((any) => string)>
export const SpecOptionsSym: unique symbol = Symbol.for('fp-way-specOptions');
export type ISpec<T1 extends DTO = any> = Partial<Record<keyof T1, IPropRuleEntry<T1>[] | any>>
    & { [SpecOptionsSym]: ISpecOptions }

export interface ICheckPropsResult {
    missing: string[],
    redundant: string[],
    propsToCheck: string[],
}
export const preCheckProps = <T1 extends object>(spec: ISpec<T1>, obj: DTO): ICheckPropsResult => {
    const declaredPropsToCheck = Object.getOwnPropertyNames(spec);
    const desiredRequiredProps = spec[SpecOptionsSym].requiredProps;
    const desiredOptionalProps = spec[SpecOptionsSym].optionalProps;

    const optionalProps = desiredOptionalProps === true || Exists(desiredRequiredProps)
        ? declaredPropsToCheck
        : desiredOptionalProps?.length > 0
            ? desiredOptionalProps
            : [];
    const requiredProps = desiredRequiredProps ?? SubtractArr(optionalProps, declaredPropsToCheck);

    if(!IsObject(obj)) {
        return {
            missing: requiredProps,
            redundant: [],
            propsToCheck: [],
        }
    }

    const presentProps = Pipe([
        o => Object.entries(o),
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
    if(IsArray(summary.errors[propName])) {
        (summary[propName] as string[]).push(msg);
    } else {
        summary[propName] = [msg];
    }
}

const defaultOptions: ISpecOptions = {
    stopWhen: FALSE,
    optionalProps: [],
    errorHandler: ({key}) => `Could not validate property: ${key}`,
    invalidWhen: summary => summary.errorCount > 0,
    redundantIsError: true,
    specName: 'Object Specification'
}
export type TSpecSummary<T1 extends DTO> = (spec: ISpec<T1>, obj: T1) => ISpecSummary
export type SpecSummary<T1> = Curried<TSpecSummary<T1>>
export const SpecSummary = Curry((spec: ISpec, obj): ISpecSummary => {
    const options = Object.assign({}, defaultOptions, spec[SpecOptionsSym]);
    const summary: ISpecSummary = {
        valid: true,
        specName: options.specName,
        errorCount: 0,
    };
    const setInvalid = () => summary.valid = false;
    const incErrors = (n = 1) => summary.errorCount += n;

    const {propsToCheck, missing, redundant} = preCheckProps(spec, obj);

    if(!IsEmptyArray(missing)) {
        incErrors();
        summary.missingProperties = missing;
    }
    if(!IsEmptyArray(redundant)) {
        if(options.redundantIsError) {
            incErrors();
        }
        summary.redundantProperties = redundant;
    }

    if(options.invalidWhen(summary))
        setInvalid();
    if(options.stopWhen(summary))
        return summary;

    ForEach(propName => {
        if(options.stopWhen(summary))                       // if user wants to stop
            return 0;

        const value = obj[propName];
        const propSpec: IPropRuleEntry[] = spec[propName];

        if(propSpec instanceof Array) {                     // array of rules
            ForEach((propRule: IPropRuleEntry, index: number) => {
                if(options.stopWhen(summary))               // if user wants to stop
                    return 0;

                const rule = propRule[0];
                const msgOrFn = propRule[1];

                try {
                    if(!rule(value, obj)) {
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
export const HasProp = Curry((prop: string, obj: DTO):boolean => {
    return Exists(obj[prop]);
});
