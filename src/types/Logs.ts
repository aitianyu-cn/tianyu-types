/**@format */

/** Tianyu Log Level */
export enum LogLevel {
    /** Debug mode log */
    DEBUG,
    /** error msg */
    ERROR,
    /** fatal error msg */
    FATAL,
    /** info log */
    INFO,
    /** warning log */
    WARNING,
    /** default log */
    LOG,
}

/** Tianyu Log Interface */
export interface ILog {
    /**
     * Write a console log with specified log level
     *
     * @param msg the message body
     * @param level the console log level, if not be specified, to print as default log
     * @param timer a boolean value indicates whether needs to add a timestamp for the log
     */
    log(msg: string, level?: LogLevel, timer?: boolean): void;
    /**
     * Write a console info log
     * @param msg the message body
     * @param timer a boolean value indicates whether needs to add a timestamp for the log
     */
    info(msg: string, timer?: boolean): void;
    /**
     * Write a console warning log
     * @param msg the message body
     * @param timer a boolean value indicates whether needs to add a timestamp for the log
     */
    warn(msg: string, timer?: boolean): void;
    /**
     * Write a console debug log
     * @param msg the message body
     * @param timer a boolean value indicates whether needs to add a timestamp for the log
     */
    debug(msg: string, timer?: boolean): void;
    /**
     * Write a console error message
     * @param msg the message body
     * @param timer a boolean value indicates whether needs to add a timestamp for the log
     */
    error(msg: string, timer?: boolean): void;
    /**
     * Write a console fatal message
     * @param msg the message body
     * @param timer a boolean value indicates whether needs to add a timestamp for the log
     */
    fatal(msg: string, timer?: boolean): void;
}

/** Tianyu Performance recorder */
export interface IPerfRecorder {
    /** the recording id */
    id: string;
    /** the start time number */
    start: number;
}
