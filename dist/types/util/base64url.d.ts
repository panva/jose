interface Base64UrlEncode {
    (input: Uint8Array | string): string;
}
interface Base64UrlDecode {
    (input: Uint8Array | string): Uint8Array;
}
export declare const encode: Base64UrlEncode;
export declare const decode: Base64UrlDecode;
export {};
