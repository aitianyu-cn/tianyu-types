/**@format */

/** Array type related tools */
export class ArrayHelper {
    /**
     * To merge multiple arrays into a new array and remove duplicated elements.
     *
     * @param {any[]} array arrays
     * @returns return a new array
     */
    public static merge(...array: any[]): any[] {
        if (array.length === 0) {
            return [];
        }

        const result: any[] = [];
        for (const item of array) {
            if (Array.isArray(item)) {
                for (const arrItem of item) {
                    if (!result.includes(arrItem)) {
                        result.push(arrItem);
                    }
                }
            } else {
                if (!result.includes(item)) {
                    result.push(item);
                }
            }
        }

        return result;
    }
}
