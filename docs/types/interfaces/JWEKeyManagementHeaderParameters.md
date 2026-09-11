# Interface: JWEKeyManagementHeaderParameters

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Recognized JWE Key Management-related Header Parameters.

## Properties

### apu?

• `optional` **apu?**: [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

Raw Agreement PartyUInfo bytes; base64url-encoded as the "apu" Header Parameter (RFC 7518,
Section 4.6.1.2).

***

### apv?

• `optional` **apv?**: [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

Raw Agreement PartyVInfo bytes; base64url-encoded as the "apv" Header Parameter (RFC 7518,
Section 4.6.1.3).

***

### ~~epk?~~

• `optional` **epk?**: [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey) \| [`KeyObject`](KeyObject.md)

Ephemeral private key input. The resulting "epk" (Ephemeral Public Key) Header Parameter
contains only the public key (RFC 7518, Section 4.6.1.1).

#### Deprecated

For testing and vector validation only.

***

### ~~iv?~~

• `optional` **iv?**: [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

Raw Initialization Vector bytes for AES GCM Key Encryption (RFC 7518, Section 4.7.1.1).

#### Deprecated

For testing and vector validation only.

***

### p2c?

• `optional` **p2c?**: `number`

"p2c" (PBES2 Count) Header Parameter: positive PBKDF2 iteration count (RFC 7518, Section
4.8.1.2).

***

### ~~p2s?~~

• `optional` **p2s?**: [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

Raw PBES2 Salt Input bytes (RFC 7518, Section 4.8.1.1).

#### Deprecated

For testing and vector validation only.
