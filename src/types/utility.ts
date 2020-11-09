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
