/**@format */

import {
    PathDirAndFileConvertInvaild,
    PathDirectoryValidationFailException,
    PathProcessorSourceLostException,
} from "../../src/utilities/coding/Error";
import { Path } from "../../src/utilities/coding/Path";

describe("aitianyu-cn.node-module.tianyu-types.coding.Path", () => {
    describe("parsePathFromString", () => {
        it("empty string should get empty dirs", () => {
            const pathObj = new Path("");
            expect(pathObj.length()).toEqual(0);
            expect(pathObj.getType()).toEqual("directory");
        });

        it("/ string should get empty dirs", () => {
            const pathObj = new Path("/");
            expect(pathObj.length()).toEqual(0);
            expect(pathObj.getType()).toEqual("directory");
        });

        it("blank string should get empty dirs", () => {
            const pathObj = new Path(" ");
            expect(pathObj.length()).toEqual(0);
            expect(pathObj.getType()).toEqual("directory");
        });

        it("invalid string", () => {
            try {
                new Path("a/b.c/d");
                throw new Error();
            } catch (e) {
                expect(e instanceof PathDirectoryValidationFailException).toBeTruthy();
            }
        });

        it("directory string", () => {
            const pathObj = new Path("a/b/c");
            expect(pathObj.length()).toEqual(3);
            expect(pathObj.getDirs()[0]).toEqual("a");
            expect(pathObj.getDirs()[1]).toEqual("b");
            expect(pathObj.getDirs()[2]).toEqual("c");
            expect(pathObj.getFile()).not.toBeDefined();
            expect(pathObj.getType()).toEqual("directory");
        });

        it("directory string", () => {
            const pathObj = new Path("a/b/c/d.png");
            expect(pathObj.length()).toEqual(3);
            expect(pathObj.getDirs()[0]).toEqual("a");
            expect(pathObj.getDirs()[1]).toEqual("b");
            expect(pathObj.getDirs()[2]).toEqual("c");
            expect(pathObj.getFile()).toEqual("d.png");
            expect(pathObj.getType()).toEqual("file");
        });

        it("type is not matched", () => {
            try {
                new Path("a/b/c/d.png", "directory");
            } catch (e) {
                expect(e instanceof PathDirAndFileConvertInvaild).toBeTruthy();
            }
        });
    });

    describe("formatPathgetString", () => {
        it("type is file but do not have file field", () => {
            try {
                const pathObj = new Path([], "file");
                pathObj.getString();
            } catch (e) {
                expect(e instanceof PathProcessorSourceLostException).toBeTruthy();
            }
        });

        it("directory type and empty dirs", () => {
            const pathObj = new Path([], "directory");
            const pathString = pathObj.getString();
            expect(pathString).toEqual("");
        });

        it("path is not available", () => {
            try {
                const pathObj = new Path(["a/b"], "directory");
                pathObj.getString();
            } catch (e) {
                expect(e instanceof PathDirectoryValidationFailException).toBeTruthy();
            }
        });

        it("no dir but has file", () => {
            const pathObj = new Path([], "file", "a.png");
            const pathString = pathObj.getString();
            expect(pathString).toEqual("a.png");
        });

        it("has dirs and file", () => {
            const pathObj = new Path(["aaa", "bbb"], "file", "a.png");
            const pathString = pathObj.getString();
            expect(pathString).toEqual("aaa/bbb/a.png");
        });
    });

    describe("functions", () => {
        it("set and get type", () => {
            const pathObj = new Path();
            expect(pathObj.getType() === "directory").toBeTruthy();

            pathObj.setType("file");
            expect(pathObj.getType() === "file").toBeTruthy();
        });

        it("set and get type", () => {
            const pathObj = new Path([], "file", "a.png");
            expect(pathObj.getType() === "file").toBeTruthy();
            expect(pathObj.getFile()).toEqual("a.png");

            const old = pathObj.setFile("b.txt");
            expect(old).toEqual("a.png");
            expect(pathObj.getFile()).toEqual("b.txt");
        });

        it("getHashCode", () => {
            const pathObj = new Path();
            expect(pathObj.getHashCode()).toEqual(0);
        });
    });
});
