import {Unary} from "./core.types";
import {Call, Exists, IfElse, Return, When} from "./core";

export class PointedFunctor<T> {
    constructor(protected value: T) {}

    static of<T>(v: T): PointedFunctor<T> {return new PointedFunctor(v)}
    valueOf(): T { return this.value }
    map<R>(f: Unary<T, R>): PointedFunctor<R> {
        return PointedFunctor.of( f(this.value) );
    }
}

export class Nothing {
    isNothing() {
        return true;
    }
    toString() {
        return "Nothing";
    }
    map(f) {
        return this;
    }
}
export class Just<T> extends PointedFunctor<T> {
    isNothing(){
        return false;
    }
    toString() {
        return `Just ${this.value}`
    }
    map(f) {
        return Maybe.of(f(this.value))
    }
    static of<T>(v: T): Just<T> {return new Just<T>(v);}
}
export class Maybe<T> extends PointedFunctor<T> {
    private constructor(protected value: T) {super(value)};
    static of<T>(v: T): Maybe<T> {
        return IfElse(Exists,
                Call(Just.of),
                Return(new Nothing()), v);
    }
}
