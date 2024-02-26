/**@format */

import { Exception } from "../../types/Exception";

/** Argument null exception */
export class ArgumentNullOrEmptyException extends Exception {
    public constructor(msg: string) {
        super(msg);
    }

    public override toString(): string {
        return `参数错误 - 指定的参数 ( ${this.message} ) 为空`;
    }
}

/**
 * Object Clone:
 * Function type is not supported.
 * Exception will be thrown if try to clone a function type object
 */
export class ObjectCloneFunctionNotSupportException extends Exception {
    public constructor() {
        super();
    }

    public override toString(): string {
        return `不支持的类型 - 正在克隆为Function类型不支持`;
    }
}

/**
 * Object Clone:
 * Object different status could not be matched.
 * Exception will be thrown if the object diff could not to be merged
 */
export class ObjectMergeStatusCheckFailedException extends Exception {
    private status: string;
    private path: string;

    public constructor(path: string, status: "add" | "modify" | "del") {
        super();

        this.path = path;
        this.status = status === "add" ? "新增" : status === "del" ? "删除" : "修改";
    }

    public override toString(): string {
        return `错误的合并状态 - ${this.status} 路径 ${this.path} 前后状态不一致`;
    }
}

/**
 * Object Clone:
 * Object different status could not be applied.
 * Exception will be thrown if the object diff could not to be applied
 */
export class ObjectDiffApplyInvalidStatusException extends Exception {
    private value: any;
    public constructor(value: any) {
        super();

        this.value = value;
    }

    public override toString(): string {
        let v2s = "";
        try {
            v2s = JSON.stringify(this.value);
        } finally {
            v2s = v2s || `[${(typeof this.value).toString()}]`;
        }

        return `无效的状态 - 值 ${v2s} 不能应用指定的状态`;
    }
}

/**
 * Object Clone:
 * Object different merge failed.
 * Exception will be thrown if the object element could not be accessed
 */
export class ObjectDiffMergeFailedException extends Exception {
    private path: string;

    public constructor(path: string) {
        super();

        this.path = path;
    }

    public override toString(): string {
        return `对象合并遇到问题 - 路径 ${this.path} 存在无法访问的对象`;
    }
}
