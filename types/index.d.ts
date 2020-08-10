/// <reference types="node" />
// TypeScript Version: 3.6

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
export type Curves = OKPCurve | ECCurve;
export type keyType = 'RSA' | 'EC' | 'OKP' | 'oct';
export type asymmetricKeyObjectTypes = 'private' | 'public';
export type keyObjectTypes = asymmetricKeyObjectTypes | 'secret';
export type JWTProfiles = 'id_token' | 'at+JWT' | 'logout_token';
export type KeyInput = PrivateKeyInput | PublicKeyInput | string | Buffer;
export type ProduceKeyInput = JWK.Key | KeyObject | KeyInput | JWKOctKey | JWKRSAKey | JWKECKey | JWKOKPKey;
export type ConsumeKeyInput = ProduceKeyInput | JWKS.KeyStore;
export type NoneKey = JWK.NoneKey;
export type EmbeddedJWK = JWK.EmbeddedJWK;
export type EmbeddedX5C = JWK.EmbeddedX5C;
export type EmbeddedVerifyKeys = EmbeddedJWK | EmbeddedX5C;
export type ProduceKeyInputWithNone = ProduceKeyInput | NoneKey;
export type ConsumeKeyInputWithNone = ConsumeKeyInput | NoneKey;

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

  interface Key {
    readonly private: boolean;
    readonly public: boolean;
    readonly secret: boolean;
    readonly type: keyObjectTypes;

    readonly kty: keyType;
    readonly alg?: string;
    readonly use?: use;
    readonly key_ops?: ReadonlyArray<keyOperation>;
    readonly kid: string;
    readonly thumbprint: string;
    readonly x5c?: ReadonlyArray<string>;
    readonly x5t?: string;
    readonly 'x5t#S256'?: string;
    readonly keyObject: KeyObject;

    readonly crv?: ECCurve | OKPCurve;
    readonly d?: string;
    readonly dp?: string;
    readonly dq?: string;
    readonly e?: string;
    readonly k?: string;
    readonly n?: string;
    readonly p?: string;
    readonly q?: string;
    readonly qi?: string;
    readonly x?: string;
    readonly y?: string;

    toPEM(private?: boolean, encoding?: pemEncodingOptions): string;

    algorithms(operation?: keyOperation): Set<string>;
  }

  interface RSAKey extends Key {
    readonly secret: false;
    readonly type: asymmetricKeyObjectTypes;

    readonly kty: 'RSA';

    readonly e: string;
    readonly n: string;
    readonly d?: string;
    readonly p?: string;
    readonly q?: string;
    readonly dp?: string;
    readonly dq?: string;
    readonly qi?: string;

    readonly crv: undefined;
    readonly k: undefined;
    readonly x: undefined;
    readonly y: undefined;

    toJWK(private?: boolean): JWKRSAKey;
  }

  interface ECKey extends Key {
    readonly secret: false;
    readonly type: asymmetricKeyObjectTypes;

    readonly kty: 'EC';

    readonly crv: ECCurve;
    readonly x: string;
    readonly y: string;
    readonly d?: string;

    readonly dp: undefined;
    readonly dq: undefined;
    readonly e: undefined;
    readonly k: undefined;
    readonly n: undefined;
    readonly p: undefined;
    readonly q: undefined;
    readonly qi: undefined;

    toJWK(private?: boolean): JWKECKey;
  }

  interface OKPKey extends Key {
    readonly secret: false;
    readonly type: asymmetricKeyObjectTypes;

    readonly kty: 'OKP';

    readonly crv: OKPCurve;
    readonly x: string;
    readonly d?: string;

    readonly dp: undefined;
    readonly dq: undefined;
    readonly e: undefined;
    readonly k: undefined;
    readonly n: undefined;
    readonly p: undefined;
    readonly q: undefined;
    readonly qi: undefined;
    readonly y: undefined;

    toJWK(private?: boolean): JWKOKPKey;
  }

  interface OctKey extends Key {
    readonly private: false;
    readonly public: false;
    readonly secret: true;
    readonly type: 'secret';

    readonly kty: 'oct';

    readonly k?: string;

    readonly crv: undefined;
    readonly d: undefined;
    readonly dp: undefined;
    readonly dq: undefined;
    readonly e: undefined;
    readonly n: undefined;
    readonly p: undefined;
    readonly q: undefined;
    readonly qi: undefined;
    readonly x: undefined;
    readonly y: undefined;

    toJWK(private?: boolean): JWKOctKey;
  }

  interface NoneKey {
    readonly type: 'unsecured';
    readonly alg: 'none';
    algorithms(operation?: keyOperation): Set<string>;
  }

  const None: NoneKey;

  interface EmbeddedJWK {
    readonly type: 'embedded';
    algorithms(operation?: keyOperation): Set<string>;
  }

  const EmbeddedJWK: EmbeddedJWK;

  interface EmbeddedX5C {
    readonly type: 'embedded';
    algorithms(operation?: keyOperation): Set<string>;
  }

  const EmbeddedX5C: EmbeddedX5C;

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

  function generate(kty: keyType, crvOrSize?: Curves | number, parameters?: BasicParameters, private?: boolean): Promise<JWK.Key>;
  function generate(kty: 'EC', crv?: ECCurve, parameters?: BasicParameters, private?: boolean): Promise<ECKey>;
  function generate(kty: 'OKP', crv?: OKPCurve, parameters?: BasicParameters, private?: boolean): Promise<OKPKey>;
  function generate(kty: 'RSA', bitlength?: number, parameters?: BasicParameters, private?: boolean): Promise<RSAKey>;
  function generate(kty: 'oct', bitlength?: number, parameters?: BasicParameters): Promise<OctKey>;

  function generateSync(kty: keyType, crvOrSize?: Curves | number, parameters?: BasicParameters, private?: boolean): JWK.Key;
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
    crv?: string;
    thumbprint?: string;
  }

  class KeyStore {
    constructor(keys?: JWK.Key[]);

    readonly size: number;

    add(key: JWK.Key): void;
    remove(key: JWK.Key): void;
    all(parameters?: KeyQuery): JWK.Key[];
    get(parameters?: KeyQuery): JWK.Key;

    toJWKS(private?: boolean): JSONWebKeySet;

    generate(kty: keyType, crvOrSize?: Curves | number, parameters?: BasicParameters, private?: boolean): Promise<void>;
    generate(kty: 'EC', crv?: ECCurve, parameters?: BasicParameters, private?: boolean): Promise<void>;
    generate(kty: 'OKP', crv?: OKPCurve, parameters?: BasicParameters, private?: boolean): Promise<void>;
    generate(kty: 'RSA', bitlength?: number, parameters?: BasicParameters, private?: boolean): Promise<void>;
    generate(kty: 'oct', bitlength?: number, parameters?: BasicParameters): Promise<void>;

    generateSync(kty: keyType, crvOrSize?: Curves | number, parameters?: BasicParameters, private?: boolean): void;
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

    recipient(key: ProduceKeyInputWithNone, protected?: object, header?: object): void;

    sign(serialization: 'compact'): string;
    sign(serialization: 'flattened'): FlattenedJWS;
    sign(serialization: 'general'): GeneralJWS;
  }

  function sign(payload: string | Buffer | object, key: ProduceKeyInputWithNone, protected?: object): string;
  namespace sign {
    function flattened(payload: string | Buffer | object, key: ProduceKeyInputWithNone, protected?: object, header?: object): FlattenedJWS;
    function general(payload: string | Buffer | object, key: ProduceKeyInputWithNone, protected?: object, header?: object): GeneralJWS;
  }

  interface VerifyOptions<komplet = false, parse = true> {
    complete?: komplet;
    parse?: parse;
    encoding?: BufferEncoding;
    crit?: string[];
    algorithms?: string[];
  }

  interface completeVerification<T, T2> {
    payload: T;
    key: T2;
    protected?: object;
    header?: object;
  }

  function verify(jws: string | FlattenedJWS | GeneralJWS, key: ConsumeKeyInputWithNone | EmbeddedVerifyKeys, options?: VerifyOptions): string | object;
  function verify(jws: string | FlattenedJWS | GeneralJWS, key: ConsumeKeyInputWithNone | EmbeddedVerifyKeys, options?: VerifyOptions<false, false>): Buffer;
  function verify(jws: string | FlattenedJWS | GeneralJWS, key: ConsumeKeyInput | EmbeddedVerifyKeys, options?: VerifyOptions<true>): completeVerification<string | object, JWK.Key>;
  function verify(jws: string | FlattenedJWS | GeneralJWS, key: ConsumeKeyInput | EmbeddedVerifyKeys, options?: VerifyOptions<true, false>): completeVerification<Buffer, JWK.Key>;
  function verify(jws: string | FlattenedJWS | GeneralJWS, key: NoneKey, options?: VerifyOptions<true>): completeVerification<string | object, NoneKey>;
  function verify(jws: string | FlattenedJWS | GeneralJWS, key: NoneKey, options?: VerifyOptions<true, false>): completeVerification<Buffer, NoneKey>;
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

    recipient(key: ProduceKeyInput, header?: object): void;

    encrypt(serialization: 'compact'): string;
    encrypt(serialization: 'flattened'): FlattenedJWE;
    encrypt(serialization: 'general'): GeneralJWE;
  }

  function encrypt(payload: string | Buffer, key: ProduceKeyInput, protected?: object): string;
  namespace encrypt {
    function flattened(payload: string | Buffer, key: ProduceKeyInput, protected?: object, header?: object, aad?: string): FlattenedJWE;
    function general(payload: string | Buffer, key: ProduceKeyInput, protected?: object, header?: object, aad?: string): GeneralJWE;
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

  function decrypt(jwe: string | FlattenedJWE | GeneralJWE, key: ConsumeKeyInput, options?: DecryptOptions<false>): Buffer;
  function decrypt(jwe: string | FlattenedJWE | GeneralJWE, key: ConsumeKeyInput, options?: DecryptOptions<true>): completeDecrypt;
}

export namespace JWT {
  interface completeResult<T = JWK.Key> {
    payload: object;
    header: object;
    signature: string;
    key: T;
  }

  interface DecodeOptions<komplet> {
    complete?: komplet;
  }

  function decode(jwt: string, options?: DecodeOptions<false>): object;
  function decode(jwt: string, options?: DecodeOptions<true>): completeResult<undefined>;

  interface VerifyOptions<komplet> {
    complete?: komplet;
    ignoreExp?: boolean;
    ignoreNbf?: boolean;
    ignoreIat?: boolean;
    maxTokenAge?: string;
    subject?: string;
    issuer?: string | string[];
    maxAuthAge?: string;
    jti?: string;
    clockTolerance?: string;
    audience?: string | string[];
    algorithms?: string[];
    nonce?: string;
    typ?: string;
    now?: Date;
    crit?: string[];
    profile?: JWTProfiles;
  }

  function verify(jwt: string, key: ConsumeKeyInputWithNone | EmbeddedVerifyKeys, options?: VerifyOptions<false>): object;
  function verify(jwt: string, key: ConsumeKeyInput | EmbeddedVerifyKeys, options?: VerifyOptions<true>): completeResult;
  function verify(jwt: string, key: NoneKey, options?: VerifyOptions<true>): completeResult<NoneKey>;

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

  function sign(payload: object, key: ProduceKeyInputWithNone, options?: SignOptions): string;

  interface VerifyProfileOptions<profile> {
    issuer: string | string[];
    audience: string | string[];
    profile?: profile;
  }

  namespace IdToken {
    function verify(jwt: string, key: ConsumeKeyInputWithNone | EmbeddedVerifyKeys, options: VerifyOptions<false> & VerifyProfileOptions<'id_token'>): object;
    function verify(jwt: string, key: ConsumeKeyInput | EmbeddedVerifyKeys, options: VerifyOptions<true> & VerifyProfileOptions<'id_token'>): completeResult;
    function verify(jwt: string, key: NoneKey, options: VerifyOptions<true> & VerifyProfileOptions<'id_token'>): completeResult<NoneKey>;
  }

  namespace LogoutToken {
    function verify(jwt: string, key: ConsumeKeyInputWithNone | EmbeddedVerifyKeys, options: VerifyOptions<false> & VerifyProfileOptions<'logout_token'>): object;
    function verify(jwt: string, key: ConsumeKeyInput | EmbeddedVerifyKeys, options: VerifyOptions<true> & VerifyProfileOptions<'logout_token'>): completeResult;
    function verify(jwt: string, key: NoneKey, options: VerifyOptions<true> & VerifyProfileOptions<'logout_token'>): completeResult<NoneKey>;
  }

  namespace AccessToken {
    function verify(jwt: string, key: ConsumeKeyInputWithNone | EmbeddedVerifyKeys, options: VerifyOptions<false> & VerifyProfileOptions<'at+JWT'>): object;
    function verify(jwt: string, key: ConsumeKeyInput | EmbeddedVerifyKeys, options: VerifyOptions<true> & VerifyProfileOptions<'at+JWT'>): completeResult;
    function verify(jwt: string, key: NoneKey, options: VerifyOptions<true> & VerifyProfileOptions<'at+JWT'>): completeResult<NoneKey>;
  }
}

export namespace errors {
  class JOSEError<T = string> extends Error {
    code: T;
  }

  class JOSEInvalidEncoding extends JOSEError<'ERR_JOSE_INVALID_ENCODING'> {}
  class JOSEMultiError extends JOSEError<'ERR_JOSE_MULTIPLE_ERRORS'> {}

  class JOSEAlgNotWhitelisted extends JOSEError<'ERR_JOSE_ALG_NOT_WHITELISTED'> {}
  class JOSECritNotUnderstood extends JOSEError<'ERR_JOSE_CRIT_NOT_UNDERSTOOD'> {}
  class JOSENotSupported extends JOSEError<'ERR_JOSE_NOT_SUPPORTED'> {}

  class JWEDecryptionFailed extends JOSEError<'ERR_JWE_DECRYPTION_FAILED'> {}
  class JWEInvalid extends JOSEError<'ERR_JWE_INVALID'> {}

  class JWKImportFailed extends JOSEError<'ERR_JWK_IMPORT_FAILED'> {}
  class JWKInvalid extends JOSEError<'ERR_JWK_INVALID'> {}
  class JWKKeySupport extends JOSEError<'ERR_JWK_KEY_SUPPORT'> {}

  class JWKSNoMatchingKey extends JOSEError<'ERR_JWKS_NO_MATCHING_KEY'> {}

  class JWSInvalid extends JOSEError<'ERR_JWS_INVALID'> {}
  class JWSVerificationFailed extends JOSEError<'ERR_JWS_VERIFICATION_FAILED'> {}

  class JWTClaimInvalid<T = 'ERR_JWT_CLAIM_INVALID'> extends JOSEError<T> {
    constructor(message?: string, claim?: string, reason?: string);

    claim: string;
    reason: 'prohibited' | 'missing' | 'invalid' | 'check_failed' | 'unspecified';
  }
  class JWTExpired extends JWTClaimInvalid<'ERR_JWT_EXPIRED'> {}
  class JWTMalformed extends JOSEError<'ERR_JWT_MALFORMED'> {}
}
