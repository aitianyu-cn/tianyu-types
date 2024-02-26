/**@format */

import { ArrayHelper } from "../../../src/utilities/core/object/ArrayHelper";

describe("aitianyu-cn.node-module.tianyu-types.core.object.Operator", () => {
    describe("ArrayHelper", () => {
        describe("merge", () => {
            it("no parameter assigned", () => {
                const result = ArrayHelper.merge();
                expect(result.length).toEqual(0);
            });

            it("merge multiple arrays and objects", () => {
                const obj1 = { test: 1 };
                const obj2 = { ttt: 2 };

                const str1 = "test string 1";
                const str2 = "test string 2";

                const arr1 = [obj1, str1, "test string 4"];
                const arr2 = [str2, "test string 3", obj2];

                const result = ArrayHelper.merge(obj1, str1, arr1, arr2, str2);

                expect(result.length).toEqual(6);

                expect(result.includes(obj1)).toBeTruthy();
                expect(result.includes(str1)).toBeTruthy();
                expect(result.includes(str2)).toBeTruthy();
                expect(result.includes("test string 3")).toBeTruthy();
                expect(result.includes("test string 4")).toBeTruthy();
                expect(result.includes(obj2)).toBeTruthy();
            });
        });
    });
});
