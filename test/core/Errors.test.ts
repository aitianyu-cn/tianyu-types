/**@format */

import {
    ArgumentNullOrEmptyException,
    ObjectCloneFunctionNotSupportException,
    ObjectMergeStatusCheckFailedException,
    ObjectDiffApplyInvalidStatusException,
    ObjectDiffMergeFailedException,
} from "../../src/utilities/core/Errors";

describe("aitianyu-cn.node-module.tianyu-types.core.Errors", () => {
    it("ArgumentNullOrEmptyException", () => {
        try {
            throw new ArgumentNullOrEmptyException("abc");
        } catch (e) {
            expect(e?.toString()).toEqual("参数错误 - 指定的参数 ( abc ) 为空");
        }
    });

    it("ObjectCloneFunctionNotSupportException", () => {
        try {
            throw new ObjectCloneFunctionNotSupportException();
        } catch (e) {
            expect(e?.toString()).toEqual("不支持的类型 - 正在克隆为Function类型不支持");
        }
    });

    describe("ObjectMergeStatusCheckFailedException", () => {
        it("add", () => {
            try {
                throw new ObjectMergeStatusCheckFailedException("a/b/c", "add");
            } catch (e) {
                expect(e?.toString()).toEqual("错误的合并状态 - 新增 路径 a/b/c 前后状态不一致");
            }
        });

        it("del", () => {
            try {
                throw new ObjectMergeStatusCheckFailedException("a/b/c", "del");
            } catch (e) {
                expect(e?.toString()).toEqual("错误的合并状态 - 删除 路径 a/b/c 前后状态不一致");
            }
        });

        it("modify", () => {
            try {
                throw new ObjectMergeStatusCheckFailedException("a/b/c", "modify");
            } catch (e) {
                expect(e?.toString()).toEqual("错误的合并状态 - 修改 路径 a/b/c 前后状态不一致");
            }
        });
    });

    describe("ObjectDiffApplyInvalidStatusException", () => {
        it("string able", () => {
            const obj = { a: "123", b: 123 };
            try {
                throw new ObjectDiffApplyInvalidStatusException(obj);
            } catch (e) {
                const objString = JSON.stringify(obj);
                expect(e?.toString()).toEqual(`无效的状态 - 值 ${objString} 不能应用指定的状态`);
            }
        });

        it("not string able", () => {
            const fun = () => {};
            try {
                throw new ObjectDiffApplyInvalidStatusException(fun);
            } catch (e) {
                expect(e?.toString()).toEqual(`无效的状态 - 值 [${(typeof fun).toString()}] 不能应用指定的状态`);
            }
        });
    });

    it("ObjectDiffMergeFailedException", () => {
        try {
            throw new ObjectDiffMergeFailedException("a/b/c");
        } catch (e) {
            expect(e?.toString()).toEqual("对象合并遇到问题 - 路径 a/b/c 存在无法访问的对象");
        }
    });
});
