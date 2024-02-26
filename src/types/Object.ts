/**@format */

import { TMap } from "./TMap";
import { PathBase } from "./PathBase";

/** Tianyu Object calculated different item */
export interface IObjectDiffInfo {
    /** different item path */
    path: string;
    /** the old value of this path */
    old: any;
    /** the new value of this path */
    new: any;
    /** does the change be deletion */
    deleted?: true;
    /** does the change be adding */
    added?: true;
}

/** Different items map */
export type ObjectDiffMap = TMap<PathBase, IObjectDiffInfo>;
