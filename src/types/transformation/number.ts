import { Compose, Curry, When } from "../core";
import { IsNegative } from "../validation/number";

export const NegateNumber = v => -v;
export const Increment = v => v + 1;
export const Decrement = v => v - 1;
export const Abs = When(IsNegative, NegateNumber);
export const Max = Curry((maxNumber, n2) => n2 > maxNumber ? maxNumber : n2);
export const Min = Curry((minNumber, n2) => n2 < minNumber ? minNumber : n2);
export const Add = Curry((a, b) => a + b);
export const Subtract = Curry((a, b) => b - a );
export const Difference = Curry((a, b) => Compose([Abs, Subtract(a)])(b));
export const MultiplyBy = Curry((a, b) => b * a );
export const DivideBy = Curry((a, b) => b / a );
export const RemainderOf = Curry((a, b) => b % a);
export const Pow = Curry((extent, a) => a**extent);