import {Curry, Exists, FALSE, InCase, Is, IsOfType, Pipe, Return, Swap, TRUE, Variable, When, ReturnAsIs} from "../core";
import { DataObject, Unary, DeepPartial } from "../core.types";

export namespace obj {
    export const Keys = <T1 extends DataObject>(obj: T1): (keyof T1 & string)[] => Object.keys(obj);
    export const Entries = <T1 extends DataObject>(obj: T1): [(keyof T1 & string), any][] => Object.entries(obj);
    export const FromEntries = <T1>(entries: [string, any][]) =>
        entries.reduce((b, [k, v]) => {
            b[k] = v
            return b
        }, {})

    export const DeepCopy = <T1>(obj: T1): T1 => {
        return InCase<T1, T1>([
            [IsOfType('array'), arr => (arr as any).map(DeepCopy) as any],
            [IsOfType('object'), obj => {
                const newObj = {} as T1;
                const keys = Keys(obj as any)

                keys.forEach((prop) => {
                    const value = obj[prop];
                    newObj[prop] = DeepCopy(value);
                });

                return newObj;
            }],
            [TRUE, ReturnAsIs()]
        ], obj)
    };

    export const WithDefault: {
        <T1 extends DataObject, R extends DeepPartial<T1>>(
            def: DeepPartial<T1>,
            obj: DeepPartial<T1>,
        ): R

        <T1 extends DataObject, R extends DeepPartial<T1>>(
            def: DeepPartial<T1>,
        ): R
    } = Curry((def, obj) => {
        const objCopy = DeepCopy(obj);
        const defCopy = DeepCopy(def);
        const allProps = [...new Set([...Keys(objCopy), ...Keys(defCopy)])];

        for(const key of allProps) {
            objCopy[key] = InCase([
                [([defv, v]) => [defv, v].every(IsOfType("object")), ([n, o]) => WithDefault(n, o)], // if both are objects, merge them again
                [([_, v]) => Exists(v), ([_, v]) => v],// if not, and obj has value, simply replace
                [TRUE, ([defv, _]) => defv],          // if there's no value, return default
            ], [defCopy[key], objCopy[key]])
        }

        return objCopy;
    });

    export const Impose: {
        <T1 extends DataObject, R extends DeepPartial<T1>>(
            def: DeepPartial<T1>,
            obj: DeepPartial<T1>,
        ): R

        <T1 extends DataObject, R extends DeepPartial<T1>>(
            def: DeepPartial<T1>,
        ): R
    } = Swap(WithDefault);

    export const Pick: {
        <T1 extends DataObject>(
            keys: (keyof T1)[],
            obj: T1
        ): Partial<T1>

        <T1 extends DataObject>(
            keys: (keyof T1)[],
        ): Unary<T1, Partial<T1>>
    } = Curry((props, obj) => {
        const newObj = {};
        const objCopy = DeepCopy(obj);
        props.forEach(p => newObj[p] = objCopy[p]);

        return newObj;
    });

    export const ExcludeProps: {
        <T1 extends DataObject>(
            keys: (keyof T1)[],
            obj: T1
        ): Partial<T1>

        <T1 extends DataObject>(
            keys: (keyof T1)[],
        ): Unary<T1, Partial<T1>>
    } = Curry((propsToExclude, obj) => {
        const allProps = Keys(obj);
        const props = allProps.filter(p => !propsToExclude.includes(p));
        return Pick(props, obj);
    });

    // == MAPPER
    export type ObjectMapper<O1> = (value: any, obj: O1) => any;
    export type ObjectMapSpec<O1 extends DataObject, O2 extends DataObject> = {
        map: [keyof O1 | '', ObjectMapper<O1>, keyof O2][];
        transfer?: Extract<keyof O1, keyof O2>[]
    }
    export const Map: {
        <O1 extends DataObject, O2 extends DataObject>(
            mapSpec: ObjectMapSpec<O1, O2>,
            src: O1
        ): O2

        <O1 extends DataObject, O2 extends DataObject>(
            mapSpec: ObjectMapSpec<O1, O2>,
        ): Unary<O1, O2>
    } = Curry((mapSpec, src) => {
        const result = {};

        if(mapSpec.transfer) {
            for(const prop of mapSpec.transfer) {
                result[prop] = src[prop];
            }
        }

        for(let row of mapSpec.map) {
            const [sourceProp, mapper, destinationProp] = row;

            result[destinationProp] = sourceProp
                ? mapper(src[sourceProp], src)
                : mapper(null, src);
        }

        return result;
    });

    // == VALIDATOR
    export type ValidationSummary<T1> = {
        valid: boolean,
        errorCount: number,
        missingProperties: string[],
        redundantProperties: string[],
        errors: Record<keyof T1, any>
    }
    namespace _ValidationSummary {
        export const incErrCount = (s: ValidationSummary<any>) => {
            s.errorCount++
            s.valid = false
        }
        export const addErr = (k, msg, summary: ValidationSummary<any>) => {
            if(IsOfType('array', summary.errors[k])) {
                (summary.errors[k]).push(msg);
            } else {
                summary.errors[k] = [msg];
            }
            incErrCount(summary);
        }
        export const New = <T1>(): ValidationSummary<T1> => {
            return {
                valid: true,
                errorCount: 0,
                missingProperties: [],
                redundantProperties: [],
                errors: {} as Record<keyof T1, any>
            }
        }
        export const mergeNestedSummary = (
            summary: ValidationSummary<any>,
            key: string,
            nestedSummary: ValidationSummary<any>,
        ) => {
            summary.valid = nestedSummary.valid && summary.valid
            summary.errorCount += nestedSummary.errorCount
            summary.missingProperties = [...summary.missingProperties, ...nestedSummary.missingProperties]
            summary.redundantProperties = [...summary.redundantProperties, ...nestedSummary.redundantProperties]
            
            const nestedErrors: [any, any][] = Entries(nestedSummary.errors)
                .map(([nestedKey, v]) => [`${key}.${nestedKey}`, v])

            summary.errors = FromEntries([
                ...Entries(summary.errors),
                ...nestedErrors
            ])
        }
    }
    export type ValidationException = {
        key: string,
        value: any,
        ruleIndex: number,
        error: Error
    }
    export type ValidationOptions<T extends DataObject> = {
        stopWhen?: (summary: ValidationSummary<T>) => boolean,
        errorHandler?: (e: ValidationException) => string,
        redundantIsError?: boolean,
        optionalProps?: (keyof T)[],
    }
    export type PopulatedValidationOptions<T1 extends DataObject> = Required<ValidationOptions<T1>>;
    export const _defaultValidationOptions: PopulatedValidationOptions<any> = {
        optionalProps: [],
        redundantIsError: true,
        stopWhen: FALSE,
        errorHandler: ({key}) => `Could not validate property: ${key}`,
    }
    export type ValidationPropertyRule<T1> = [
        (v: any, o: T1) => boolean,
            string | ((v: any, k: keyof T1) => string)
    ];
    export const ValidationOptionsSym: unique symbol = Symbol.for('fp-way-validation-options');
    export type ValidationSpec<T1 extends DataObject> =
        & Record<keyof T1, ValidationPropertyRule<T1>[] | any>
        & { [ValidationOptionsSym]?: ValidationOptions<T1> };
    export type ValidationSpecWithPopulatedOptions<T1 extends DataObject> =
        & ValidationSpec<T1>
        & { [ValidationOptionsSym]: PopulatedValidationOptions<T1> };
    export type _CheckPropsResult = {
        missing: string[],
        redundant: string[],
        propsToCheck: string[],
    }
    export const _validationPreCheckProps = <T1 extends DataObject>(
        spec: ValidationSpecWithPopulatedOptions<T1>,
        o: T1
    ): _CheckPropsResult => {
        const declaredPropsToCheck = Keys(spec);
        const optionalProps = spec[ValidationOptionsSym].optionalProps;
        const requiredProps = declaredPropsToCheck.filter(d => !optionalProps.includes(d));

        if(!IsOfType("object", o)) {
            return {
                missing: requiredProps,
                redundant: [],
                propsToCheck: [],
            }
        }

        const presentProps = Entries(o)
        .filter(([k, v]) => Exists(v))
        .map(([k, v]) => k);

        const missingRequiredProps = requiredProps.filter(r => !presentProps.includes(r));
        const redundantProps = presentProps.filter(p => !declaredPropsToCheck.includes(p));
        const propsToCheck = presentProps.filter(p => declaredPropsToCheck.includes(p));

        return {
            missing: missingRequiredProps,
            propsToCheck: propsToCheck,
            redundant: redundantProps,
        }
    }

    export const Validate = <T1 extends DataObject>(
        spec: ValidationSpec<T1>,
        obj: T1
    ): ValidationSummary<T1> => {
        const options = WithDefault<
            ValidationOptions<any>,
            PopulatedValidationOptions<T1>>
        (
            _defaultValidationOptions,
            spec[ValidationOptionsSym] ?? {}
        );
        const populatedSpec = (spec[ValidationOptionsSym] = options, spec) as ValidationSpecWithPopulatedOptions<T1>

        const summary: ValidationSummary<T1> = _ValidationSummary.New();
        const {propsToCheck, missing, redundant} = _validationPreCheckProps(populatedSpec, obj);
        if(missing.length) {
            _ValidationSummary.incErrCount(summary);
            summary.missingProperties = missing;
        }
        if(redundant.length) {
            summary.redundantProperties = redundant;
            if(options.redundantIsError) {
                _ValidationSummary.incErrCount(summary);
            }
        }

        for(const [i, ptc] of propsToCheck.entries()) {
            if(options.stopWhen(summary)) { return summary; }

            const keySpec: ValidationPropertyRule<T1>[] | ValidationSpec<any> = spec[ptc];
            const value = obj[ptc];

            if(IsOfType('array', keySpec)) {
                for(const rule of keySpec as ValidationPropertyRule<T1>[]) {
                    const [validator, msgOrFn] = rule;
                    let rulePass;
                    try {
                        rulePass = validator(value, obj);
                    } catch(e){
                        const message = options.errorHandler({key: ptc, value, ruleIndex: i, error: e})
                        _ValidationSummary.addErr(ptc, message, summary)
                        continue;
                    }

                    if(!rulePass) {
                        const message: string = InCase([
                            [IsOfType('string'), ReturnAsIs()],
                            [TRUE, f => f(value, ptc)],
                        ], msgOrFn)

                        _ValidationSummary.addErr(ptc, message, summary);
                    }
                }
            } else {
                const nestedSummary = Validate(keySpec as ValidationSpec<T1>, value)
                _ValidationSummary.mergeNestedSummary(summary, ptc, nestedSummary)
            }
        }
        
        return summary;
    }
}