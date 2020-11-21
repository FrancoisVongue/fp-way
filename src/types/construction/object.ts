import {DTO, Entries} from "../core.types";

export const ObjectFromEntries = (entries: Entries<string, any>): DTO =>
    [...entries].reduce((b, [key, value]) => {
        b[key] = value;
        return b;
    }, {});
