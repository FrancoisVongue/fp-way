import {DTO, Entries} from "../core.types";
import {InCase, Return, TRUE} from "../core";

export const ObjectFromEntries = (entries: Entries<string, any>): DTO =>
    [...entries].reduce((b, [key, value]) => {
        b[key] = value;
        return b;
    }, {});

export const DeepCopy = (obj: DTO | any[]) => {
    const newObj = {};
    const properties = Object.getOwnPropertyNames(obj);
    properties.forEach(p => {
        InCase([
            [p => Array.isArray(obj[p]),
                p => {
                    newObj[p] = (obj[p] as any[])
                        .map(v => {
                            return InCase([
                                [v => typeof v === "object", v => DeepCopy(v)],
                                [v => Array.isArray(v), v => DeepCopy(v)],
                                [TRUE, Return(v)]
                            ], v);
                        })
                }
            ],
            [p => typeof obj[p] === "object", p => {newObj[p] = DeepCopy(obj[p])}],
            [TRUE, p => {newObj[p] = obj[p]}],
        ], p);
    });

    return newObj;
}
