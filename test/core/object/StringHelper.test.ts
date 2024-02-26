/**@format */

import { StringHelper } from "../../../src/utilities/core/object/StringHelper";

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
});
