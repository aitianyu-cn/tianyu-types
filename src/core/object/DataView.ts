/** @format */

/** DataView Object Type */
export class DataView {
    /**
     * Create a new node:DataView from given data buffer
     *
     * @param data source data buffer
     * @returns return node:DataView type equals to given data buffer
     */
    public static parse(data: ArrayBuffer | Int8Array | Uint8Array | Uint8ClampedArray): globalThis.DataView {
        if (data instanceof Int8Array || data instanceof Uint8Array || data instanceof Uint8ClampedArray) {
            return new globalThis.DataView(data.buffer, data.byteOffset, data.byteLength);
        }

        if (data instanceof ArrayBuffer) {
            return new globalThis.DataView(data);
        }

        throw new Error("Expected `data` to be an ArrayBuffer, Buffer, Int8Array, Uint8Array or Uint8ClampedArray");
    }
}
