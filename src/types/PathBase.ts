/**@format */

import { IComparable } from "./Types";

/** Path base class */
export class PathBase implements IComparable {
    protected _dirs: string[];

    /**
     * Create a Path instance by specified dirs
     *
     * @param dirs the specified directories
     */
    public constructor(dirs?: string[]) {
        this._dirs = (dirs && [...dirs]) || [];
    }

    /**
     * Convert the path instance to string
     *
     * @returns return the fromatted string
     */
    public toString(): string {
        if (0 === this._dirs.length) {
            return "";
        }

        return this._dirs.join("/");
    }

    /**
     * Iterator of path directories
     *
     * @returns return an iterator
     */
    [Symbol.iterator]() {
        let index = 0;
        return {
            next: () => {
                if (index < this._dirs.length) {
                    return { done: false, value: this._dirs[index++] };
                } else {
                    return { done: true, value: "" };
                }
            },
        };
    }

    /**
     * Get a directories array deep copy
     *
     * @returns return directories
     */
    public getDirs(): string[] {
        return this._dirs.concat();
    }

    /**
     * Get a number that indicates the directories count
     *
     * @returns return the directories count
     */
    public length(): number {
        return this._dirs.length;
    }

    /**
     * Append a new directory to the end of path
     *
     * @param dir the new directory name
     * @returns return the new directories count
     */
    public append(dir: string): number {
        return this._dirs.push(dir);
    }

    /**
     * Clean all the pathes
     */
    public clear(): void {
        this._dirs = [];
    }

    /**
     * Remove the end directory of the path instance and return it
     *
     * @returns return the end of directory
     */
    public pop(): string | undefined {
        return this._dirs.pop();
    }

    /**
     * Remove the first directory of the path instance and return it
     *
     * @returns return the first directory
     */
    public shift(): string | undefined {
        return this._dirs.shift();
    }

    /**
     * Convert the path instance to string for object comparing
     *
     * @returns return the comparable string
     */
    public getString(): string {
        return this.toString();
    }

    /**
     * Get the hashcode of current path
     *
     * @returns always return 0
     */
    public getHashCode(): number {
        return 0;
    }
}
