# Interface: GenerateKeyPairOptions

[util/generate_key_pair](../modules/util_generate_key_pair.md).GenerateKeyPairOptions

## Table of contents

### Properties

- [crv](util_generate_key_pair.GenerateKeyPairOptions.md#crv)
- [extractable](util_generate_key_pair.GenerateKeyPairOptions.md#extractable)
- [modulusLength](util_generate_key_pair.GenerateKeyPairOptions.md#moduluslength)

## Properties

### crv

• `Optional` **crv**: `string`

The EC "crv" (Curve) or OKP "crv" (Subtype of Key Pair) value to generate.
The curve must be both supported on the runtime as well as applicable for
the given JWA algorithm identifier.

#### Defined in

[util/generate_key_pair.ts:22](https://github.com/panva/jose/blob/v3.15.0/src/util/generate_key_pair.ts#L22)

___

### extractable

• `Optional` **extractable**: `boolean`

(Web Cryptography API specific) The value to use as
[SubtleCrypto.generateKey()](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey)
`extractable` argument. Default is false.

#### Defined in

[util/generate_key_pair.ts:35](https://github.com/panva/jose/blob/v3.15.0/src/util/generate_key_pair.ts#L35)

___

### modulusLength

• `Optional` **modulusLength**: `number`

A hint for RSA algorithms to generate an RSA key of a given `modulusLength`
(Key size in bits). JOSE requires 2048 bits or larger. Default is 2048.

#### Defined in

[util/generate_key_pair.ts:28](https://github.com/panva/jose/blob/v3.15.0/src/util/generate_key_pair.ts#L28)
