/** @format */

import { Json } from "src/core/object/Json";

describe("aitianyu-cn.node-module.tianyu-types.core.object.Json", () => {
    it("parse", () => {
        expect(Json.parse(`{"a":"123"}`).a).toEqual("123");
        expect(() => {
            Json.parse("");
        }).toThrow();
    });

    describe("parseSafe", () => {
        it("success", () => {
            expect(Json.parse(`{"a":"123"}`).a).toEqual("123");
        });

        it("failed - 1", () => {
            expect(Json.parseSafe("")).toEqual(null);
        });

        it("failed - 2", () => {
            expect(Json.parseSafe("abcde123456789012345678901234567890")).toEqual(null);
        });

        it("failed when custom value", () => {
            expect(Json.parseSafe("abcde123456789012345678901234567890", "123")).toEqual("123");
        });
    });
});
