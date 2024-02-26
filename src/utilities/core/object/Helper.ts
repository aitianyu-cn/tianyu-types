/**@format */

import { ObjectCloneFunctionNotSupportException } from "../Errors";

/** Object Helper of Tianyu to provide data type checking, objects comparing, validation, data clone and other functions */
export class ObjectHelper {
    /**
     * check whether the specified value does extend from nodejs native type
     *
     * @param {any} value supported value type of tianyu store
     * @returns {boolean} return true if the value is based on type number, string, boolean, function, otherwise false
     */
    public static isSimpleDataType(value: any): boolean {
        if (!!!value) return true;

        const typeofValue = typeof value;
        return typeofValue === "boolean" || typeofValue === "string" || typeofValue === "number" || typeofValue === "symbol";
    }

    /**
     * get a deep copy from source
     *
     * @param {any} sources the specified source value
     * @returns {any} return a new value that is independent from sources
     */
    public static clone(source: any): any {
        return ObjectHelper._clone(source);
    }

    private static _clone(source: any): any {
        if (typeof source === "function") {
            throw new ObjectCloneFunctionNotSupportException();
        }

        // check if source is simple data type, return directly
        if (ObjectHelper.isSimpleDataType(source)) {
            return source;
        }

        if (Array.isArray(source)) {
            // if is array type
            return ObjectHelper._cloneArray(source);
        }

        // otherwise, source value is a record type
        return ObjectHelper._cloneRecordType(source);
    }
    private static _cloneArray(source: any[]): any {
        // create a new array to save result
        const result: any[] = [];
        if (0 === source.length) {
            // if source value is empty array, return directly
            return result;
        }

        // loop all the item in the source value and to clone the item
        for (const item of source) {
            result.push(ObjectHelper._clone(item));
        }
        return result;
    }
    private static _cloneRecordType(source: any): any {
        // get all the record key from source object
        const keys = Object.keys(source);
        if (0 === keys.length) {
            // if the object is empty, return an empty object
            return {};
        }

        const result: any = {};
        // loop all the items in the source object by the key name
        for (const keyName of keys) {
            const sourceItem = source[keyName];
            result[keyName] = ObjectHelper._clone(sourceItem);
        }
        return result;
    }

    /**
     * Check the object whether can be stringified
     *
     * @param obj be checked object
     * @returns return true is valid, otherwise false
     */
    public static validateSerializable(obj: any): boolean {
        // if type is function, is not invaliable to be string
        if (typeof obj === "function") {
            return false;
        }

        // if is simple data type, is valiable
        if (ObjectHelper.isSimpleDataType(obj)) {
            return true;
        }

        // if is array, check member
        if (Array.isArray(obj)) {
            for (const item of obj) {
                // contains invalid member, return false
                if (!ObjectHelper.validateSerializable(item)) {
                    return false;
                }
            }

            return true;
        }

        try {
            // if is object, check member
            const keys = Object.keys(obj);
            for (const keyName of keys) {
                const item = obj[keyName];
                // contains invalid member, return false
                if (!ObjectHelper.validateSerializable(item)) {
                    return false;
                }
            }
            return true;
        } catch {
            // if the object is not an object type, return false
            return false;
        }
    }

    /**
     * Compare two or more objects are the same or different
     *
     * @param objs the objects which need to be compared
     * @returns same - if all the objects are same, different - if at least one object is not same to other objects
     * @description if there are only one parameter or no parameter is provided, same result will be returned
     */
    public static compareObjects(...objs: any): "same" | "different" {
        // if objs less than 2, is not comparable
        if (objs.length < 2) {
            return "same";
        }

        // if the first obj is simple data type, return different if other objects is not simple obj
        // or the type is not totally same.
        if (ObjectHelper.isSimpleDataType(objs[0])) {
            return ObjectHelper._compareSimpleType(...objs);
        }

        // if the first obj is array type, check all the objects are array and to do the detail checking
        if (Array.isArray(objs[0])) {
            return ObjectHelper._compareArrayType(...objs);
        }

        return ObjectHelper._compareObjectType(...objs);
    }

    private static _compareSimpleType(...objs: any): "same" | "different" {
        const firstObjType = typeof objs[0];
        for (let i = 1; i < objs.length; ++i) {
            if (firstObjType !== typeof objs[i] || objs[0] !== objs[i]) {
                return "different";
            }
        }

        return "same";
    }
    private static _compareArrayType(...objs: any): "same" | "different" {
        for (let i = 1; i < objs.length; ++i) {
            // check the type and array length if the obj is array type
            if (!Array.isArray(objs[i]) || objs[i].length !== objs[0].length) {
                return "different";
            }
        }

        // loop each item of the array to have a detail checking
        for (let j = 0; j < objs[0].length; ++j) {
            // create a checking array
            const items: any[] = [objs[0][j]];
            for (let i = 1; i < objs.length; ++i) {
                // add all the items of the each object which have the same index
                items.push(objs[i][j]);
            }

            const cmpRes = ObjectHelper.compareObjects(...items);
            if (cmpRes !== "same") {
                return cmpRes;
            }
        }

        return "same";
    }
    private static _compareObjectType(...objs: any): "same" | "different" {
        try {
            // other cases, the first obj is not simple obj and array, take checking as object

            // start add all the objects keys
            const keysOfObjs: string[][] = [];
            keysOfObjs.push(Object.keys(objs[0]));

            // firstly, check the types of other objects
            for (let i = 1; i < objs.length; ++i) {
                keysOfObjs.push(Object.keys(objs[i]));
            }
            // check the keys are same or different
            if (ObjectHelper.compareObjects(...keysOfObjs) !== "same") {
                return "different";
            }

            // compare all the items
            for (const key of keysOfObjs[0]) {
                const items: any[] = [];
                for (const obj of objs) {
                    items.push(obj[key]);
                }

                // get the items compare result
                const cmpRes = ObjectHelper.compareObjects(...items);
                if (cmpRes !== "same") {
                    return cmpRes;
                }
            }

            return "same";
        } catch {
            return "different";
        }
    }
}
