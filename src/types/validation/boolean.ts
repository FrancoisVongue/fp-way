import { is } from "../..";

export const isTrue = is(true);
export const isFalse = is(false);
export const isBoolean = v => isTrue(v) || isFalse(v);