/**@format */

/** Generate a hash code number of the string */
export function hash(source: string): number {
    let length = source.length;
    let hashCode = 0;
    while (length--) {
        hashCode = (hashCode << 5) - hashCode + source.charCodeAt(length);
        hashCode = hashCode & hashCode; // convert to 32 bit
    }
    return hashCode;
}
