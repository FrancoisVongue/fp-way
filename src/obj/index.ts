import {Curry, Exists, InCase, IsOfType, Return, Swap, TRUE, Variable} from "../core";

export namespace obj {
    export const Keys = (obj: object) => Object.keys(obj);
    export const Entries = (obj: object) => Object.entries(obj);
    
    export const DeepCopy = (obj: object) => {
        const newObj = {};
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
    }) as <T1 extends {}>(props: (keyof T1)[], obj: T1) => Partial<T1>;
    
    export const ExcludeProps = Curry((propsToExclude: string[], obj: {}) => {
        const allProps = Keys(obj);
        const props = allProps.filter(p => !propsToExclude.includes(p));
        return PickProps(props, obj as any);
    }) as <T1 extends {}>(props: (keyof T1)[], obj: T1) => Partial<T1>;
}