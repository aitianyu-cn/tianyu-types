/**@format */

import { guid } from "../../src/utilities/security/Guid";

describe("aitianyu-cn.node-module.tianyu-storage.security.guid", () => {
    it("get guid success and should not duplicate", () => {
        (global.performance as any) = undefined;

        const guid1 = guid();
        const guid2 = guid();

        expect(guid1).not.toEqual("00000000-0000-4000-0000-000000000000");
        expect(guid2).not.toEqual("00000000-0000-4000-0000-000000000000");
        expect(guid1).not.toEqual(guid2);
    });
});
