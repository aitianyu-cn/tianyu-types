/**@format */

import { guid } from "../../src/security/Guid";

describe("aitianyu-cn.node-module.tianyu-types.security.guid", () => {
    it("get guid success and should not duplicate", () => {
        (global.performance as any) = undefined;

        const guid1 = guid();
        const guid2 = guid();

        expect(guid1.length).toEqual(36);
        expect(guid2.length).toEqual(36);
        expect(guid1).not.toEqual("00000000-0000-4000-0000-000000000000");
        expect(guid2).not.toEqual("00000000-0000-4000-0000-000000000000");
        expect(guid1).not.toEqual(guid2);
    });
    it("get guid with none type", () => {
        (global.performance as any) = undefined;

        const guid1 = guid("none");

        expect(guid1.length).toEqual(32);
    });
});
