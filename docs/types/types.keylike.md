# Type alias: KeyLike

[types](../modules/types.md).KeyLike

Ƭ **KeyLike**: KeyObject \| CryptoKey \| Uint8Array

KeyLike are platform-specific references to keying material.

[KeyObject](https://nodejs.org/api/crypto.html#crypto_class_keyobject) is a representation of a
key/secret available in the Node.js runtime. You can obtain a KeyObject instance e.g. from:

- [crypto.generateKeyPair](https://nodejs.org/api/crypto.html#crypto_crypto_generatekeypair_type_options_callback)
- [crypto.createPublicKey](https://nodejs.org/api/crypto.html#crypto_crypto_createpublickey_key)
- [crypto.createPrivateKey](https://nodejs.org/api/crypto.html#crypto_crypto_createprivatekey_key)
- [crypto.createSecretKey](https://nodejs.org/api/crypto.html#crypto_crypto_createsecretkey_key_encoding)
- [jose/jwk/parse](../functions/jwk_parse.parsejwk.md#readme)

[CryptoKey](https://developer.mozilla.org/en-US/docs/Web/API/CryptoKey) is a representation of a
key/secret available in the Browser runtime. You can obtain a CryptoKey instance e.g. from:

- [SubtleCrypto.importKey](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey)
- [SubtleCrypto.generateKey](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey)
- [jose/jwk/parse](../functions/jwk_parse.parsejwk.md#readme)

[Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
is used exclusively for symmetric secret representations, a CryptoKey or KeyObject is
preferred, but in Web Crypto API this isn't an option for some algorithms.
In Node.js the [Buffer](https://nodejs.org/api/buffer.html#buffer_buffer) class is a subclass of Uint8Array
class. `jose` APIs accept plain Buffers wherever Uint8Array are supported as well.

**`example`** (node) Public KeyObject from a PEM public key
```js
import { createPublicKey } from 'crypto'

const publicKey = createPublicKey(pem)
```

**`example`** (node) Private KeyObject from a PEM private key
```js
import { createPrivateKey } from 'crypto'

const privateKey = createPrivateKey(pem)
```

**`example`** (node) Secret KeyObject from hex encoded random bytes
```js
import { createSecretKey } from 'crypto'

const secretKey = createSecretKey(Buffer.from('7f908df6c8bd634f769c073a48986d77677b79bc6aa19b106f976f2db18d38c2', 'hex'))
```

**`example`** (all runtimes) KeyLike from a JSON Web Key (JWK)
```js
import { parseJwk } from 'jose/jwk/parse'

const ecPublicKey = await parseJwk({
  crv: 'P-256',
  kty: 'EC',
  x: 'ySK38C1jBdLwDsNWKzzBHqKYEE5Cgv-qjWvorUXk9fw',
  y: '_LeQBw07cf5t57Iavn4j-BqJsAD1dpoz8gokd3sBsOo'
}, 'ES256')

const rsaPublicKey = await parseJwk({
  kty: 'RSA',
  e: 'AQAB',
  n: '12oBZRhCiZFJLcPg59LkZZ9mdhSMTKAQZYq32k_ti5SBB6jerkh-WzOMAO664r_qyLkqHUSp3u5SbXtseZEpN3XPWGKSxjsy-1JyEFTdLSYe6f9gfrmxkUF_7DTpq0gn6rntP05g2-wFW50YO7mosfdslfrTJYWHFhJALabAeYirYD7-9kqq9ebfFMF4sRRELbv9oi36As6Q9B3Qb5_C1rAzqfao_PCsf9EPsTZsVVVkA5qoIAr47lo1ipfiBPxUCCNSdvkmDTYgvvRm6ZoMjFbvOtgyts55fXKdMWv7I9HMD5HwE9uW839PWA514qhbcIsXEYSFMPMV6fnlsiZvQQ'
}, 'PS256')
```

Defined in: [types.d.ts:148](https://github.com/panva/jose/blob/v3.11.5/src/types.d.ts#L148)
