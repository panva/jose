/// <reference types="node" />

import { KeyObject, PrivateKeyInput, PublicKeyInput } from 'crypto'

type use = 'sig' | 'enc'
interface KeyParameters {
    alg?: string
    use?: use
    kid?: string
}
type curve = 'P-256' | 'P-384' | 'P-521'
type keyType = 'RSA' | 'EC' | 'oct'

export namespace JWK {
    type keyOperation = 'encrypt' | 'decrypt' | 'sign' | 'verify' | 'wrapKey' | 'unwrapKey'

    class Key {
        kty: keyType
        private: boolean
        public: boolean
        alg?: string
        use?: use
        kid: string


        algorithms(operation?: keyOperation): Set<string>
    }

    interface JWKOctKey extends KeyParameters {
        kty: 'oct',
        k: string
    }

    interface JWKECKey extends KeyParameters {
        kty: 'EC'
        crv: curve
        x: string
        y: string
        d?: string
    }

    interface JWKRSAKey extends KeyParameters {
        kty: 'RSA'
        e: string
        n: string
        d?: string
        p?: string
        q?: string
        dp?: string
        dq?: string
        qi?: string
    }

    class RSAKey extends Key {
        kty: 'RSA'
        e: string
        n: string
        d?: string
        p?: string
        q?: string
        dp?: string
        dq?: string
        qi?: string

        toJWK(private?: boolean): JWKRSAKey
    }

    class ECKey extends Key {
        kty: 'EC'
        crv: curve
        x: string
        y: string
        d?: string

        toJWK(private?: boolean): JWKECKey
    }

    class OctKey extends Key {
        kty: 'oct'
        private: false
        public: false
        k: string

        toJWK(private?: boolean): JWKOctKey
    }

    export function isKey(object: any): boolean

    export function importKey(keyObject: KeyObject, parameters?: KeyParameters): RSAKey | ECKey | OctKey
    export function importKey(key: PrivateKeyInput | PublicKeyInput | string | Buffer, parameters?: KeyParameters): RSAKey | ECKey | OctKey
    export function importKey(jwk: JWKOctKey): OctKey
    export function importKey(jwk: JWKRSAKey): RSAKey
    export function importKey(jwk: JWKECKey): ECKey

    export function generate(kty: 'EC', crv?: curve, parameters?: KeyParameters, private?: boolean): Promise<ECKey>
    export function generate(kty: 'RSA', bitlength?: number, parameters?: KeyParameters, private?: boolean): Promise<RSAKey>
    export function generate(kty: 'oct', bitlength?: number, parameters?: KeyParameters): Promise<OctKey>

    export function generateSync(kty: 'EC', crv?: curve, parameters?: KeyParameters, private?: boolean): ECKey
    export function generateSync(kty: 'RSA', bitlength?: number, parameters?: KeyParameters, private?: boolean): RSAKey
    export function generateSync(kty: 'oct', bitlength?: number, parameters?: KeyParameters): OctKey
}

export namespace JWKS {
    interface KeyQuery extends KeyParameters {
        kty: keyType
    }

    class KeyStore {
        constructor(keys?: JWK.Key[])

        size: number

        add(key: JWK.Key): void
        remove(key: JWK.Key): void
        all(parameters?: KeyQuery): JWK.Key[]
        get(parameters?: KeyQuery): JWK.Key

        generate(kty: 'EC', crv?: curve, parameters?: KeyParameters, private?: boolean): void
        generate(kty: 'RSA', bitlength?: number, parameters?: KeyParameters, private?: boolean): void
        generate(kty: 'oct', bitlength?: number, parameters?: KeyParameters): void

        generateSync(kty: 'EC', crv?: curve, parameters?: KeyParameters, private?: boolean): void
        generateSync(kty: 'RSA', bitlength?: number, parameters?: KeyParameters, private?: boolean): void
        generateSync(kty: 'oct', bitlength?: number, parameters?: KeyParameters): void
    }
}

export namespace JWS {
    interface JWSJSON {
        payload: string
    }

    interface JWSRecipient {
        signature: string,
        protected?: string,
        header?: object
    }

    interface FlattenedJWS extends JWSRecipient, JWSJSON {}


    interface GeneralJWS extends JWSJSON {
        signatures: JWSRecipient[]
    }

    class Sign {
        constructor(payload: string | Buffer | object)

        recipient(key: JWK.Key, protected?: object, header?: object): void

        sign(serialization: 'compact'): string
        sign(serialization: 'flattened'): FlattenedJWS
        sign(serialization: 'general'): GeneralJWS
    }

    export function sign(payload: string | Buffer | object, key: JWK.Key, protected?: object): string
    namespace sign {
      export function flattened(payload: string | Buffer | object, key: JWK.Key, protected?: object, header?: object): FlattenedJWS
      export function general(payload: string | Buffer | object, key: JWK.Key, protected?: object, header?: object): GeneralJWS
    }

    interface VerifyOptions<komplet> {
        complete: komplet,
        crit?: string[],
        algorithms?: string[]
    }

    interface completeVerification {
        payload: string | object,
        key: JWK.Key,
        protected?: object,
        header?: object,
    }

    export function verify(jws: string | FlattenedJWS | GeneralJWS, key: JWK.Key | JWKS.KeyStore, options?: VerifyOptions<false>): string | object
    export function verify(jws: string | FlattenedJWS | GeneralJWS, key: JWK.Key | JWKS.KeyStore, options?: VerifyOptions<true>): completeVerification
}

export namespace JWE {
    interface JWEJSON {
        protected?: string,
        unprotected?: object,
        ciphertext: string,
        tag: string,
        iv: string,
        aad?: string,
    }

    interface JWERecipient {
        header?: object,
        encrypted_key: string
    }

    interface FlattenedJWE extends JWERecipient, JWEJSON {}


    interface GeneralJWE extends JWEJSON {
        recipients: JWERecipient[]
    }

    class Encrypt {
        constructor(cleartext: string | Buffer, protected?: object, unprotected?: object, aad?: string)

        recipient(key: JWK.Key, header?: object): void

        encrypt(serialization: 'compact'): string
        encrypt(serialization: 'flattened'): FlattenedJWE
        encrypt(serialization: 'general'): GeneralJWE
    }

    export function encrypt(payload: string | Buffer, key: JWK.Key, protected?: object): string
    namespace encrypt {
      export function flattened(payload: string | Buffer, key: JWK.Key, protected?: object, header?: object, aad?: string): FlattenedJWE
      export function general(payload: string | Buffer, key: JWK.Key, protected?: object, header?: object, aad?: string): GeneralJWE
    }

    interface DecryptOptions<komplet> {
        complete: komplet,
        crit?: string[],
        algorithms?: string[]
    }

    interface completeDecrypt {
        cleartext: Buffer,
        key: JWK.Key,
        aad?: string,
        header?: object,
        unprotected?: object,
        protected?: object,
    }

    export function decrypt(jwe: string | FlattenedJWE | GeneralJWE, key: JWK.Key | JWKS.KeyStore, options?: DecryptOptions<false>): Buffer
    export function decrypt(jwe: string | FlattenedJWE | GeneralJWE, key: JWK.Key | JWKS.KeyStore, options?: DecryptOptions<true>): completeDecrypt
}

export namespace errors {
    export class JOSEError extends Error {}
    export class JOSEMultiError extends Error {}

    export class JOSEAlgNotWhitelisted extends Error {}
    export class JOSECritNotUnderstood extends Error {}
    export class JOSENotSupported extends Error {}

    export class JWEDecryptionFailed extends Error {}
    export class JWEInvalid extends Error {}

    export class JWKImportFailed extends Error {}
    export class JWKKeySupport extends Error {}

    export class JWKSNoMatchingKey extends Error {}

    export class JWSInvalid extends Error {}
    export class JWSVerificationFailed extends Error {}
}
