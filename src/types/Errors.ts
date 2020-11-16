import {serialize} from "./transformation/string";

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
        const message = `Could not translate from ${fromType} <${serialize(value)}> to ${toType} type.`;
        super(message);
    }
}
