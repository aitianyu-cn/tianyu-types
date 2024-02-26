/**@format */

/**A record object type of boolean */
export type MapOfBoolean = Record<string, boolean>;
/**A record object type of string array */
export type MapOfStrings = Record<string, string[]>;
/**A record object type of string */
export type MapOfString = Record<string, string>;
/**A record object type of customized */
export type MapOfType<T> = Record<string, T>;

/** no parameter call back function */
export type CallbackAction = () => void;
/** call back function with customized type parameter */
export type CallbackActionT<T> = (value: T) => void;

/** Tianyu Comparable Interface */
export interface IComparable {
    /** Get a string what can indicate the object unified */
    getString(): string;
    /** Get a number which is the hash value of the object instance */
    getHashCode(): number;
}
