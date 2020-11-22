# Interface: EncryptOptions

JWE Encryption options.

## Index

### Properties

* [deflateRaw](_types_d_.encryptoptions.md#deflateraw)

## Properties

### deflateRaw

• `Optional` **deflateRaw**: [DeflateFunction](_types_d_.deflatefunction.md)

*Defined in [src/types.d.ts:345](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L345)*

In a browser runtime you have to provide an implementation for Deflate Raw
when you will be producing JWEs with compressed plaintext.
