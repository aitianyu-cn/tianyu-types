/**@format */

import { IObjectDiffInfo } from "../../../src/types/Object";
import { TMap } from "../../../src/types/TMap";
import { PathBase } from "../../../src/types/PathBase";
import { ObjectCalculater } from "../../../src/utilities/core/object/Calculater";
import { ObjectHelper } from "../../../src/utilities/core/object/Helper";
import { ObjectDiffApplyInvalidStatusException, ObjectMergeStatusCheckFailedException } from "../../../src/utilities/core/Errors";

describe("aitianyu-cn.node-module.tianyu-types.core.object.ObjectCalculater", () => {
    describe("calculateDiff", () => {
        describe("simple type data", () => {
            it("same object", () => {
                const pre = 12;
                const next = 12;
                const diff = ObjectCalculater.calculateDiff(pre, next);
                expect(diff.size()).toEqual(0);
            });

            it("different object", () => {
                const pre = 12;
                const next = "12";
                const diff = ObjectCalculater.calculateDiff(pre, next);
                expect(diff.size()).toEqual(1);

                const diffInfo = diff.get(new PathBase([]));
                expect(diffInfo).toBeDefined();
                expect(diffInfo?.old).toEqual(12);
                expect(diffInfo?.new).toEqual("12");
            });
        });

        describe("array type", () => {
            describe("array and simple type", () => {
                it("simple type to array", () => {
                    const pre = 12;
                    const next = [12, 34];
                    const diff = ObjectCalculater.calculateDiff(pre, next);
                    expect(diff.size()).toEqual(1);

                    const diffInfo = diff.get(new PathBase([]));
                    expect(diffInfo).toBeDefined();
                    expect(diffInfo?.old).toEqual(12);
                    expect(diffInfo?.new).toEqual([12, 34]);
                });

                it("array to simple type", () => {
                    const pre = [12, 34];
                    const next = 12;
                    const diff = ObjectCalculater.calculateDiff(pre, next);
                    expect(diff.size()).toEqual(1);

                    const diffInfo = diff.get(new PathBase([]));
                    expect(diffInfo).toBeDefined();
                    expect(diffInfo?.old).toEqual([12, 34]);
                    expect(diffInfo?.new).toEqual(12);
                });
            });

            describe("array and array", () => {
                it("same array", () => {
                    const pre = [12, 34];
                    const next = [12, 34];
                    const diff = ObjectCalculater.calculateDiff(pre, next);
                    expect(diff.size()).toEqual(0);
                });

                it("different array", () => {
                    const pre = [12, 34];
                    const next = [12];
                    const diff = ObjectCalculater.calculateDiff(pre, next);
                    expect(diff.size()).toEqual(1);

                    const diffInfo = diff.get(new PathBase([]));
                    expect(diffInfo).toBeDefined();
                    expect(diffInfo?.old).toEqual([12, 34]);
                    expect(diffInfo?.new).toEqual([12]);
                });
            });

            describe("array and object", () => {
                it("array to object", () => {
                    const pre = [12, 34];
                    const next = {
                        t: 1,
                        x: "123",
                    };
                    const diff = ObjectCalculater.calculateDiff(pre, next);
                    expect(diff.size()).toEqual(1);

                    const diffInfo = diff.get(new PathBase([]));
                    expect(diffInfo).toBeDefined();
                    expect(diffInfo?.old).toEqual([12, 34]);
                    expect(ObjectHelper.compareObjects(diffInfo?.new, next) === "same").toBeTruthy();
                });

                it("object to array", () => {
                    const pre = {
                        t: 1,
                        x: "123",
                    };
                    const next = [12, 34];
                    const diff = ObjectCalculater.calculateDiff(pre, next);
                    expect(diff.size()).toEqual(1);

                    const diffInfo = diff.get(new PathBase([]));
                    expect(diffInfo).toBeDefined();
                    expect(ObjectHelper.compareObjects(diffInfo?.old, pre) === "same").toBeTruthy();
                    expect(diffInfo?.new).toEqual([12, 34]);
                });
            });
        });

        describe("object type", () => {
            it("same object", () => {
                const pre = {
                    t: 1,
                    x: "123",
                };
                const next = {
                    t: 1,
                    x: "123",
                };
                const diff = ObjectCalculater.calculateDiff(pre, next);
                expect(diff.size()).toEqual(0);
            });

            it("simple diff", () => {
                const pre = {
                    t: 1,
                    x: 123,
                };
                const next = {
                    t: 1,
                    x: "123",
                };
                const diff = ObjectCalculater.calculateDiff(pre, next);
                expect(diff.size()).toEqual(1);

                const diffInfo = diff.get(new PathBase(["x"]));
                expect(diffInfo).toBeDefined();
                expect(diffInfo?.old).toEqual(123);
                expect(diffInfo?.new).toEqual("123");
            });

            it("contains new adding", () => {
                const pre = {
                    t: 1,
                    x: 123,
                };
                const next = {
                    t: 1,
                    x: "123",
                    a: ["a", "b"],
                };
                const diff = ObjectCalculater.calculateDiff(pre, next);
                expect(diff.size()).toEqual(2);

                const diffInfoX = diff.get(new PathBase(["x"]));
                expect(diffInfoX).toBeDefined();
                expect(diffInfoX?.old).toEqual(123);
                expect(diffInfoX?.new).toEqual("123");

                const diffInfoA = diff.get(new PathBase(["a"]));
                expect(diffInfoA).toBeDefined();
                expect(diffInfoA?.old).toBeUndefined();
                expect(diffInfoA?.new).toEqual(["a", "b"]);
                expect(diffInfoA?.added).toBeTruthy();
            });

            it("complex case", () => {
                const pre = {
                    key: "tianyu-native",
                    project: "Tianyu Native",
                    name: "天宇C++原生 开发库",
                    options: {
                        API: { name: "API", target: "api" },
                        Architecture: {
                            name: "arch",
                            target: "arch",
                        },
                        Helper: { name: "help", target: "help" },
                        Macrodef: {
                            name: "macro",
                            target: "macro",
                        },
                    },
                };
                const next = {
                    key: "aitianyu-server-base",
                    project: "NodeJs Server Base",
                    name: "NodeJs",
                    desc: "",
                    type: "node-modules",
                    options: {
                        Helper: { name: "帮助", target: "help" },
                    },
                };

                const differentPathes = [["key"], ["project"], ["name"], ["options", "Helper", "name"]];
                const deletedPathes = [
                    ["options", "API"],
                    ["options", "Architecture"],
                    ["options", "Macrodef"],
                ];
                const addedPathes = [["type"], ["desc"]];

                const diff = ObjectCalculater.calculateDiff(pre, next);
                expect(diff.size()).toEqual(differentPathes.length + deletedPathes.length + addedPathes.length);

                for (const pathArray of differentPathes) {
                    const diffInfo = diff.get(new PathBase(pathArray));
                    expect(diffInfo).toBeDefined();
                }

                for (const pathArray of deletedPathes) {
                    const diffInfo = diff.get(new PathBase(pathArray));
                    expect(diffInfo).toBeDefined();
                }

                for (const pathArray of addedPathes) {
                    const diffInfo = diff.get(new PathBase(pathArray));
                    expect(diffInfo).toBeDefined();
                }

                const diffInfoX = diff.get(new PathBase(differentPathes[3]));
                expect(diffInfoX).toBeDefined();
                expect(diffInfoX?.old).toEqual("help");
                expect(diffInfoX?.new).toEqual("帮助");

                const diffInfoD = diff.get(new PathBase(deletedPathes[0]));
                expect(diffInfoD).toBeDefined();
                expect(ObjectHelper.compareObjects(diffInfoD?.old, { name: "API", target: "api" }) === "same").toBeTruthy();
                expect(diffInfoD?.new).toBeUndefined();
                expect(diffInfoD?.deleted).toBeTruthy();

                const diffInfoA = diff.get(new PathBase(addedPathes[0]));
                expect(diffInfoA).toBeDefined();
                expect(diffInfoA?.old).toBeUndefined();
                expect(diffInfoA?.new).toEqual("node-modules");
                expect(diffInfoA?.added).toBeTruthy();
            });
        });
    });

    describe("mergeDiff", () => {
        it("no object diff", () => {
            const source = { t: 123 };
            const newObj = ObjectCalculater.mergeDiff(source, []);
            expect(ObjectHelper.compareObjects(source, newObj) === "same").toBeTruthy();
        });

        it("simple type should has root path diff", () => {
            const diffMap = new TMap<PathBase, IObjectDiffInfo>();
            try {
                ObjectCalculater.mergeDiff(123, [diffMap]);
            } catch (e) {
                expect(e instanceof ObjectDiffApplyInvalidStatusException).toBeTruthy();
            }
        });

        it("array type has root path diff", () => {
            const diffMap = new TMap<PathBase, IObjectDiffInfo>();
            try {
                ObjectCalculater.mergeDiff([123, "123"], [diffMap]);
            } catch (e) {
                expect(e instanceof ObjectDiffApplyInvalidStatusException).toBeTruthy();
            }
        });

        describe("root path", () => {
            it("not only one path should throw error", () => {
                const diffMap = new TMap<PathBase, IObjectDiffInfo>();
                diffMap.set(new PathBase(), { path: "", old: undefined, new: undefined });
                diffMap.set(new PathBase(["a"]), { path: "a", old: undefined, new: undefined });

                try {
                    ObjectCalculater.mergeDiff([123, "123"], [diffMap], true);
                } catch (e) {
                    expect(e instanceof ObjectDiffApplyInvalidStatusException).toBeTruthy();
                }
            });

            it("old status is not matched should throw error", () => {
                const diffMap = new TMap<PathBase, IObjectDiffInfo>();
                diffMap.set(new PathBase(), { path: "", old: 123, new: undefined });

                try {
                    ObjectCalculater.mergeDiff("123", [diffMap], true);
                } catch (e) {
                    expect(e instanceof ObjectMergeStatusCheckFailedException).toBeTruthy();
                }
            });

            it("get new status", () => {
                const newStatus = { test: 123 };
                const diffMap = new TMap<PathBase, IObjectDiffInfo>();
                diffMap.set(new PathBase(), { path: "", old: 123, new: newStatus });

                const merged = ObjectCalculater.mergeDiff(123, [diffMap], true);
                expect(ObjectHelper.compareObjects(newStatus, merged) === "same").toBeTruthy();
            });
        });

        describe("object type", () => {
            it("parent object does not exist in strict mode", () => {
                const diffMap = new TMap<PathBase, IObjectDiffInfo>();
                diffMap.set(new PathBase(["a", "b"]), { path: "a/b", old: 123, new: 456 });

                try {
                    ObjectCalculater.mergeDiff({}, [diffMap], true);
                } catch (e) {
                    expect(e instanceof ObjectMergeStatusCheckFailedException).toBeTruthy();
                }
            });

            describe("add", () => {
                it("add element in strict mode if the object does exist", () => {
                    const diffMap = new TMap<PathBase, IObjectDiffInfo>();
                    diffMap.set(new PathBase(["a", "b"]), { path: "a/b", old: null, new: 456, added: true });

                    try {
                        ObjectCalculater.mergeDiff({ a: { b: 123 } }, [diffMap], true);
                    } catch (e) {
                        expect(e instanceof ObjectMergeStatusCheckFailedException).toBeTruthy();
                    }
                });

                it("add element not in strict mode", () => {
                    const diffMap = new TMap<PathBase, IObjectDiffInfo>();
                    diffMap.set(new PathBase(["a", "b"]), { path: "a/b", old: 123, new: 456, added: true });

                    const merged = ObjectCalculater.mergeDiff({}, [diffMap]);
                    expect(merged["a"]).toBeDefined();
                    expect(merged["a"]["b"]).toEqual(456);
                });
            });

            describe("del", () => {
                it("del element in strict mode if the object does not exist", () => {
                    const diffMap = new TMap<PathBase, IObjectDiffInfo>();
                    diffMap.set(new PathBase(["a", "b"]), { path: "a/b", old: 123, new: null, deleted: true });

                    try {
                        ObjectCalculater.mergeDiff({ a: { c: 123 } }, [diffMap], true);
                    } catch (e) {
                        expect(e instanceof ObjectMergeStatusCheckFailedException).toBeTruthy();
                    }
                });

                it("del undefined element not in strict mode", () => {
                    const diffMap = new TMap<PathBase, IObjectDiffInfo>();
                    diffMap.set(new PathBase(["a", "b"]), { path: "a/b", old: 123, new: null, deleted: true });

                    const merged = ObjectCalculater.mergeDiff({ a: { c: 123 } }, [diffMap]);
                    expect(merged["a"]).toBeDefined();
                    expect(merged["a"]["b"]).toBeUndefined();
                    expect(merged["a"]["c"]).toBeDefined();
                });

                it("del element not in strict mode", () => {
                    const diffMap = new TMap<PathBase, IObjectDiffInfo>();
                    diffMap.set(new PathBase(["a", "b"]), { path: "a/b", old: 123, new: null, deleted: true });

                    const merged = ObjectCalculater.mergeDiff({ a: { b: 123 } }, [diffMap]);
                    expect(merged["a"]).toBeDefined();
                    expect(merged["a"]["b"]).toBeUndefined();
                });
            });

            describe("modify", () => {
                it("modify element in strict mode if the object does not exist", () => {
                    const diffMap = new TMap<PathBase, IObjectDiffInfo>();
                    diffMap.set(new PathBase(["a", "b"]), { path: "a/b", old: 123, new: null });

                    try {
                        ObjectCalculater.mergeDiff({ a: { c: 123 } }, [diffMap], true);
                    } catch (e) {
                        expect(e instanceof ObjectMergeStatusCheckFailedException).toBeTruthy();
                    }
                });

                it("modify element in strict mode if the diff status does not matched", () => {
                    const diffMap = new TMap<PathBase, IObjectDiffInfo>();
                    diffMap.set(new PathBase(["a", "b"]), { path: "a/b", old: 123, new: null });

                    try {
                        ObjectCalculater.mergeDiff({ a: { b: "123" } }, [diffMap], true);
                    } catch (e) {
                        expect(e instanceof ObjectMergeStatusCheckFailedException).toBeTruthy();
                    }
                });

                it("modify element not in strict mode", () => {
                    const diffMap = new TMap<PathBase, IObjectDiffInfo>();
                    diffMap.set(new PathBase(["a", "b"]), { path: "a/b", old: 123, new: "1223" });

                    const merged = ObjectCalculater.mergeDiff({ a: { b: 123 } }, [diffMap]);
                    expect(merged["a"]["b"]).toEqual("1223");
                });
            });
        });
    });
});
