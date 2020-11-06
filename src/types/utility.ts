export const serialize = v => JSON.stringify(v);
export const serializeInvalidValue = v => `<${serialize(v)}>`