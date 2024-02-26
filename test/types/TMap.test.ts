/**@format */

import { PathBase } from "../../src/types/PathBase";
import { TMap } from "../../src/types/TMap";

describe("aitianyu-cn.node-module.tianyu-types.types.TMap", () => {
    const map = new TMap<PathBase, string>();

    describe("Integration Test", () => {
        it("check empty", () => {
            expect(map.size()).toEqual(0);
        });

        it("set new value", () => {
            const path = new PathBase(["a", "b", "c"]);
            map.set(path, "abc");

            expect(map.size()).toEqual(1);
            expect(map.has(path)).toBeTruthy();
        });

        it("no same object key check has", () => {
            const path = new PathBase(["a", "b", "c"]);
            expect(map.has(path)).toBeTruthy();
        });

        it("set new values", () => {
            map.set(new PathBase(["a", "d", "c"]), "adc");
            map.set(new PathBase(["b", "y", "c"]), "byc");
            map.set(new PathBase(["j", "d", "c"]), "jdc");

            expect(map.size()).toEqual(4);
        });

        it("set same value", () => {
            map.set(new PathBase(["b", "y", "c"]), "byc");

            expect(map.size()).toEqual(4);
        });

        it("get", () => {
            const value1 = map.get(new PathBase(["a", "d", "c"]));
            expect(value1).toEqual("adc");

            const value2 = map.get(new PathBase(["c", "d", "c"]));
            expect(value2).toBeUndefined();
        });

        it("keys", () => {
            const keys = map.keys();
            const keyArray: string[] = [];
            for (const key of keys) {
                keyArray.push(key.getString());
            }

            expect(keyArray.length).toEqual(4);
            expect(keyArray.includes("a/b/c")).toBeTruthy();
            expect(keyArray.includes("a/d/c")).toBeTruthy();
            expect(keyArray.includes("b/y/c")).toBeTruthy();
            expect(keyArray.includes("j/d/c")).toBeTruthy();
        });

        it("values", () => {
            const values = map.values();
            const valueArray: string[] = [];
            for (const value of values) {
                valueArray.push(value);
            }

            expect(valueArray.length).toEqual(4);
            expect(valueArray.includes("abc")).toBeTruthy();
            expect(valueArray.includes("adc")).toBeTruthy();
            expect(valueArray.includes("byc")).toBeTruthy();
            expect(valueArray.includes("jdc")).toBeTruthy();
        });

        it("delete", () => {
            const del1 = map.delete(new PathBase(["b", "y", "c"]));
            expect(del1).toBeTruthy();
            expect(map.size()).toEqual(3);
            expect(map["_kMap"].size).toEqual(3);
            expect(map["_map"].size).toEqual(3);
        });

        it("delete not exists", () => {
            const del1 = map.delete(new PathBase(["b", "y", "c"]));
            expect(del1).toBeFalsy();
            expect(map.size()).toEqual(3);
            expect(map["_kMap"].size).toEqual(3);
            expect(map["_map"].size).toEqual(3);
        });

        it("forEach", () => {
            let index = 0;
            const mappingValues: string[] = [];
            map.forEach((value: string, key: PathBase, fmap: Map<PathBase, string>) => {
                ++index;

                const keyStr = key.getDirs().join("");
                expect(value).toEqual(keyStr);
                expect(fmap.size).toEqual(index);

                mappingValues.push(value);
            });

            expect(index).toEqual(3);
            expect(mappingValues.length).toEqual(3);
            expect(mappingValues.includes("abc")).toBeTruthy();
            expect(mappingValues.includes("adc")).toBeTruthy();
            expect(mappingValues.includes("jdc")).toBeTruthy();
        });

        it("Symbol.iterator", () => {
            let index = 0;
            const mappingValues: string[] = [];
            for (const [path, value] of map) {
                if (!!!path) {
                    continue;
                }

                ++index;

                const keyStr = path.getDirs().join("");
                expect(value).toEqual(keyStr);

                value && mappingValues.push(value);
            }

            expect(index).toEqual(3);
            expect(mappingValues.length).toEqual(3);
            expect(mappingValues.includes("abc")).toBeTruthy();
            expect(mappingValues.includes("adc")).toBeTruthy();
            expect(mappingValues.includes("jdc")).toBeTruthy();
        });

        it("clear", () => {
            expect(map.size()).toEqual(3);
            map.clear();
            expect(map.size()).toEqual(0);
            expect(map["_kMap"].size).toEqual(0);
            expect(map["_map"].size).toEqual(0);
        });
    });
});
