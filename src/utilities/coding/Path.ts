/**@format */

import { PathBase } from "../../types/PathBase";
import { IComparable } from "../../types/Types";
import { PathDirAndFileConvertInvaild, PathDirectoryValidationFailException, PathProcessorSourceLostException } from "./Error";

/** The target path type */
export type PathTargetType = "directory" | "file";

type DirNameValidation = "valid" | "invalid" | "drop";
type DirFileType = "directory" | "file" | "drop" | "invalid";

interface IPath {
    dirs: string[];
    file?: string;
    type: PathTargetType;
}

const __charInDirValidation: { [k: string]: { file: boolean; dir: boolean } } = {
    "/": { file: false, dir: false },
    ".": { file: true, dir: false },
};

function _dirNameChecker(dir: string): DirNameValidation {
    if (!dir) return "drop";

    for (const ch of dir) {
        const validation = __charInDirValidation[ch];
        if (validation && !validation.dir) {
            return "invalid";
        }
    }

    return "valid";
}

function _dirFileTypeChecker(src: string): DirFileType {
    if (!src) return "drop";

    let dirType: boolean = false;
    let fileType: boolean = false;
    for (const char of src) {
        const validation = __charInDirValidation[char];
        if (dirType) {
            if (validation && !validation.dir) return "invalid";
        } else if (fileType) {
            if (validation && !validation.file) return "invalid";
        } else {
            if (validation) {
                if (validation.dir && !validation.file) dirType = true;
                else if (!validation.dir && validation.file) fileType = true;
                else if (!validation.dir && !validation.file) return "invalid";
            }
        }
    }

    if ((!dirType && !fileType) || dirType) return "directory";
    else return "file";
}

function _parsePathFromString(src: string): IPath {
    const path: IPath = {
        dirs: [],
        file: undefined,
        type: "directory",
    };
    if (!src) {
        return path;
    }

    const prsedSrc = src.trim();
    const srcSplit = prsedSrc.split("/");
    if (srcSplit.length === 0) {
        return path;
    }

    for (let i = 0; i < srcSplit.length - 1; ++i) {
        const dir = srcSplit[i];
        const validation = _dirNameChecker(dir);
        if (validation === "invalid") {
            throw new PathDirectoryValidationFailException(dir);
        }
        if (validation === "valid") {
            path.dirs.push(dir);
        }
    }

    const lastDir = srcSplit[srcSplit.length - 1];
    const dirType = _dirFileTypeChecker(lastDir);
    if (dirType === "directory") {
        path.dirs.push(lastDir);
    } else if (dirType === "file") {
        path.file = lastDir;
        path.type = "file";
    }

    return path;
}

/** Path */
export class Path extends PathBase implements IComparable {
    private _type: PathTargetType;
    private _file?: string;

    /**
     * Create a new Path instance
     *
     * @param dirs the directory names
     * @param type indicate which type the Path is
     * @param file the file name if the type is file
     */
    public constructor(dirs?: string[] | string, type?: PathTargetType, file?: string) {
        super();

        if (typeof dirs === "string") {
            const parsePath = _parsePathFromString(dirs);
            if (type && type != parsePath.type) {
                throw new PathDirAndFileConvertInvaild(dirs, parsePath.type);
            }
            this._dirs = parsePath.dirs;
            type = parsePath.type;
            file = parsePath.file;
        } else if (Array.isArray(dirs)) {
            this._dirs = dirs;
        }
        this._type = type || (file && "file") || "directory";
        this._file = file;
    }

    /**
     * Convert the path to a string
     *
     * @returns return the string
     */
    public toString(): string {
        if (this.getType() === "file" && !!!this.getFile()) {
            throw new PathProcessorSourceLostException();
        }
        if (this.length() === 0 && !!!this.getFile()) {
            return "";
        }

        const dirs: string[] = [];
        for (const dirItem of this._dirs) {
            const validation = _dirNameChecker(dirItem);
            if (validation === "invalid") {
                throw new PathDirectoryValidationFailException(dirItem);
            }
            if (validation === "valid") {
                dirs.push(dirItem);
            }
        }
        const file = this.getFile();
        if (!!file) dirs.push(file);

        if (dirs.length === 0) {
            return "";
        }

        return dirs.join("/");
    }

    /**
     * Set the target type
     *
     * @param type new type
     */
    public setType(type: PathTargetType): void {
        this._type = type;
    }

    /**
     * Get the path type of current instance
     *
     * @returns return the path type
     */
    public getType(): PathTargetType {
        return this._type;
    }

    /**
     * Set the path file name
     *
     * @param file the new file name
     * @returns return the old file name
     */
    public setFile(file: string): string | undefined {
        const oldFile = this._file;
        this._file = file;
        return oldFile;
    }

    /**
     * Get the file name of current instance
     *
     * @returns return the file name
     */
    public getFile(): string | undefined {
        return this._file;
    }

    /**
     * IComparable impl to get a string what equals to current instance
     *
     * @returns return the string
     */
    public getString(): string {
        return this.toString();
    }

    /**
     * Get a hash code of current instance
     *
     * @returns always return 0
     */
    public getHashCode(): number {
        return 0;
    }
}
