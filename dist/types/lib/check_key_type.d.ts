import type { KeyLike } from '../types.d';
declare const checkKeyType: (alg: string, key: KeyLike, usage: 'sign' | 'verify' | 'encrypt' | 'decrypt') => void;
export default checkKeyType;
