import {Curry, Exists, FALSE, InCase, Is, IsOfType, Pipe, Return, Swap, TRUE, Variable, When, ReturnAsIs} from "../core";
import { DataObject, Unary, DeepPartial } from "../core.types";

export namespace obj {
    export const Keys = <T1 extends DataObject>(obj: T1): (keyof T1)[] => Object.keys(obj);
    export const Entries = <T1 extends DataObject>(obj: T1): [(keyof T1), any][] => Object.entries(obj);
    
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
    export type ObjectMapSpec<O1 extends {}, O2 extends {}> = {
        map: [keyof O1 | '', ObjectMapper<O1>, keyof O2][];
        transfer?: Extract<keyof O1, keyof O2>[]
    }
    export const Map: {
        <O1 extends {}, O2 extends {}>(
            mapSpec: ObjectMapSpec<O1, O2>,
            src: O1
        ): O2

        <O1 extends {}, O2 extends {}>(
            mapSpec: ObjectMapSpec<O1, O2>,
        ): Unary<O1, O2>
    } = Curry((mapSpec, src) => {
        const result = {};
        const mappedProps = new Set();

        for(let row of mapSpec.map) {
            const [sourceProp, mapper, destinationProp] = row;
            mappedProps.add(sourceProp);
            mappedProps.add(destinationProp);

            result[destinationProp] = sourceProp 
                ? mapper(src[sourceProp], src)
                : mapper(null, src);
        }

        if(mapSpec.transfer) {
            for(const prop of mapSpec.transfer) {
                result[prop as any] = src[prop];
            }
        }

        return result;
    });
    
    // == VALIDATOR
    export type ValidationSummary<T1> = {
        valid: boolean,
        errorCount: number,
        missingProperties: string[],
        redundantProperties: string[],
        errors?: Record<keyof T1, any>
    }
    namespace _ValidationSummary {
        export const addErr = (k, msg, summary: ValidationSummary<any>) => {
            if(IsOfType('array', summary.errors[k])) {
                (summary.errors[k]).push(msg);
            } else {
                summary.errors[k] = [msg];
            }
            incErrCount(summary);
            setInvalid(summary);
        }
        export const incErrCount = (s: ValidationSummary<any>) => ++s.errorCount;
        export const setInvalid = (s: ValidationSummary<any>) => s.valid = false;
        export const New = <T1>(): ValidationSummary<T1> => {
            return {
                valid: true,
                errorCount: 0,
                missingProperties: [],
                redundantProperties: [],
            }
        }
        export const handleRuleException = (
            summary: ValidationSummary<any>,
            key, 
            value, 
            ruleIndex, 
            handler: ValidationOptions<any>["errorHandler"], 
            e: Error
        ) => {
            const errMsg = handler({
                key: key,
                error: e,
                value: value,
                ruleIndex: ruleIndex,
            })
            addErr(key, errMsg, summary);
        }
    }
    export type ValidationException = {
        key: string,
        value: any,
        ruleIndex: number,
        error: Error
    }
    export type ValidationOptions<T extends {}> = {
        stopWhen?: (summary: ValidationSummary<T>) => boolean,
        errorHandler?: (e: ValidationException) => string,
        invalidWhen?: (summary: ValidationSummary<T>) => boolean,
        redundantIsError?: boolean,
        optionalProps?: (keyof T)[] | '*',
    }
    type PopulatedValidationOptions<T1 extends {}> = Required<ValidationOptions<T1>>;
    const defaultValidationOptions: ValidationOptions<any> = {
        optionalProps: [],
        redundantIsError: true,
        stopWhen: FALSE,
        errorHandler: ({key}) => `Could not validate property: ${key}`,
        invalidWhen: summary => summary.errorCount > 0,
    }
    export type ValidationPropertyRule<T1 extends {}> = [
        (v: any, o: T1) => boolean, 
        string | ((v: any, k: keyof T1) => string)
    ];
    export const ValidationOptionsSym: unique symbol = Symbol.for('fp-way-validation-options');
    export type ValidationSpec<T1 extends DataObject> = 
        & Partial<Record<keyof T1, ValidationPropertyRule<T1>[] | any>>
        & { [ValidationOptionsSym]: ValidationOptions<T1> };
    export type _CheckPropsResult = {
        missing: string[],
        redundant: string[],
        propsToCheck: string[],
    }
    export const _validationPreCheckProps = <T1 extends {}>(
        spec: ValidationSpec<T1>, 
        o: {}
    ): _CheckPropsResult => {
        const declaredPropsToCheck = Keys(spec);
        const desiredOptionalProps = spec[ValidationOptionsSym].optionalProps;
        const optionalProps: string[] = When(
            Is('*'), 
            Return(declaredPropsToCheck), 
            desiredOptionalProps
        );
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
    
    export const Validate = <T1 extends {}>(
        spec: ValidationSpec<T1>,
        o: T1
    ): ValidationSummary<T1> => {
        const options = WithDefault(defaultValidationOptions, spec[ValidationOptionsSym]) as PopulatedValidationOptions<T1>;
        const summary: ValidationSummary<T1> = _ValidationSummary.New();
        const {propsToCheck, missing, redundant} = _validationPreCheckProps(spec, obj);
        if(missing.length) {
            _ValidationSummary.incErrCount(summary);
            summary.missingProperties = missing;
        }
        if(redundant.length) {
            if(options.redundantIsError) {
                _ValidationSummary.incErrCount(summary);
            }
            summary.redundantProperties = redundant;
        }
        
        for(const ptc of propsToCheck) {
            if(options.stopWhen(summary)) { return summary; }
            
            const keySpec: ValidationPropertyRule<T1>[] = spec[ptc];
            if(IsOfType('array', keySpec)) {
                for(const rule of keySpec) {
                    const [validator, msgOrFn] = rule;
                    const v = o[ptc];
                    const rulePass = validator(v, o);
                    
                    if(!rulePass) {
                        const message: string = InCase([
                            [IsOfType('string'), Variable()],
                            [TRUE, f => f(v, ptc)],
                        ], msgOrFn)
                        
                        _ValidationSummary.addErr(ptc, message, summary);
                    }
                }
            } else {
                
            }
        }
    }
}