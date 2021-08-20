import type { KeyLike } from '../types';
declare const checkKeyType: (alg: string, key: KeyLike, usage: 'sign' | 'verify' | 'encrypt' | 'decrypt') => void;
export default checkKeyType;
