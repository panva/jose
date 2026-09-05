# Interface: GeneralDecryptResult

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

General JWE JSON Serialization decryption result.

## Properties

### plaintext

• **plaintext**: [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

Plaintext.

***

### additionalAuthenticatedData?

• `optional` **additionalAuthenticatedData?**: [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

JWE Additional Authenticated Data, integrity protected but not encrypted.

***

### protectedHeader?

• `optional` **protectedHeader?**: [`JWEHeaderParameters`](JWEHeaderParameters.md)

JWE Protected Header.

***

### sharedUnprotectedHeader?

• `optional` **sharedUnprotectedHeader?**: [`JWEHeaderParameters`](JWEHeaderParameters.md)

JWE Shared Unprotected Header. Not integrity protected.

***

### unprotectedHeader?

• `optional` **unprotectedHeader?**: [`JWEHeaderParameters`](JWEHeaderParameters.md)

JWE Per-Recipient Unprotected Header. Not integrity protected.
