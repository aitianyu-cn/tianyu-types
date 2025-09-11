/**@format */

export class StringHelper {
    public static format(source: string, args?: (string | number)[] | string): string {
        if (!args) {
            return source;
        }

        const argument = Array.isArray(args) ? args : [args];
        return source.replace(/('')|\{([0-9]+(?:\s*,[^{}]*)?)\}|[{}]/g, (_match, $1, $2, _$3) => {
            if ($1) {
                return "'";
            } else if ($2) {
                return String(argument[parseInt($2, 10)]);
            }
            return "";
        });
    }

    /**
     * @deprecated
     *
     * convert an object to be a string.
     * This is an unsafe function to convert an object to be string. suggest to use stringifySafe to convert object to string.
     *
     * @param src source object
     * @returns target string
     */
    public static stringify(data: any): string {
        const type = typeof data;
        if (type === "undefined") {
            return "undefined";
        }
        if (type === "function") {
            throw new Error("Could not stringify a 'function' type object");
        }
        if (type === "string") {
            return data;
        }
        if (type === "bigint" || type === "number" || type === "symbol" || type === "boolean") {
            return data.toString();
        }
        return JSON.stringify(data);
    }

    /**
     * convert an object to be a string safty. empty string will be return when error occurs in converting
     *
     * @param src source object
     * @returns target string
     */
    public static stringifySafe(data: any): string {
        try {
            return StringHelper.stringify(data);
        } catch {
            return "";
        }
    }
}
