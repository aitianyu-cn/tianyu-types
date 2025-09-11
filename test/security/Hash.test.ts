/**@format */

import { hash } from "../../src/security/Hash";

describe("aitianyu-cn.node-module.tianyu-types.security.hash", () => {
    it("get guid success and should not duplicate", () => {
        const hashCode = hash("123456");
        expect(hashCode).not.toEqual(0);
    });
});
