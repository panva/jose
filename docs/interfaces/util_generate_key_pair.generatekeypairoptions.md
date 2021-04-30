# Interface: GenerateKeyPairOptions

[util/generate_key_pair](../modules/util_generate_key_pair.md).GenerateKeyPairOptions

## Table of contents

### Properties

- [crv](util_generate_key_pair.generatekeypairoptions.md#crv)
- [modulusLength](util_generate_key_pair.generatekeypairoptions.md#moduluslength)

## Properties

### crv

• `Optional` **crv**: *string*

The EC "crv" (Curve) or OKP "crv" (Subtype of Key Pair) value to generate.
The curve must be both supported on the runtime as well as applicable for
the given JWA algorithm identifier.

Defined in: [util/generate_key_pair.ts:10](https://github.com/panva/jose/blob/v3.11.6/src/util/generate_key_pair.ts#L10)

___

### modulusLength

• `Optional` **modulusLength**: *number*

A hint for RSA algorithms to generate an RSA key of a given `modulusLength`
(Key size in bits). JOSE requires 2048 bits or larger. Default is 2048.

Defined in: [util/generate_key_pair.ts:16](https://github.com/panva/jose/blob/v3.11.6/src/util/generate_key_pair.ts#L16)
