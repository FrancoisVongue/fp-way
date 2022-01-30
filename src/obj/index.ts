import {Curry, Exists, InCase, IsOfType, Return, Swap, TRUE, Variable} from "../core";

export namespace obj {
    export const Keys = <T1 extends {}>(obj: T1) => Object.keys(obj) as (keyof T1)[];
    export const Entries = (obj: object) => Object.entries(obj);
    
    export const DeepCopy = <T1 extends {}>(obj: T1): T1 => {
        const newObj = {} as T1;
        const properties = Object.getOwnPropertyNames(obj);
        
        properties.forEach((prop: string) => {
            const value = obj[prop];
            newObj[prop] = InCase([
                [IsOfType("array"), a => a.map(DeepCopy)],
                [IsOfType("object"), DeepCopy],
                [TRUE, Variable()],
            ], value);
        });

        return newObj;
    };
    export const WithDefault = Curry((def: {}, obj: {}) => {
        const objCopyu = DeepCopy(obj);
        const defCopy = DeepCopy(def);
        const objProps = Object.getOwnPropertyNames(obj);
        const defProps = Object.getOwnPropertyNames(def);
        const allProps = [...new Set([...objProps, ...defProps])];
        
        for(const key of allProps) {
            objCopyu[key] = InCase([
                [([defv, v]) => [defv, v].every(IsOfType("object")), ([n, o]) => WithDefault(n, o)], // if both are objects, merge them again
                [([_, v]) => Exists(v), ([_, v]) => v],// if not, and obj has value, simply replace
                [TRUE, ([defv, _]) => defv],          // if there's no value, return default
            ], [defCopy[key], objCopyu[key]])
        }
        
        return objCopyu;
    });
    export const Impose = Swap(WithDefault);
    
    export const PickProps = Curry((props: string[], obj: {}) => { 
        const newObj = {};
        const objCopy = DeepCopy(obj);
        props.forEach(p => newObj[p] = objCopy[p]);

        return newObj;
    });
    
    export const ExcludeProps = Curry((propsToExclude: string[], obj: {}) => {
        const allProps = Keys(obj);
        const props = allProps.filter(p => !propsToExclude.includes(p));
        return PickProps(props, obj as any);
    });

    // == MAPPER
    export type ObjectMapper<O1> = (value: any, obj: O1) => any;
    export type ObjectMapSpec<O1 extends {}, O2 extends {}> = {
        map: [keyof O1 | '', ObjectMapper<O1>, keyof O2][];
        transfer?: Extract<keyof O1, keyof O2>[]
    }
    export const Map = <O1 extends {}, O2 extends {}>(
        mapSpec: ObjectMapSpec<O1, O2>,
        src: O1
    ) => {
        const result = {} as O2;
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
    }
    
    // == VALIDATOR
    export type ValidationSummary<T1> = {
        valid: boolean,
        errorCount: number,
        missingProperties: string[],
        redundantProperties: string[],
        errors?: Record<keyof T1, any>
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
        optionalProps?: (keyof T)[] | true,
    }
    export type ValidationPropertyRule<T1 extends {}> = [
        (a: any, T1) => boolean, 
        string | ((v: any, k: keyof T1) => string)
    ];
    export const ValidationOptionsSym: unique symbol = Symbol.for('fp-way-validation-options');
    export type ValidationSpec<T1 extends {}> = Partial<Record<keyof T1, ValidationPropertyRule<T1> | any>>
        & { [ValidationOptionsSym]: ValidationOptions<T1> };
    export const Validate = () => {}
}