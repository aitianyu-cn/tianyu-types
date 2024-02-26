/**@format */

import { ObjectCloneFunctionNotSupportException } from "../../../src/utilities/core/Errors";
import { ObjectHelper } from "../../../src/utilities/core/object/Helper";

describe("aitianyu-cn.node-module.tianyu-types.core.object.ObjectHelper", () => {
    it("isSimpleDataType", () => {
        expect(ObjectHelper.isSimpleDataType(undefined)).toBeTruthy();
        expect(ObjectHelper.isSimpleDataType(null)).toBeTruthy();
        expect(ObjectHelper.isSimpleDataType(true)).toBeTruthy();
        expect(ObjectHelper.isSimpleDataType("")).toBeTruthy();
        expect(ObjectHelper.isSimpleDataType("123")).toBeTruthy();
        expect(ObjectHelper.isSimpleDataType(123)).toBeTruthy();
        expect(ObjectHelper.isSimpleDataType(Symbol("123"))).toBeTruthy();
    });

    describe("clone", () => {
        it("function could not be clone", () => {
            try {
                ObjectHelper.clone(() => {});
                throw new Error();
            } catch (e) {
                expect(e instanceof ObjectCloneFunctionNotSupportException).toBeTruthy();
            }
        });

        it("simple data type", () => {
            const copied = ObjectHelper.clone("123");
            expect(typeof copied === "string").toBeTruthy();
            expect(copied).toEqual("123");
        });

        describe("array type", () => {
            it("empty array", () => {
                const copied = ObjectHelper.clone([]);
                expect(Array.isArray(copied)).toBeTruthy();
                expect(copied.length).toEqual(0);
            });

            it("not empty array", () => {
                const source = ["123", 123, true];
                const copied = ObjectHelper.clone(source);
                expect(Array.isArray(copied)).toBeTruthy();
                expect(copied.length).toEqual(source.length);
                for (let i = 0; i < source.length; ++i) {
                    expect(source[i]).toEqual(copied[i]);
                }
            });
        });

        describe("object type", () => {
            it("empty obj", () => {
                const copied = ObjectHelper.clone({});
                expect(copied).toBeDefined();
                const keys = Object.keys(copied);
                expect(keys.length).toEqual(0);
            });

            it("not empty object", () => {
                const source: any = {
                    [123]: "abc",
                    "564": true,
                };
                const copied = ObjectHelper.clone(source);
                expect(copied).toBeDefined();

                const sourceKeys = Object.keys(source);
                const copiedKeys = Object.keys(copied);
                expect(copiedKeys.length).toEqual(sourceKeys.length);
                for (const key of copiedKeys) {
                    expect(source[key] === copied[key]).toBeTruthy();
                }
            });
        });

        it("complex object", () => {
            const source: any = {
                a: "A",
                b: true,
                c: {
                    aa: "AA",
                    bb: {
                        aaa: true,
                    },
                },
            };
            const copied = ObjectHelper.clone(source);
            expect(copied).toBeDefined();

            expect(copied["a"]).toEqual("A");
            expect(copied["b"]).toBeTruthy();
            expect(copied["c"]).toBeDefined();

            const copiedC = copied["c"];
            expect(copiedC["aa"]).toEqual("AA");
            expect(copiedC["bb"]).toBeDefined();

            const copiedCBB = copiedC["bb"];
            expect(copiedCBB["aaa"]).toBeTruthy();
        });
    });
    describe("validateSerializable", () => {
        it("function type is not valid", () => {
            const isValid = ObjectHelper.validateSerializable(() => {});
            expect(isValid).toBeFalsy();
        });

        it("simple type is valid", () => {
            const isValid = ObjectHelper.validateSerializable("123");
            expect(isValid).toBeTruthy();
        });

        describe("array type", () => {
            it("has not valid item", () => {
                const isValid = ObjectHelper.validateSerializable(["123", () => {}]);
                expect(isValid).toBeFalsy();
            });

            it("valid", () => {
                const isValid = ObjectHelper.validateSerializable(["123", 123, ["123"]]);
                expect(isValid).toBeTruthy();
            });
        });

        describe("object type", () => {
            it("has not valid item", () => {
                const isValid = ObjectHelper.validateSerializable({
                    "456": true,
                    "123": () => {},
                });
                expect(isValid).toBeFalsy();
            });

            it("valid", () => {
                const isValid = ObjectHelper.validateSerializable({
                    "456": true,
                    "123": {
                        aaa: 123,
                    },
                    "555": ["abc", 123, true],
                });
                expect(isValid).toBeTruthy();
            });
        });
    });
    describe("compareObjects", () => {
        it("only one object should be same", () => {
            const result = ObjectHelper.compareObjects({});
            expect(result).toEqual("same");
        });

        describe("compare for simple object", () => {
            it("different", () => {
                const result = ObjectHelper.compareObjects("123", "123", 123);
                expect(result).toEqual("different");
            });

            it("same", () => {
                const result = ObjectHelper.compareObjects("123", "123", "123");
                expect(result).toEqual("same");
            });
        });

        describe("array", () => {
            it("different length", () => {
                const result = ObjectHelper.compareObjects(["123", "123", "123"], ["123", "123", "123"], ["123", "123"]);
                expect(result).toEqual("different");
            });

            it("different order/value", () => {
                const result = ObjectHelper.compareObjects(["123", 123, "123"], ["123", "123", 123], ["123", "123", "123"]);
                expect(result).toEqual("different");
            });

            it("same", () => {
                const result = ObjectHelper.compareObjects(["123", "123", "123"], ["123", "123", "123"], ["123", "123", "123"]);
                expect(result).toEqual("same");
            });
        });

        describe("object", () => {
            it("has different key size", () => {
                const obj1 = {
                    aa: 1,
                    bb: 2,
                    cc: 3,
                };
                const obj2 = {
                    cc: 1,
                    bb: 2,
                };
                const result = ObjectHelper.compareObjects(obj1, obj2);
                expect(result).toEqual("different");
            });

            it("has different key value", () => {
                const obj1 = {
                    aa: 1,
                    bb: 2,
                    cc: 3,
                };
                const obj2 = {
                    cc: 1,
                    dd: 2,
                    ee: 3,
                };
                const result = ObjectHelper.compareObjects(obj1, obj2);
                expect(result).toEqual("different");
            });

            it("has different value", () => {
                const obj1 = {
                    aa: 1,
                    bb: 2,
                    cc: 3,
                };
                const obj2 = {
                    aa: 1,
                    bb: 2,
                    cc: 4,
                };
                const result = ObjectHelper.compareObjects(obj1, obj2);
                expect(result).toEqual("different");
            });

            it("same", () => {
                const obj1 = {
                    aa: 1,
                    bb: 2,
                    cc: 3,
                };
                const obj2 = {
                    aa: 1,
                    bb: 2,
                    cc: 3,
                };
                const result = ObjectHelper.compareObjects(obj1, obj2);
                expect(result).toEqual("same");
            });
        });

        describe("complex type", () => {
            it("different", () => {
                const obj1 = {
                    aa: 1,
                    bb: 2,
                    cc: 3,
                    dd: ["123", "456"],
                    ee: {
                        aaa: 10,
                        bbb: {
                            aaaa: 20,
                            bbbb: [true, false, true],
                        },
                    },
                };
                const obj2 = {
                    aa: 1,
                    bb: 2,
                    cc: 3,
                    dd: ["123", "456"],
                    ee: {
                        aaa: 10,
                        bbb: {
                            aaaa: 20,
                            bbbb: [true, false],
                        },
                    },
                };
                const result = ObjectHelper.compareObjects(obj1, obj2);
                expect(result).toEqual("different");
            });

            it("same", () => {
                const obj1 = {
                    aa: 1,
                    bb: 2,
                    cc: 3,
                    dd: ["123", "456"],
                    ee: {
                        aaa: 10,
                        bbb: {
                            aaaa: 20,
                            bbbb: [true, false],
                        },
                    },
                };
                const obj2 = {
                    aa: 1,
                    bb: 2,
                    cc: 3,
                    dd: ["123", "456"],
                    ee: {
                        aaa: 10,
                        bbb: {
                            aaaa: 20,
                            bbbb: [true, false],
                        },
                    },
                };
                const result = ObjectHelper.compareObjects(obj1, obj2);
                expect(result).toEqual("same");
            });
        });
    });
});
