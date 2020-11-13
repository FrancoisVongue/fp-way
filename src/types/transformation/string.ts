export const toUpperCase = (s: string) => s.toUpperCase();
export const toLowerCase = (s: string) => s.toLowerCase();
export const split = (splitter, str) => (str as string).split(splitter);
export const concat = (s1, s2) => s1 + s2; 
export const serialize = v => JSON.stringify(v);
export const serializeInvalidValue = v => `<${serialize(v)}>`
export const enum Type {
    Boolean = "Boolean",
    Number = "Number",
    String = "String",
}