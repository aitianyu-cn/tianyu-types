/** @format */

import fs from "fs";
import path from "path";
import { SHA } from "src/security/SHA";

describe("aitianyu-cn.node-module.tianyu-types.security.SHA", () => {
    it("text", () => {
        expect(SHA.sha256("test").toString("hex").toLowerCase()).toEqual(
            "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
        );
        expect(SHA.sha512("test").toString("hex").toLowerCase()).toEqual(
            "ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff",
        );
        expect(SHA.sha256(Buffer.from("test", "utf-8")).toString("hex").toLowerCase()).toEqual(
            "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
        );
        expect(SHA.sha512(Buffer.from("test", "utf-8")).toString("hex").toLowerCase()).toEqual(
            "ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff",
        );
    });

    it("file", async () => {
        expect(
            (await SHA.stream256(fs.createReadStream(path.join(process.cwd(), "test/content/sha-test.txt"))))
                .toString("hex")
                .toLowerCase(),
        ).toEqual("9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08");
        expect(
            (await SHA.stream512(fs.createReadStream(path.join(process.cwd(), "test/content/sha-test.txt"))))
                .toString("hex")
                .toLowerCase(),
        ).toEqual(
            "ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff",
        );
    });
});
