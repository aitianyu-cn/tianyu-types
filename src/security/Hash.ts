/**@format */

import { Integer } from "../core/object/Integer";

/** Generate a hash code number of the string */
export function hash(source: string): number {
    let length = source.length;
    let hashCode = 0;
    while (length--) {
        hashCode = Integer.left(hashCode, 5) - hashCode + source.charCodeAt(length);
        hashCode = Integer.and(hashCode, hashCode); // convert to 32 bit
    }
    return hashCode;
}
