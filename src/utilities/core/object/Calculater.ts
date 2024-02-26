/**@format */

import { TMap } from "../../../types/TMap";
import { PathBase } from "../../../types/PathBase";
import { IObjectDiffInfo, ObjectDiffMap } from "../../../types/Object";
import { ObjectHelper } from "./Helper";
import {
    ObjectDiffApplyInvalidStatusException,
    ObjectDiffMergeFailedException,
    ObjectMergeStatusCheckFailedException,
} from "../Errors";

class ObjectDiffCalculation {
    private preObj: any;
    private nextObj: any;

    private objStack: string[];
    private diffs: ObjectDiffMap;

    public constructor(pre: any, next: any) {
        this.preObj = pre;
        this.nextObj = next;

        this.objStack = [];
        this.diffs = new TMap<PathBase, IObjectDiffInfo>();
    }

    public calculate(): ObjectDiffMap {
        this._calculate(this.preObj, this.nextObj);
        return this.diffs;
    }

    private _calculate(pre: any, next: any): void {
        const isPreSimple = ObjectHelper.isSimpleDataType(pre);
        const isNextSimple = ObjectHelper.isSimpleDataType(next);
        // 如果是基本数据类型
        if (isPreSimple && isNextSimple) {
            // 如果数据不相同，则记录
            if (pre !== next) {
                const path = new PathBase(this.objStack);
                this.diffs.set(path, {
                    path: path.toString(),
                    old: ObjectHelper.clone(pre),
                    new: ObjectHelper.clone(next),
                });
            }

            // 直接返回
            return;
        }

        // 获取新老对象是否为数组类型
        const isPreArray = Array.isArray(pre);
        const isNextArray = Array.isArray(next);
        if (isPreArray || isNextArray) {
            const path = new PathBase(this.objStack);
            if (isPreArray && isNextArray) {
                // Pre为数组 Next为数组
                const isSame = ObjectHelper.compareObjects(pre, next);
                if (isSame === "different") {
                    this.diffs.set(path, {
                        path: path.toString(),
                        old: ObjectHelper.clone(pre),
                        new: ObjectHelper.clone(next),
                    });
                }
            } else {
                // Pre或Next为数组，另外一个为object类型
                // Pre为简单对象 & Next为数组
                // Pre为数组 & Next为简单对象
                this.diffs.set(path, {
                    path: path.toString(),
                    old: ObjectHelper.clone(pre),
                    new: ObjectHelper.clone(next),
                });
            }

            return;
        }

        // 新老对象都是Object类型，按照Object类型进行比对
        this._calculateObject(pre, next);
    }

    private _calculateObject(pre: any, next: any): void {
        const preKeys = Object.keys(pre);
        const nextKeys = Object.keys(next);

        const sameItems: string[] = [];

        // 寻找已经删除的
        for (const key of preKeys) {
            if (nextKeys.includes(key)) {
                sameItems.push(key);
            } else {
                // 已经被删除的对象，储存下来
                this.objStack.push(key);
                const path = new PathBase(this.objStack);
                this.diffs.set(path, {
                    path: path.toString(),
                    old: ObjectHelper.clone(pre[key]),
                    new: undefined,
                    deleted: true,
                });
                this.objStack.pop();
            }
        }

        // 寻找新加的元素
        for (const key of nextKeys) {
            if (!preKeys.includes(key)) {
                // 老的对象中不存在，新加的状态储存下来
                this.objStack.push(key);
                const path = new PathBase(this.objStack);
                this.diffs.set(path, {
                    path: path.toString(),
                    old: undefined,
                    new: ObjectHelper.clone(next[key]),
                    added: true,
                });
                this.objStack.pop();
            }
        }

        // 依次遍历所有相同的元素，判断其是否存在改变
        for (const key of sameItems) {
            this.objStack.push(key);
            this._calculate(pre[key], next[key]);
            this.objStack.pop();
        }
    }
}

function __checkOldAndNewStatus(pre: any, next: any): boolean {
    return ObjectHelper.compareObjects(pre, next) === "same";
}

/** Object Calculation Manager of Tianyu to provide data changes delta calculation and merge */
export class ObjectCalculater {
    /**
     * Compare two objects and get the delta changes between the two objects
     *
     * @param previous the previous object
     * @param newest the newest object
     * @returns return the defferents map
     */
    public static calculateDiff(previous: any, newest: any): ObjectDiffMap {
        const calculationEntity = new ObjectDiffCalculation(previous, newest);
        return calculationEntity.calculate();
    }

    /**
     * Merge the object value status from one to another one following with the object different maps
     *
     * @param value the raw value(status)
     * @param diffs the value changed status map array, contains multiply status maps and the status merge will be one by one.
     * @param strict a boolean value used to whether the program needs a strict status check to avoid some data errors
     * @returns return a new value status
     */
    public static mergeDiff(value: any, diffs: ObjectDiffMap[], strict?: boolean): any {
        const resultObj = { root: ObjectHelper.clone(value) };
        if (0 === diffs.length) {
            return resultObj.root;
        }

        for (const diff of diffs) {
            const rootPathDiff = diff.get(new PathBase([]));

            if (rootPathDiff) {
                if (strict && diff.size() > 1) {
                    throw new ObjectDiffApplyInvalidStatusException(resultObj.root);
                }

                if (strict && !__checkOldAndNewStatus(resultObj.root, rootPathDiff.old)) {
                    throw new ObjectMergeStatusCheckFailedException(
                        "",
                        rootPathDiff.deleted ? "del" : rootPathDiff.added ? "add" : "modify",
                    );
                }

                // 直接设置新值
                resultObj.root = ObjectHelper.clone(rootPathDiff.new);

                // 原始值为简单数据类型 或 数组类型 需要根目录修改
            } else if (ObjectHelper.isSimpleDataType(resultObj.root) || Array.isArray(resultObj.root)) {
                throw new ObjectDiffApplyInvalidStatusException(resultObj.root);
            } else {
                // 没有根目录修改
                // 并且对象不是简单类型
                // 按照复杂值递归进行更改

                // 依次遍历所有的路径
                for (const [path, info] of diff) {
                    // 此处不应该进入条件
                    if (!!!path || !!!info) continue;

                    // 获取路径并预处理
                    const pathDir = path.getDirs();
                    const endDir = pathDir.pop();
                    // 此处不应该进入条件
                    if (!!!endDir) continue;

                    const mergeType = info.added ? "add" : info.deleted ? "del" : "modify";

                    // 依次查询元素路径
                    // 检查父元素是否不存在（error）
                    let obj = resultObj.root;
                    for (const key of pathDir) {
                        if (!!!obj[key]) {
                            // 如果父对象不存在 在严格模式下抛出异常
                            if (strict) {
                                throw new ObjectMergeStatusCheckFailedException(info.path, mergeType);
                            } else {
                                obj[key] = {};
                            }
                        }

                        // 目标点向下移动
                        obj = obj[key];
                    }

                    // 再次检查对象状态 （理论上不应该进入此判断）
                    if (!!!obj) throw new ObjectDiffMergeFailedException(info.path);

                    if (info.added) {
                        // 新增一个元素
                        // 严格模式下 不允许新增对象存在
                        if (strict && obj[endDir]) {
                            throw new ObjectMergeStatusCheckFailedException(info.path, mergeType);
                        }
                        // 执行拷贝
                        obj[endDir] = ObjectHelper.clone(info.new);
                    } else if (info.deleted) {
                        // 删除一个元素
                        // 严格模式下 不允许删除对象不存在
                        if (strict && !!!obj[endDir]) {
                            throw new ObjectMergeStatusCheckFailedException(info.path, mergeType);
                        }
                        // 执行删除（如果对象存在）
                        !!obj[endDir] && delete obj[endDir];
                    } else {
                        // 修改一个元素
                        // 严格模式下 不允许修改对象不存在
                        if (strict && (!!!obj[endDir] || __checkOldAndNewStatus(info.old, obj[endDir]))) {
                            throw new ObjectMergeStatusCheckFailedException(info.path, mergeType);
                        }
                        // 执行修改
                        obj[endDir] = ObjectHelper.clone(info.new);
                    }
                }
            }
        }

        return resultObj.root;
    }
}
