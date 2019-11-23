/// <reference types="node" />
// TypeScript Version: 3.6

/* tslint:disable:strict-export-declare-modifiers */

import { KeyObject, PrivateKeyInput, PublicKeyInput } from 'crypto';

export type use = 'sig' | 'enc';
export type keyOperation = 'sign' | 'verify' | 'encrypt' | 'decrypt' | 'wrapKey' | 'unwrapKey' | 'deriveKey';
export interface BasicParameters {
  alg?: string;
  use?: use;
  kid?: string;
  key_ops?: keyOperation[];
}
export interface KeyParameters extends BasicParameters {
  x5c?: string[];
  x5t?: string;
  'x5t#S256'?: string;
}
export type ECCurve = 'P-256' | 'secp256k1' | 'P-384' | 'P-521';
export type OKPCurve = 'Ed25519' | 'Ed448' | 'X25519' | 'X448';
export type keyType = 'RSA' | 'EC' | 'OKP' | 'oct';
export type asymmetricKeyObjectTypes = 'private' | 'public';
export type keyObjectTypes = asymmetricKeyObjectTypes | 'secret';
export type JWTProfiles = 'id_token';

export interface JWKOctKey extends BasicParameters { // no x5c
  kty: 'oct';
  k?: string;
}

export interface JWKECKey extends KeyParameters {
  kty: 'EC';
  crv: ECCurve;
  x: string;
  y: string;
  d?: string;
}

export interface JWKOKPKey extends KeyParameters {
  kty: 'OKP';
  crv: OKPCurve;
  x: string;
  d?: string;
}

export interface JWKRSAKey extends KeyParameters {
  kty: 'RSA';
  e: string;
  n: string;
  d?: string;
  p?: string;
  q?: string;
  dp?: string;
  dq?: string;
  qi?: string;
}

export type JSONWebKey = JWKRSAKey | JWKOKPKey | JWKECKey | JWKOctKey;

export interface JSONWebKeySet {
  keys: JSONWebKey[];
}

export interface ImportOptions {
  calculateMissingRSAPrimes?: boolean;
}

export namespace JWK {
  interface pemEncodingOptions {
    type?: string;
    cipher?: string;
    passphrase?: string;
  }

  class Key {
    kty: keyType;
    type: keyObjectTypes;
    private: boolean;
    public: boolean;
    secret: boolean;
    alg?: string;
    use?: use;
    key_ops?: keyOperation[];
    kid: string;
    thumbprint: string;
    x5c?: string[];
    x5t?: string;
    'x5t#S256'?: string;
    keyObject: KeyObject;

    toPEM(private?: boolean, encoding?: pemEncodingOptions): string;

    algorithms(operation?: keyOperation): Set<string>;
  }

  class RSAKey extends Key {
    kty: 'RSA';
    type: asymmetricKeyObjectTypes;
    secret: false;
    e: string;
    n: string;
    d?: string;
    p?: string;
    q?: string;
    dp?: string;
    dq?: string;
    qi?: string;

    toJWK(private?: boolean): JWKRSAKey;
  }

  class ECKey extends Key {
    kty: 'EC';
    secret: false;
    type: asymmetricKeyObjectTypes;
    crv: ECCurve;
    x: string;
    y: string;
    d?: string;

    toJWK(private?: boolean): JWKECKey;
  }

  class OKPKey extends Key {
    kty: 'OKP';
    secret: false;
    type: asymmetricKeyObjectTypes;
    crv: OKPCurve;
    x: string;
    d?: string;

    toJWK(private?: boolean): JWKOKPKey;
  }

  class OctKey extends Key {
    kty: 'oct';
    type: 'secret';
    private: false;
    public: false;
    secret: true;
    k?: string;

    toJWK(private?: boolean): JWKOctKey;
  }

  type KeyInput = PrivateKeyInput | PublicKeyInput | string | Buffer;

  function isKey(object: any): boolean;

  function asKey(key: KeyObject | KeyInput, parameters?: KeyParameters): RSAKey | ECKey | OKPKey | OctKey;
  function asKey(jwk: JWKOctKey): OctKey;
  function asKey(jwk: JWKRSAKey, options?: ImportOptions): RSAKey;
  function asKey(jwk: JWKECKey): ECKey;
  function asKey(jwk: JWKOKPKey): OKPKey;

  /*
   * @deprecated in favor of asKey
   */
  function importKey(key: KeyObject | KeyInput, parameters?: KeyParameters): RSAKey | ECKey | OKPKey | OctKey;
  function importKey(jwk: JWKOctKey): OctKey;
  function importKey(jwk: JWKRSAKey): RSAKey;
  function importKey(jwk: JWKECKey): ECKey;
  function importKey(jwk: JWKOKPKey): OKPKey;

  function generate(kty: 'EC', crv?: ECCurve, parameters?: BasicParameters, private?: boolean): Promise<ECKey>;
  function generate(kty: 'OKP', crv?: OKPCurve, parameters?: BasicParameters, private?: boolean): Promise<OKPKey>;
  function generate(kty: 'RSA', bitlength?: number, parameters?: BasicParameters, private?: boolean): Promise<RSAKey>;
  function generate(kty: 'oct', bitlength?: number, parameters?: BasicParameters): Promise<OctKey>;

  function generateSync(kty: 'EC', crv?: ECCurve, parameters?: BasicParameters, private?: boolean): ECKey;
  function generateSync(kty: 'OKP', crv?: OKPCurve, parameters?: BasicParameters, private?: boolean): OKPKey;
  function generateSync(kty: 'RSA', bitlength?: number, parameters?: BasicParameters, private?: boolean): RSAKey;
  function generateSync(kty: 'oct', bitlength?: number, parameters?: BasicParameters): OctKey;
}

export namespace JWKS {
  interface KeyQuery extends BasicParameters {
    kty?: keyType;
    x5t?: string;
    'x5t#S256'?: string;
  }

  class KeyStore {
    constructor(keys?: JWK.Key[]);

    size: number;

    add(key: JWK.Key): void;
    remove(key: JWK.Key): void;
    all(parameters?: KeyQuery): JWK.Key[];
    get(parameters?: KeyQuery): JWK.Key;

    toJWKS(private?: boolean): JSONWebKeySet;

    generate(kty: 'EC', crv?: ECCurve, parameters?: BasicParameters, private?: boolean): void;
    generate(kty: 'OKP', crv?: OKPCurve, parameters?: BasicParameters, private?: boolean): void;
    generate(kty: 'RSA', bitlength?: number, parameters?: BasicParameters, private?: boolean): void;
    generate(kty: 'oct', bitlength?: number, parameters?: BasicParameters): void;

    generateSync(kty: 'EC', crv?: ECCurve, parameters?: BasicParameters, private?: boolean): void;
    generateSync(kty: 'OKP', crv?: OKPCurve, parameters?: BasicParameters, private?: boolean): void;
    generateSync(kty: 'RSA', bitlength?: number, parameters?: BasicParameters, private?: boolean): void;
    generateSync(kty: 'oct', bitlength?: number, parameters?: BasicParameters): void;

    /*
     * @deprecated in favor of JWKS.asKeyStore
     */
    static fromJWKS(jwks: JSONWebKeySet): KeyStore;
  }

  interface JWKSImportOptions extends ImportOptions {
    ignoreErrors?: boolean;
  }

  function asKeyStore(jwks: JSONWebKeySet, options?: JWKSImportOptions): KeyStore;
}

export namespace JWS {
  interface JWSJSON {
    payload: string;
  }

  interface JWSRecipient {
    signature: string;
    protected?: string;
    header?: object;
  }

  interface FlattenedJWS extends JWSRecipient, JWSJSON {}

  interface GeneralJWS extends JWSJSON {
    signatures: JWSRecipient[];
  }

  class Sign {
    constructor(payload: string | Buffer | object);

    recipient(key: JWK.Key, protected?: object, header?: object): void;

    sign(serialization: 'compact'): string;
    sign(serialization: 'flattened'): FlattenedJWS;
    sign(serialization: 'general'): GeneralJWS;
  }

  function sign(payload: string | Buffer | object, key: JWK.Key, protected?: object): string;
  namespace sign {
    function flattened(payload: string | Buffer | object, key: JWK.Key, protected?: object, header?: object): FlattenedJWS;
    function general(payload: string | Buffer | object, key: JWK.Key, protected?: object, header?: object): GeneralJWS;
  }

  interface VerifyOptions<komplet = false, parse = true> {
    complete?: komplet;
    parse?: parse;
    encoding?: BufferEncoding;
    crit?: string[];
    algorithms?: string[];
  }

  interface completeVerification<T> {
    payload: T;
    key: JWK.Key;
    protected?: object;
    header?: object;
  }

  function verify(jws: string | FlattenedJWS | GeneralJWS, key: JWK.Key | JWKS.KeyStore, options?: VerifyOptions): string | object;
  function verify(jws: string | FlattenedJWS | GeneralJWS, key: JWK.Key | JWKS.KeyStore, options?: VerifyOptions<false, false>): Buffer;
  function verify(jws: string | FlattenedJWS | GeneralJWS, key: JWK.Key | JWKS.KeyStore, options?: VerifyOptions<true>): completeVerification<string | object>;
  function verify(jws: string | FlattenedJWS | GeneralJWS, key: JWK.Key | JWKS.KeyStore, options?: VerifyOptions<true, false>): completeVerification<Buffer>;
}

export namespace JWE {
  interface JWEJSON {
    protected?: string;
    unprotected?: object;
    ciphertext: string;
    tag: string;
    iv: string;
    aad?: string;
  }

  interface JWERecipient {
    header?: object;
    encrypted_key: string;
  }

  interface FlattenedJWE extends JWERecipient, JWEJSON {}

  interface GeneralJWE extends JWEJSON {
    recipients: JWERecipient[];
  }

  class Encrypt {
    constructor(cleartext: string | Buffer, protected?: object, unprotected?: object, aad?: string);

    recipient(key: JWK.Key, header?: object): void;

    encrypt(serialization: 'compact'): string;
    encrypt(serialization: 'flattened'): FlattenedJWE;
    encrypt(serialization: 'general'): GeneralJWE;
  }

  function encrypt(payload: string | Buffer, key: JWK.Key, protected?: object): string;
  namespace encrypt {
    function flattened(payload: string | Buffer, key: JWK.Key, protected?: object, header?: object, aad?: string): FlattenedJWE;
    function general(payload: string | Buffer, key: JWK.Key, protected?: object, header?: object, aad?: string): GeneralJWE;
  }

  interface DecryptOptions<komplet> {
    complete?: komplet;
    crit?: string[];
    algorithms?: string[];
  }

  interface completeDecrypt {
    cleartext: Buffer;
    key: JWK.Key;
    cek: JWK.OctKey;
    aad?: string;
    header?: object;
    unprotected?: object;
    protected?: object;
  }

  function decrypt(jwe: string | FlattenedJWE | GeneralJWE, key: JWK.Key | JWKS.KeyStore, options?: DecryptOptions<false>): Buffer;
  function decrypt(jwe: string | FlattenedJWE | GeneralJWE, key: JWK.Key | JWKS.KeyStore, options?: DecryptOptions<true>): completeDecrypt;
}

export namespace JWT {
  interface completeResult {
    payload: object;
    header: object;
    signature: string;
    key: JWK.Key;
  }

  interface DecodeOptions<komplet> {
    complete?: komplet;
  }

  function decode(jwt: string, options?: DecodeOptions<false>): object;
  function decode(jwt: string, options?: DecodeOptions<true>): completeResult;

  interface VerifyOptions<komplet> {
    complete?: komplet;
    ignoreExp?: boolean;
    ignoreNbf?: boolean;
    ignoreIat?: boolean;
    maxTokenAge?: string;
    subject?: string;
    issuer?: string;
    maxAuthAge?: string;
    jti?: string;
    clockTolerance?: string;
    audience?: string | string[];
    algorithms?: string[];
    nonce?: string;
    now?: Date;
    crit?: string[];
    profile?: JWTProfiles;
  }
  function verify(jwt: string, key: JWK.Key | JWKS.KeyStore, options?: VerifyOptions<false>): object;
  function verify(jwt: string, key: JWK.Key | JWKS.KeyStore, options?: VerifyOptions<true>): completeResult;

  interface SignOptions {
    iat?: boolean;
    kid?: boolean;
    subject?: string;
    issuer?: string;
    audience?: string | string[];
    header?: object;
    algorithm?: string;
    expiresIn?: string;
    notBefore?: string;
    jti?: string;
    nonce?: string;
    now?: Date;
  }
  function sign(payload: object, key: JWK.Key, options?: SignOptions): string;
}

export namespace errors {
  class JOSEError extends Error {}
  class JOSEMultiError extends JOSEError {}

  class JOSEAlgNotWhitelisted extends JOSEError {}
  class JOSECritNotUnderstood extends JOSEError {}
  class JOSENotSupported extends JOSEError {}

  class JWEDecryptionFailed extends JOSEError {}
  class JWEInvalid extends JOSEError {}

  class JWKImportFailed extends JOSEError {}
  class JWKInvalid extends JOSEError {}
  class JWKKeySupport extends JOSEError {}

  class JWKSNoMatchingKey extends JOSEError {}

  class JWSInvalid extends JOSEError {}
  class JWSVerificationFailed extends JOSEError {}

  class JWTClaimInvalid extends JOSEError {}
  class JWTMalformed extends JOSEError {}
}
