# Interface: JWEKeyManagementHeaderParameters

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Recognized JWE Key Management-related Header Parameters.

## Properties

### apu?

• `optional` **apu**: [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

ECDH-ES "apu" (Agreement PartyUInfo). This will be used as a JOSE Header Parameter and will be
used in ECDH's ConcatKDF.

***

### apv?

• `optional` **apv**: [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

ECDH-ES "apv" (Agreement PartyVInfo). This will be used as a JOSE Header Parameter and will be
used in ECDH's ConcatKDF.

***

### ~~epk?~~

• `optional` **epk**: [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey) \| [`KeyObject`](KeyObject.md)

#### Deprecated

You should not use this parameter. It is only intended for testing and vector
  validation purposes.

***

### ~~iv?~~

• `optional` **iv**: [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

#### Deprecated

You should not use this parameter. It is only intended for testing and vector
  validation purposes.

***

### ~~p2c?~~

• `optional` **p2c**: `number`

#### Deprecated

You should not use this parameter. It is only intended for testing and vector
  validation purposes.

***

### ~~p2s?~~

• `optional` **p2s**: [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

#### Deprecated

You should not use this parameter. It is only intended for testing and vector
  validation purposes.

***

### psk?

• `optional` **psk**: [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

HPKE Pre-Shared Key (PSK) for use in PSK mode.

***

### psk\_id?

• `optional` **psk\_id**: [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

HPKE Pre-Shared Key Identifier (PSK ID) for use in PSK mode.
