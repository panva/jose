import type * as types from '../types.d.ts'

/** Algorithm capability families accepted by composable JOSE APIs. */
export type AlgorithmCategory =
  'jws' | 'jwe-key-management' | 'jwe-content-encryption' | 'jwe-compression' | 'key'

/** Shared metadata carried by every composable algorithm capability. */
export interface AlgorithmCapability<
  Category extends AlgorithmCategory = AlgorithmCategory,
  Algorithm extends string = string,
> {
  /** The JOSE operation family this capability belongs to. */
  readonly category: Category
  /** The exact JWA identifier this capability implements. */
  readonly algorithm: Algorithm
}

/**
 * A zero-argument factory for one composable algorithm capability.
 *
 * Built-in capability records carry a versioned global marker so factories remain composable across
 * copies of this package. Capability handler contracts and the marker are not currently a
 * third-party algorithm API. Factories are executable configuration and must be trusted; validation
 * catches accidental misuse, it does not sandbox hostile implementations. Built-in capability
 * records and their recognized data are immutable.
 */
export interface AlgorithmFactory<Capability extends AlgorithmCapability = AlgorithmCapability> {
  (): Readonly<Capability>
}

/** Extracts the exact JWA identifier from a factory, capability, or factory tuple. */
export type AlgorithmOf<FactoryOrTuple> = FactoryOrTuple extends readonly AlgorithmFactory[]
  ? ReturnType<FactoryOrTuple[number]>['algorithm']
  : FactoryOrTuple extends AlgorithmFactory
    ? ReturnType<FactoryOrTuple>['algorithm']
    : FactoryOrTuple extends AlgorithmCapability<AlgorithmCategory, infer Algorithm>
      ? Algorithm
      : never

type D<F extends readonly AlgorithmFactory[], S extends string = never> = F extends readonly [
  infer H extends AlgorithmFactory,
  ...infer T extends readonly AlgorithmFactory[],
]
  ? Extract<AlgorithmOf<H>, S> extends never
    ? D<T, S | AlgorithmOf<H>>
    : true
  : false

/** Resolves to `never` when a factory tuple repeats an algorithm identifier. */
export type UniqueAlgorithmFactories<Factories extends readonly AlgorithmFactory[]> =
  D<Factories> extends true ? never : unknown

/** Built-in JWS `alg` identifiers available as composable factories. */
export type JWSAlgorithmName =
  | 'HS256'
  | 'HS384'
  | 'HS512'
  | 'RS256'
  | 'RS384'
  | 'RS512'
  | 'PS256'
  | 'PS384'
  | 'PS512'
  | 'ES256'
  | 'ES384'
  | 'ES512'
  | 'EdDSA'
  | 'Ed25519'
  | 'ML-DSA-44'
  | 'ML-DSA-65'
  | 'ML-DSA-87'

/** Built-in asymmetric JWS `alg` identifiers available as composable factories. */
export type AsymmetricJWSAlgorithmName = Exclude<JWSAlgorithmName, `HS${string}`>

/** An opaque capability selecting one built-in JWS `alg` implementation. */
export interface JWSAlgorithmCapability<
  Algorithm extends JWSAlgorithmName = JWSAlgorithmName,
> extends AlgorithmCapability<'jws', Algorithm> {}

export type JWSAlgorithmFactory<Algorithm extends JWSAlgorithmName = JWSAlgorithmName> =
  AlgorithmFactory<JWSAlgorithmCapability<Algorithm>>

export type JWSAlgorithmSelection = readonly [JWSAlgorithmFactory, ...JWSAlgorithmFactory[]]

/** A factory for one built-in asymmetric JWS algorithm capability. */
export type AsymmetricJWSAlgorithmFactory = JWSAlgorithmFactory<AsymmetricJWSAlgorithmName>

/** A non-empty tuple of built-in asymmetric JWS algorithm factories. */
export type AsymmetricJWSAlgorithmSelection = readonly [
  AsymmetricJWSAlgorithmFactory,
  ...AsymmetricJWSAlgorithmFactory[],
]

/** Extracts selected JWS `alg` identifiers from a factory tuple. */
export type JWSAlgorithmOf<Factories extends readonly JWSAlgorithmFactory[]> =
  AlgorithmOf<Factories>

/** Resolves to `never` when a JWS factory tuple repeats an identifier. */
export type ValidJWSAlgorithmSelection<Factories extends JWSAlgorithmSelection> =
  UniqueAlgorithmFactories<Factories>

type S<A extends string> = A | (string & {})

type K<A extends string> = string extends A
  ? Uint8Array
  : Extract<A, `HS${number}`> extends never
    ? never
    : Uint8Array

/** Direct key inputs accepted by a selected set of JWS algorithms. */
export type JWSKeyInput<Algorithm extends string> =
  types.KeyObject | types.JWK | JWSResolvedKey<Algorithm>

/** Normalized keys returned after preparing a selected JWS algorithm's key input. */
export type JWSResolvedKey<Algorithm extends string> = types.CryptoKey | K<Algorithm>

/** JWS Header Parameters with selected `alg` identifiers suggested by editors. */
export interface SelectedJWSHeaderParameters<Algorithm extends string>
  extends types.JWSHeaderParameters {
  alg?: S<Algorithm>
}

/** Compact JWS Header Parameters with selected `alg` identifiers suggested by editors. */
export interface SelectedCompactJWSHeaderParameters<Algorithm extends string>
  extends types.CompactJWSHeaderParameters {
  alg: S<Algorithm>
}

/** JWT Header Parameters with selected `alg` identifiers suggested by editors. */
export interface SelectedJWTHeaderParameters<Algorithm extends string>
  extends types.JWTHeaderParameters {
  alg: S<Algorithm>
}

/** JWS verification options with selected algorithms suggested by editors. */
export type SelectedJWSVerifyOptions<Algorithm extends string> = Omit<
  types.VerifyOptions,
  'algorithms'
> & {
  algorithms?: readonly S<Algorithm>[]
}

/** Built-in JWE `alg` identifiers available as composable factories. */
export type JWEKeyManagementAlgorithmName =
  | 'dir'
  | 'RSA-OAEP'
  | 'RSA-OAEP-256'
  | 'RSA-OAEP-384'
  | 'RSA-OAEP-512'
  | 'ECDH-ES'
  | 'ECDH-ES+A128KW'
  | 'ECDH-ES+A192KW'
  | 'ECDH-ES+A256KW'
  | 'A128KW'
  | 'A192KW'
  | 'A256KW'
  | 'A128GCMKW'
  | 'A192GCMKW'
  | 'A256GCMKW'
  | 'PBES2-HS256+A128KW'
  | 'PBES2-HS384+A192KW'
  | 'PBES2-HS512+A256KW'

/** Built-in asymmetric JWE `alg` identifiers available as composable factories. */
export type AsymmetricJWEKeyManagementAlgorithmName = Exclude<
  JWEKeyManagementAlgorithmName,
  'dir' | `A${number}KW` | `A${number}GCMKW` | `PBES2-${string}`
>

/** Built-in JWE `enc` identifiers available as composable factories. */
export type JWEContentEncryptionAlgorithmName =
  'A128GCM' | 'A192GCM' | 'A256GCM' | 'A128CBC-HS256' | 'A192CBC-HS384' | 'A256CBC-HS512'

/** Built-in JWE `zip` identifiers available as composable factories. */
export type JWECompressionAlgorithmName = 'DEF'

/** Built-in symmetric identifiers available to composable secret generation. */
export type SecretAlgorithmName =
  | Extract<JWSAlgorithmName, `HS${string}`>
  | Extract<JWEKeyManagementAlgorithmName, `A${number}KW` | `A${number}GCMKW`>
  | JWEContentEncryptionAlgorithmName

/** Built-in JWA identifiers available from the key utility algorithm catalog. */
export type KeyAlgorithmName =
  JWSAlgorithmName | JWEKeyManagementAlgorithmName | JWEContentEncryptionAlgorithmName

/** Built-in asymmetric identifiers available to composable key-pair generation. */
export type KeyPairAlgorithmName =
  AsymmetricJWSAlgorithmName | AsymmetricJWEKeyManagementAlgorithmName

/** An opaque capability selecting one built-in key handling recipe. */
export interface KeyAlgorithmCapability<
  Algorithm extends KeyAlgorithmName = KeyAlgorithmName,
> extends AlgorithmCapability<'key', Algorithm> {}

/** A factory for one built-in key handling recipe. */
export type KeyAlgorithmFactory<Algorithm extends KeyAlgorithmName = KeyAlgorithmName> =
  AlgorithmFactory<KeyAlgorithmCapability<Algorithm>>

/** An opaque capability selecting one built-in JWE `alg` key-management implementation. */
export interface JWEKeyManagementCapability<
  Algorithm extends JWEKeyManagementAlgorithmName = JWEKeyManagementAlgorithmName,
> extends AlgorithmCapability<'jwe-key-management', Algorithm> {}

/** An opaque capability selecting one built-in JWE `enc` content-encryption implementation. */
export interface JWEContentEncryptionCapability<
  Algorithm extends JWEContentEncryptionAlgorithmName = JWEContentEncryptionAlgorithmName,
> extends AlgorithmCapability<'jwe-content-encryption', Algorithm> {}

/** An opaque capability selecting one built-in JWE `zip` compression implementation. */
export interface JWECompressionCapability<
  Algorithm extends JWECompressionAlgorithmName = JWECompressionAlgorithmName,
> extends AlgorithmCapability<'jwe-compression', Algorithm> {}

/** Any capability accepted by a composable JWE operation. */
export type JWEAlgorithmCapability =
  JWEKeyManagementCapability | JWEContentEncryptionCapability | JWECompressionCapability

export type JWEKeyManagementFactory<
  Algorithm extends JWEKeyManagementAlgorithmName = JWEKeyManagementAlgorithmName,
> = AlgorithmFactory<JWEKeyManagementCapability<Algorithm>>

export type JWEContentEncryptionFactory<
  Algorithm extends JWEContentEncryptionAlgorithmName = JWEContentEncryptionAlgorithmName,
> = AlgorithmFactory<JWEContentEncryptionCapability<Algorithm>>

export type JWECompressionFactory<
  Algorithm extends JWECompressionAlgorithmName = JWECompressionAlgorithmName,
> = AlgorithmFactory<JWECompressionCapability<Algorithm>>

export type JWEAlgorithmFactory = AlgorithmFactory<JWEAlgorithmCapability>

/** A non-empty mixed tuple of JWE algorithm factories. */
export type JWEAlgorithmSelection = readonly [JWEAlgorithmFactory, ...JWEAlgorithmFactory[]]

type C<F extends readonly AlgorithmFactory[], T extends AlgorithmCategory> = F extends readonly [
  infer H extends AlgorithmFactory,
  ...infer R extends readonly AlgorithmFactory[],
]
  ? [ReturnType<H>] extends [AlgorithmCapability<T>]
    ? true
    : C<R, T>
  : false

/** Extracts selected JWE `alg` identifiers from a factory tuple. */
export type JWEKeyManagementAlgorithmOf<Factories extends readonly JWEAlgorithmFactory[]> = Extract<
  ReturnType<Factories[number]>,
  JWEKeyManagementCapability
>['algorithm']

/** Extracts selected JWE `enc` identifiers from a factory tuple. */
export type JWEContentEncryptionAlgorithmOf<Factories extends readonly JWEAlgorithmFactory[]> =
  Extract<ReturnType<Factories[number]>, JWEContentEncryptionCapability>['algorithm']

/** Extracts selected JWE `zip` identifiers from a factory tuple. */
export type JWECompressionAlgorithmOf<Factories extends readonly JWEAlgorithmFactory[]> = Extract<
  ReturnType<Factories[number]>,
  JWECompressionCapability
>['algorithm']

/**
 * Resolves to `never` unless a JWE factory tuple has unique identifiers and includes both an `alg`
 * and an `enc` implementation. Compression remains optional.
 */
export type ValidJWEAlgorithmSelection<Factories extends JWEAlgorithmSelection> =
  UniqueAlgorithmFactories<Factories> &
    (C<Factories, 'jwe-key-management'> extends true
      ? C<Factories, 'jwe-content-encryption'> extends true
        ? unknown
        : never
      : never)

/** An algorithm factory accepted by composable key import utilities. */
export type KeyImportAlgorithmFactory = KeyAlgorithmFactory

/** A non-empty tuple of algorithm factories accepted by composable key import utilities. */
export type KeyImportAlgorithmSelection = readonly [
  KeyImportAlgorithmFactory,
  ...KeyImportAlgorithmFactory[],
]

/** An algorithm factory accepted by composable asymmetric key generation. */
export type KeyPairAlgorithmFactory = KeyAlgorithmFactory<KeyPairAlgorithmName>

/** A non-empty tuple of algorithm factories accepted by composable asymmetric key generation. */
export type KeyPairAlgorithmSelection = readonly [
  KeyPairAlgorithmFactory,
  ...KeyPairAlgorithmFactory[],
]

/** An algorithm factory accepted by composable symmetric secret generation. */
export type SecretAlgorithmFactory = KeyAlgorithmFactory<SecretAlgorithmName>

/** A non-empty tuple of algorithm factories accepted by composable symmetric secret generation. */
export type SecretAlgorithmSelection = readonly [
  SecretAlgorithmFactory,
  ...SecretAlgorithmFactory[],
]
