/**@format */

export function getBoolean(value: any): boolean {
    if (value === null) {
        return false;
    }

    switch (typeof value) {
        case "boolean":
            return value;
        case "number":
            return !!value;
        case "string":
            if (!value) {
                return false;
            }
            return value.toLowerCase() === "false" ? false : true;
        case "undefined":
            return false;
        default:
            return true;
    }
}
