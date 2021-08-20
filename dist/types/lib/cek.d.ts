declare const bitLengths: Map<string, number>;
declare const factory: (random: (array: Uint8Array) => Uint8Array) => (alg: string) => Uint8Array;
export default factory;
export { bitLengths };
