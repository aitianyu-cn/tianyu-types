/**@format */

/** Exception base class */
export class Exception extends Error {
    public constructor(msg?: string, options?: ErrorOptions) {
        super(msg, options);
    }

    /**
     * Get a string of the Exception object
     *
     * @returns return an error message
     */
    public toString(): string {
        return this.message;
    }
}
