# Interface: GenerateKeyPairOptions

## Index

### Properties

* [crv](_util_generate_key_pair_.generatekeypairoptions.md#crv)
* [modulusLength](_util_generate_key_pair_.generatekeypairoptions.md#moduluslength)

## Properties

### crv

• `Optional` **crv**: string

*Defined in [src/util/generate_key_pair.ts:10](https://github.com/panva/jose/blob/v3.5.0/src/util/generate_key_pair.ts#L10)*

The EC "crv" (Curve) or OKP "crv" (Subtype of Key Pair) value to generate.
The curve must be both supported on the runtime as well as applicable for
the given JWA algorithm identifier.

___

### modulusLength

• `Optional` **modulusLength**: number

*Defined in [src/util/generate_key_pair.ts:16](https://github.com/panva/jose/blob/v3.5.0/src/util/generate_key_pair.ts#L16)*

A hint for RSA algorithms to generate an RSA key of a given `modulusLength`
(Key size in bits). JOSE requires 2048 bits or larger. Default is 2048.
