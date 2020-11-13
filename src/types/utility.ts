import {Return} from "./core";

export const serialize = v => JSON.stringify(v);
export const serializeInvalidValue = v => `<${serialize(v)}>`
export const enum Type {
    Boolean = "Boolean",
    Number = "Number",
    String = "String",
}

export class ErrorBase extends Error {
    constructor(message, name = null) {
        super(message);
        this.message = message;
        this.name = name || this.constructor.name;
        Error.captureStackTrace(this, TranslationError);
    }
}
export class TranslationError extends ErrorBase {
    constructor(fromType, toType, value) {
        const message = `Could not translate from ${fromType} ${serializeInvalidValue(value)} to ${toType} type.`;
        super(message);
    }
}

/*
merges two arrays of arguments that may contain Skip() variable
* see docs for more information*/
export const Skip = Return(Symbol.for("fp-way-skip"));
export const skipMerge = (arr1, arr2) => {
    const resultOfMerge = [];

    const pushToResult = v => resultOfMerge.push(v);
    const isSkip = v => v === Skip();
    let arr2Cursor = 0;

    for (let i = 0; i < arr1.length; i++) {
        if (isSkip(arr1[i]) && arr2Cursor < arr2.length) {
            if (isSkip(arr2[arr2Cursor])) {
                pushToResult(Skip());
            } else {
                pushToResult(arr2[arr2Cursor]);
            }
            arr2Cursor++;
        } else {
            pushToResult(arr1[i]);
        }
    }
    if (arr2Cursor < arr2.length) {
        resultOfMerge.push(...arr2.slice(arr2Cursor));
    }

    return resultOfMerge;
}

export type Predicate<T1 extends any[]> = (...args: [...T1]) => boolean
export type Unary<T1, R> = 
    (singleArg: T1) => R 
export type Binary<T1, T2, R> = 
    (firstArg: T1, secArg: T2) => R 
export type Entry<T1, T2> = [T1, T2]
export type Entries<T,K> = Entry<T,K>[];
