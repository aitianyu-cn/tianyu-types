/**@format */

import { LogLevel } from "../../src/types/Logs";
import { Log, Performance } from "../../src/utilities/core/Log";

const getLogReg = (name: string, msg: string) => {
    return new RegExp(`\\[${name}\\] \\[[0-9]+:[0-9]+:[0-9]+\\.[0-9]+\\] ${msg}`);
};

describe("aitianyu-cn.node-module.tianyu-types.core.Log", () => {
    let logString = "";
    beforeAll(() => {
        jest.setTimeout(5000);
    });
    beforeEach(() => {
        logString = "";
        jest.clearAllMocks();
        jest.spyOn(console, "log").mockImplementation((msg: string) => {
            logString = msg;
        });
        jest.spyOn(console, "debug").mockImplementation((msg: string) => {
            logString = msg;
        });
        jest.spyOn(console, "info").mockImplementation((msg: string) => {
            logString = msg;
        });
        jest.spyOn(console, "warn").mockImplementation((msg: string) => {
            logString = msg;
        });
        jest.spyOn(console, "error").mockImplementation((msg: string) => {
            logString = msg;
        });
    });
    describe("Log", () => {
        it("debug", () => {
            Log.debug("test debug", true);
            const reg = getLogReg("DEBUG", "test debug");
            expect(reg.test(logString)).toBeTruthy();
        });

        it("error", () => {
            Log.error("test error", true);
            const reg = getLogReg("ERROR", "test error");
            expect(reg.test(logString)).toBeTruthy();
        });

        it("fatal", () => {
            Log.fatal("test fatal", true);
            const reg = getLogReg("FATAL", "test fatal");
            expect(reg.test(logString)).toBeTruthy();
        });

        it("info", () => {
            Log.info("test info", true);
            const reg = getLogReg("INFO", "test info");
            expect(reg.test(logString)).toBeTruthy();
        });

        it("warning", () => {
            Log.warn("test warning", true);
            const reg = getLogReg("WARNING", "test warning");
            expect(reg.test(logString)).toBeTruthy();
        });

        describe("Log by Log", () => {
            it("debug", () => {
                Log.log("test debug", LogLevel.DEBUG, true);
                const reg = getLogReg("DEBUG", "test debug");
                expect(reg.test(logString)).toBeTruthy();
            });

            it("error", () => {
                Log.log("test error", LogLevel.ERROR, true);
                const reg = getLogReg("ERROR", "test error");
                expect(reg.test(logString)).toBeTruthy();
            });

            it("fatal", () => {
                Log.log("test fatal", LogLevel.FATAL, true);
                const reg = getLogReg("FATAL", "test fatal");
                expect(reg.test(logString)).toBeTruthy();
            });

            it("info", () => {
                Log.log("test info", LogLevel.INFO, true);
                const reg = getLogReg("INFO", "test info");
                expect(reg.test(logString)).toBeTruthy();
            });

            it("warning", () => {
                Log.log("test warning", LogLevel.WARNING, true);
                const reg = getLogReg("WARNING", "test warning");
                expect(reg.test(logString)).toBeTruthy();
            });

            it("log", () => {
                Log.log("test log", LogLevel.LOG, true);
                expect(logString).toEqual("test log");
            });
        });
    });
    describe("Performace", () => {
        describe("start perf", () => {
            it("has id", () => {
                const oPerf = Performance.startPerf("perf_id");
                expect(oPerf.id).toEqual("perf_id");
                expect(oPerf.start).not.toEqual(0);
            });

            it("does not have id", () => {
                const oPerf = Performance.startPerf();
                expect(oPerf.id).not.toEqual("");
                expect(oPerf.start).not.toEqual(0);
            });
        });

        describe("end perf", () => {
            it("does not have console", (done) => {
                const oPerf = Performance.startPerf("perf_id");
                setTimeout(() => {
                    const during = Performance.endPerf(oPerf);
                    expect(during).toBeGreaterThan(0);
                    expect(console.log).not.toHaveBeenCalled();
                    done();
                }, 100);
            });

            it("has console", (done) => {
                const oPerf = Performance.startPerf("perf_id");
                setTimeout(() => {
                    const during = Performance.endPerf(oPerf, true);
                    expect(during).toBeGreaterThan(0);
                    expect(/\[Performance\] \[perf_id\] perf time \- [0-9]+/.test(logString)).toBeTruthy();
                    done();
                }, 100);
            });
        });
    });
});
