/** @format */

import { QRCode } from "src/security/QRCode";

describe("aitianyu-cn.node-module.tianyu-types.security.QRCode", () => {
    it("success", async () => {
        const code = await QRCode.getURL("https://aitianyu.cn");
        expect(code.startsWith("data:image/png;base64,")).toBeTruthy();
    });

    it("failed", async () => {
        expect(await QRCode.getURL({} as any)).toEqual("");
    });
});
