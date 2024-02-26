/**@format */

import { MapOfType } from "../../types/Types";
import { ILog, IPerfRecorder, LogLevel } from "../../types/Logs";
import { guid } from "../security/Guid";

interface ILogItem {
    value: number;
    name: string;
}

const _LogLevel: MapOfType<ILogItem> = {
    DEBUG: { value: 0, name: "DEBUG" },
    ERROR: { value: 3, name: "ERROR" },
    FATAL: { value: 4, name: "FATAL" },
    INFO: { value: 1, name: "INFO" },
    WARNING: { value: 2, name: "WARNING" },
    LOG: { value: -1, name: "LOG" },
};

function _consoleLog(level: ILogItem, msg: string, timer: boolean): void {
    if (level.value >= 100) {
        console.log(`[${level.name}] ${msg}`);
        return;
    }

    let timeString = "";
    if (timer) {
        const date = new Date(Date.now());
        const millisecondString = date.getMilliseconds().toString();
        timeString = `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${millisecondString.substring(
            0,
            millisecondString.length > 3 ? 3 : millisecondString.length,
        )}]`;
    }
    const logMessage = `[${level.name}] ${timeString} ${msg}`;
    switch (level.value) {
        case 0:
            console.debug(logMessage);
            break;
        case 1:
            console.info(logMessage);
            break;
        case 2:
            console.warn(logMessage);
            break;
        case 3:
            console.error(logMessage);
            break;
        case 4:
            console.error(logMessage);
            break;
        default:
            console.log(msg);
            break;
    }
}

const _log: ILog = {
    log: function (msg: string, level?: LogLevel, timer?: boolean): void {
        const logLevel: LogLevel = level ?? LogLevel.INFO;
        switch (logLevel) {
            case LogLevel.DEBUG:
                _consoleLog(_LogLevel["DEBUG"], msg, !!timer);
                break;
            case LogLevel.WARNING:
                _consoleLog(_LogLevel["WARNING"], msg, !!timer);
                break;
            case LogLevel.ERROR:
                _consoleLog(_LogLevel["ERROR"], msg, !!timer);
                break;
            case LogLevel.FATAL:
                _consoleLog(_LogLevel["FATAL"], msg, !!timer);
                break;
            case LogLevel.INFO:
                _consoleLog(_LogLevel["INFO"], msg, !!timer);
                break;
            default:
                _consoleLog(_LogLevel["LOG"], msg, !!timer);
                break;
        }
    },
    info: function (msg: string, timer?: boolean): void {
        _consoleLog(_LogLevel["INFO"], msg, !!timer);
    },
    warn: function (msg: string, timer?: boolean): void {
        _consoleLog(_LogLevel["WARNING"], msg, !!timer);
    },
    debug: function (msg: string, timer?: boolean): void {
        _consoleLog(_LogLevel["DEBUG"], msg, !!timer);
    },
    error: function (msg: string, timer?: boolean): void {
        _consoleLog(_LogLevel["ERROR"], msg, !!timer);
    },
    fatal: function (msg: string, timer?: boolean): void {
        _consoleLog(_LogLevel["FATAL"], msg, !!timer);
    },
};

function _startPerf(id?: string): IPerfRecorder {
    return {
        id: id || guid(),
        start: Date.now(),
    };
}

function _endPerf(recorder: IPerfRecorder, console?: boolean): number {
    const perfTime = Date.now() - recorder.start;

    if (console) {
        const consoleString = `[${recorder.id}] perf time - ${perfTime}`;
        _consoleLog({ value: 100, name: "Performance" }, consoleString, false);
    }

    return perfTime;
}

/** Tianyu Log Instance */
export const Log: ILog = _log;

/** Tianyu Performance Instance */
export const Performance = {
    startPerf: _startPerf,
    endPerf: _endPerf,
};
