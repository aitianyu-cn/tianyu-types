/**@format */

/** Generate a Guid value string */
export function guid(): string {
    let d = new Date().getTime();

    if (typeof performance === "undefined") {
        // global.performance = require("perf_hooks").performance;
        global.performance = eval("require")("perf_hooks").performance;
    }

    d += performance.now(); //use high-precision timer if available
    const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (d + Math.random() * 16) % 16 | 0; // d是随机种子
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
}
