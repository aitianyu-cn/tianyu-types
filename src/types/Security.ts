/**@format */

/** Encrypt Option Type */
export enum EncryptOption {
    Encryption,
    Decryption,
}

/** An Interface of the Cipher */
export interface ICipher {
    /**
     * To encode the source value
     *
     * @param source the source value
     * @returns return the encoded value
     */
    encryption(source: number[]): number[];

    /**
     * To decode the encoded value
     *
     * @param source the encoded value
     * @returns return the decoded value
     */
    decryption(source: number[]): number[];
}
