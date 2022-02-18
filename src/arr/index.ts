import {Curry} from "../core";

export namespace arr {
    export const OfValues = <T>(...v: T[]) => [...v];
    export const OfLength = Curry((n: number) => Array(n).fill(0));
    export const FromRange = Curry((start: number, finish: number, step: number): number[] => {
        if(start >= finish || step <= 0) {
            throw Error(`Invalid input to FromRange: start:${start} finish:${finish} step:${step}`)
        }
        
        const result: number[] = []
        
        let current = start;
        while(current <= finish) {
            result.push(current)
            current += step;
        }
        
        return result
    });
}