/**@format */

import { Exception } from "../../src/types/Exception";

describe("aitianyu-cn.node-module.tianyu-types.types.Errors", () => {
    it("ArgumentNullOrEmptyException", () => {
        try {
            throw new Exception("abc");
        } catch (e) {
            expect(e?.toString()).toEqual("abc");
        }
    });
});
