/**@format */

import { PathBase } from "../../src/types/PathBase";

describe("aitianyu-cn.node-module.tianyu-types.types.PathBase", () => {
    describe("toString/getString", () => {
        it("empty dir", () => {
            const path = new PathBase();
            expect(path.getString()).toEqual("");
        });

        it("non empty dir", () => {
            const path = new PathBase(["123", "456"]);
            expect(path.getString()).toEqual("123/456");
        });
    });

    it("getHashCode", () => {
        const path = new PathBase();
        expect(path.getHashCode()).toEqual(0);
    });

    it("getDirs", () => {
        const path = new PathBase(["123", "456"]);
        expect(path.getDirs()).not.toBe(path["_dirs"]);
        expect(path.getDirs()).toEqual(["123", "456"]);
    });

    it("length", () => {
        const path = new PathBase(["123", "456"]);
        expect(path.length()).toEqual(2);
    });

    it("append", () => {
        const path = new PathBase(["123", "456"]);
        expect(path.length()).toEqual(2);

        const length = path.append("666");
        expect(length).toEqual(3);
        expect(path.length()).toEqual(3);
        expect(path.getString()).toEqual("123/456/666");
    });

    it("non empty dir", () => {
        const path = new PathBase(["123", "456"]);
        expect(path.length()).toEqual(2);

        path.clear();
        expect(path.length()).toEqual(0);
    });

    it("pop", () => {
        const path = new PathBase(["123", "456"]);
        expect(path.length()).toEqual(2);

        const end = path.pop();
        expect(end).toEqual("456");
        expect(path.length()).toEqual(1);
        expect(path.getString()).toEqual("123");
    });

    it("shift", () => {
        const path = new PathBase(["123", "456"]);
        expect(path.length()).toEqual(2);

        const start = path.shift();
        expect(start).toEqual("123");
        expect(path.length()).toEqual(1);
        expect(path.getString()).toEqual("456");
    });

    it("Symbol.iterator", () => {
        const array: string[] = [];
        for (let i = 0; i < 10; ++i) {
            array.push((i + 1).toString());
        }
        const path = new PathBase(array);
        expect(path.length()).toEqual(array.length);

        let index = 0;
        for (const dir of path) {
            expect(dir).toEqual((++index).toString());
        }
    });
});
