# Interface: DecryptOptions

JWE Decryption options.

## Index

### Properties

* [contentEncryptionAlgorithms](_types_d_.decryptoptions.md#contentencryptionalgorithms)
* [inflateRaw](_types_d_.decryptoptions.md#inflateraw)
* [keyManagementAlgorithms](_types_d_.decryptoptions.md#keymanagementalgorithms)

## Properties

### contentEncryptionAlgorithms

• `Optional` **contentEncryptionAlgorithms**: string[]

*Defined in [src/types.d.ts:328](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L328)*

A list of accepted JWE "enc" (Encryption Algorithm) Header Parameter values.

___

### inflateRaw

• `Optional` **inflateRaw**: [InflateFunction](_types_d_.inflatefunction.md)

*Defined in [src/types.d.ts:334](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L334)*

In a browser runtime you have to provide an implementation for Inflate Raw
when you expect JWEs with compressed plaintext.

___

### keyManagementAlgorithms

• `Optional` **keyManagementAlgorithms**: string[]

*Defined in [src/types.d.ts:323](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L323)*

A list of accepted JWE "alg" (Algorithm) Header Parameter values.
