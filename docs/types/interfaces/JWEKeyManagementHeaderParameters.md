# Interface: JWEKeyManagementHeaderParameters

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Recognized JWE Key Management-related Header Parameters.

## Properties

### apu?

• `optional` **apu?**: [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

ECDH-ES Agreement PartyUInfo bytes, used in ConcatKDF and added to the JOSE header.

***

### apv?

• `optional` **apv?**: [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

ECDH-ES Agreement PartyVInfo bytes, used in ConcatKDF and added to the JOSE header.

***

### ~~epk?~~

• `optional` **epk?**: [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey) \| [`KeyObject`](KeyObject.md)

#### Deprecated

For testing and vector validation only.

***

### ~~iv?~~

• `optional` **iv?**: [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

#### Deprecated

For testing and vector validation only.

***

### p2c?

• `optional` **p2c?**: `number`

PBES2 PBKDF2 iteration count, added to the JOSE header.

***

### ~~p2s?~~

• `optional` **p2s?**: [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

#### Deprecated

For testing and vector validation only.
