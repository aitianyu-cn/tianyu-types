/**@format */

import { Integer } from "../core/object/Integer";

export type GuidType = "none" | "default";

const UUID_TEMPLATE: Record<GuidType, string> = {
    none: "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx",
    default: "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx",
};

/** Generate a Guid value string */
export function guid(type: GuidType = "default"): string {
    let d = new Date().getTime();

    if (typeof performance === "undefined") {
        // global.performance = require("perf_hooks").performance;
        // eslint-disable-next-line no-eval
        global.performance = eval("require")("perf_hooks").performance;
    }

    d += performance.now(); //use high-precision timer if available
    const uuid = UUID_TEMPLATE[type].replace(/[xy]/g, (c) => {
        const r = Integer.or((d + Math.random() * 16) % 16, 0); // d是随机种子
        d = Math.floor(d / 16);
        return (c === "x" ? r : Integer.or(Integer.and(r, 0x3), 0x8)).toString(16);
    });
    return uuid;
}
