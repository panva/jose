# Type alias: KeyLike

[types](../modules/types.md).KeyLike

Ƭ **KeyLike**: KeyObject \| CryptoKey \| Uint8Array

KeyLike are platform-specific references to keying material.

- [KeyObject](https://nodejs.org/api/crypto.html#crypto_class_keyobject) instances come from
node's [crypto module](https://nodejs.org/api/crypto.html), e.g.:
  - [crypto.generateKeyPair](https://nodejs.org/api/crypto.html#crypto_crypto_generatekeypair_type_options_callback)
  - [crypto.createPublicKey](https://nodejs.org/api/crypto.html#crypto_crypto_createpublickey_key)
  - [crypto.createPrivateKey](https://nodejs.org/api/crypto.html#crypto_crypto_createprivatekey_key)
  - [crypto.createSecretKey](https://nodejs.org/api/crypto.html#crypto_crypto_createsecretkey_key_encoding)
- [CryptoKey](https://developer.mozilla.org/en-US/docs/Web/API/CryptoKey) instances come from
[Web Cryptography API](https://www.w3.org/TR/WebCryptoAPI), e.g.:
  - [SubtleCrypto.importKey](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey)
  - [SubtleCrypto.generateKey](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey)
- [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
is used exclusively for symmetric secret representations, a CryptoKey or KeyObject is
preferred, but in Web Crypto API this isn't an option for some algorithms.

Defined in: [types.d.ts:101](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L101)
