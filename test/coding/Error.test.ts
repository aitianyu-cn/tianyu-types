/**@format */

import {
    PathProcessorSourceLostException,
    PathDirectoryValidationFailException,
    PathDirAndFileConvertInvaild,
} from "../../src/utilities/coding/Error";

describe("aitianyu-cn.node-module.tianyu-types.coding.Error", () => {
    it("PathProcessorSourceLostException", () => {
        try {
            throw new PathProcessorSourceLostException();
        } catch (e) {
            expect(e?.toString()).toEqual("路径处理器 - 指定的参数 ( path.file ) 为空");
        }
    });

    it("PathDirectoryValidationFailException", () => {
        try {
            throw new PathDirectoryValidationFailException("abc");
        } catch (e) {
            expect(e?.toString()).toEqual("路径处理器 - 指定的路径目录 ( abc ) 无效");
        }
    });

    describe("PathDirectoryValidationFailException", () => {
        it("file", () => {
            try {
                throw new PathDirAndFileConvertInvaild("abc", "file");
            } catch (e) {
                expect(e?.toString()).toEqual("路径处理器 - 不能将文件与目录相互转换 ( abc 为 文件 ) ");
            }
        });

        it("directory", () => {
            try {
                throw new PathDirAndFileConvertInvaild("abc", "directory");
            } catch (e) {
                expect(e?.toString()).toEqual("路径处理器 - 不能将文件与目录相互转换 ( abc 为 目录 ) ");
            }
        });
    });
});
