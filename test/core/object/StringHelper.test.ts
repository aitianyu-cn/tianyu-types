/**@format */

import { StringHelper } from "../../../src/core/object/StringHelper";

describe("aitianyu-cn.node-module.tianyu-types.core.object.StringHelper", () => {
    describe("format", () => {
        it("if args is undefined, get source directly", () => {
            const source = "test {0} is test";
            const target = StringHelper.format(source);
            expect(target).toEqual(target);
        });

        it("format normal", () => {
            const source = "test ''{0} is test {}";
            const target = StringHelper.format(source, [123]);
            expect(target).toEqual("test '123 is test ");
        });
    });

    it("stringify", () => {
        expect(StringHelper.stringify(undefined)).toEqual("undefined");
        expect(() => {
            StringHelper.stringify(() => undefined);
        }).toThrow();
        expect(StringHelper.stringify("123")).toEqual("123");
        expect(StringHelper.stringify(123)).toEqual("123");
        expect(StringHelper.stringify(BigInt(123))).toEqual("123");
        expect(StringHelper.stringify(Symbol("123"))).toEqual("Symbol(123)");
        expect(StringHelper.stringify(true)).toEqual("true");
        expect(StringHelper.stringify({ a: "123" })).toEqual(`{"a":"123"}`);
    });

    describe("stringifySafe", () => {
        it("success", () => {
            expect(StringHelper.stringifySafe({ a: "123" })).toEqual(`{"a":"123"}`);
        });

        it("failed", () => {
            expect(StringHelper.stringifySafe(() => undefined)).toEqual("");
        });
    });
});
