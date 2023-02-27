# Interface: GenerateKeyPairOptions

[💗 Help the project](https://github.com/sponsors/panva)

## Table of contents

### Properties

- [crv](key_generate_key_pair.GenerateKeyPairOptions.md#crv)
- [extractable](key_generate_key_pair.GenerateKeyPairOptions.md#extractable)
- [modulusLength](key_generate_key_pair.GenerateKeyPairOptions.md#moduluslength)

## Properties

### crv

• `Optional` **crv**: `string`

The EC "crv" (Curve) or OKP "crv" (Subtype of Key Pair) value to generate. The curve must be
both supported on the runtime as well as applicable for the given JWA algorithm identifier.

___

### extractable

• `Optional` **extractable**: `boolean`

(Only effective in Web Crypto API runtimes) The value to use as
[SubtleCrypto.generateKey()](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey)
`extractable` argument. Default is false.

___

### modulusLength

• `Optional` **modulusLength**: `number`

A hint for RSA algorithms to generate an RSA key of a given `modulusLength` (Key size in bits).
JOSE requires 2048 bits or larger. Default is 2048.
