import type { DigestFunction } from '../runtime/interfaces.d';
export declare const encoder: TextEncoder;
export declare const decoder: TextDecoder;
export declare function concat(...buffers: Uint8Array[]): Uint8Array;
export declare function p2s(alg: string, p2sInput: Uint8Array): Uint8Array;
export declare function uint64be(value: number): Uint8Array;
export declare function uint32be(value: number): Uint8Array;
export declare function lengthAndInput(input: Uint8Array): Uint8Array;
export declare function concatKdf(digest: DigestFunction, secret: Uint8Array, bits: number, value: Uint8Array): Promise<Uint8Array>;
