/**@format */

import { hash } from "../../src/utilities/security/Hash";

describe("aitianyu-cn.node-module.tianyu-storage.security.hash", () => {
    it("get guid success and should not duplicate", () => {
        const hashCode = hash("123456");
        expect(hashCode).not.toEqual(0);
    });
});
