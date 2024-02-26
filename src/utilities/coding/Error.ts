/**@format */

import { Exception } from "../../types/Exception";
import { PathTargetType } from "./Path";

/**
 * Source lost exception of Path Processor.
 * Exception will be thrown if the path is file but the file field is not specified
 */
export class PathProcessorSourceLostException extends Exception {
    public constructor(msg?: string) {
        super(msg);
    }

    public override toString(): string {
        return `路径处理器 - 指定的参数 ( path.file ) 为空`;
    }
}

/**
 * Path directory name is not valid.
 * Exception will be thrown if the path name has the invalid char
 */
export class PathDirectoryValidationFailException extends Exception {
    public constructor(msg?: string) {
        super(msg);
    }

    public override toString(): string {
        return `路径处理器 - 指定的路径目录 ( ${this.message} ) 无效`;
    }
}

/**
 * Path is file or directory but target type is not.
 * Exception will be thrown if the path is file(directory) but try to convert to directory(file)
 */
export class PathDirAndFileConvertInvaild extends Exception {
    public constructor(path: string, type: PathTargetType) {
        super(`${path} 为 ${type === "directory" ? "目录" : "文件"}`);
    }

    public override toString(): string {
        return `路径处理器 - 不能将文件与目录相互转换 ( ${this.message} ) `;
    }
}
