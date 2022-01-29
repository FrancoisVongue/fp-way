import {Const, Curry, InCase, IsOfType, Return, TRUE, When} from "../core";

export namespace num {
    // validate
    export const IsNum = IsOfType("number");
    export const IsInt = (n: number) => n%1 === 0;
    export const Gt = Curry((n1, n2) => n2 > n1 );
    export const Gte = Curry((n1, n2) => n2 >= n1 );
    export const Lt = Curry((n1, n2) => n2 < n1 );
    export const Lte = Curry((n1, n2) => n2 <= n1 );
    export const IsPos = v => v > 0;
    export const IsNeg = v => v < 0;
    export const IsNaN = n => Number.isNaN(n);
    export const InRangeInc = Curry((min: number, max: number, v: number) => {
        return v <= max && v >= min;
    });
    export const InRangeEx = Curry((min: number, max: number, v: number) => {
        return v < max && v > min;
    });
    
    // transform
    export const Negate = (v: number) => -v;
    export const Inc = (v: number) => v + 1;
    export const Dec = (v: number) => v - 1;
    export const LessOr = Curry((max: number, n2: number) => n2 > max ? max : n2);
    export const MoreOr = Curry((min: number, n2: number) => n2 < min ? min : n2);
    export const Add = Curry((a: number, b: number) => a + b);
    export const Subtr = Curry((a: number, b: number) => b - a);
    export const Diff = Curry((a: number, b: number) => Math.abs(a - b));
    export const MulBy = Curry((a: number, b: number) => b * a);
    export const DivBy = Curry((a: number, b: number) => b / a);
    export const Mod = Curry((a: number, b: number) => b % a);
    export const ToExtent = Curry((extent: number, a: number) => a**extent);
    export const Floor = (n: number) => Math.floor(n);
    export const Ceil = (n: number) => Math.ceil(n);
    export const ToInt = (v: number) => InCase([
        [IsPos, Floor],
        [IsNeg, Ceil],
        [TRUE, Const(0)]
    ], v);
    export const Abs = When(IsPos, Negate);
}