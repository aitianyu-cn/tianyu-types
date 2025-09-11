/** @format */

import { Bytes } from "src/core/object/Bytes";

describe("aitianyu-cn.node-module.tianyu-types.core.object.Bytes", () => {
    it("random", () => {
        const bytes = Bytes.random(10);
        expect(bytes.byteLength).toEqual(10);
    });
});
