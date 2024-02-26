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
}
