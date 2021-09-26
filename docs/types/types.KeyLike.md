# Type alias: KeyLike

[types](../modules/types.md).KeyLike

Ƭ **KeyLike**: `KeyObject` \| `CryptoKey` \| `Uint8Array`

KeyLike are platform-specific references to keying material.

[KeyObject](https://nodejs.org/api/crypto.html#crypto_class_keyobject) is a representation of a
key/secret available in the Node.js runtime. You can obtain a KeyObject instance e.g. from:

- [jose/key/import](../modules/key_import.md#readme)
- [jose/util/generate_key_pair](../functions/util_generate_key_pair.generateKeyPair.md#readme)
- [jose/util/generate_secret](../functions/util_generate_secret.generateSecret.md#readme)
- [crypto.createPublicKey](https://nodejs.org/api/crypto.html#crypto_crypto_createpublickey_key)
- [crypto.createPrivateKey](https://nodejs.org/api/crypto.html#crypto_crypto_createprivatekey_key)
- [crypto.createSecretKey](https://nodejs.org/api/crypto.html#crypto_crypto_createsecretkey_key_encoding)
- [crypto.generateKeyPair](https://nodejs.org/api/crypto.html#crypto_crypto_generatekeypair_type_options_callback)

[CryptoKey](https://developer.mozilla.org/en-US/docs/Web/API/CryptoKey) is a representation of a
key/secret available in the Browser and Deno runtimes. You can obtain a CryptoKey instance e.g. from:

- [jose/key/import](../modules/key_import.md#readme)
- [jose/util/generate_key_pair](../functions/util_generate_key_pair.generateKeyPair.md#readme)
- [jose/util/generate_secret](../functions/util_generate_secret.generateSecret.md#readme)
- [SubtleCrypto.importKey](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey)
- [SubtleCrypto.generateKey](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey)

[Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
is used exclusively for symmetric secret representations, a CryptoKey or KeyObject is
preferred, but in Web Crypto API this isn't an option for some algorithms.
In Node.js the [Buffer](https://nodejs.org/api/buffer.html#buffer_buffer) class is a subclass of Uint8Array
class. `jose` APIs accept a Buffer wherever Uint8Array are accepted as well.

**`example`** Import a PEM-encoded SPKI Public Key
```js
import { importSPKI } from 'jose/key/import'

const algorithm = 'ES256'
const spki = `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEFlHHWfLk0gLBbsLTcuCrbCqoHqmM
YJepMC+Q+Dd6RBmBiA41evUsNMwLeN+PNFqib+xwi9JkJ8qhZkq8Y/IzGg==
-----END PUBLIC KEY-----`
const ecPublicKey = await importSPKI(spki, algorithm)
```

**`example`** Import a X.509 Certificate
```js
import { importX509 } from 'jose/key/import'

const algorithm = 'ES256'
const x509 = `-----BEGIN CERTIFICATE-----
MIIBXjCCAQSgAwIBAgIGAXvykuMKMAoGCCqGSM49BAMCMDYxNDAyBgNVBAMMK3Np
QXBNOXpBdk1VaXhXVWVGaGtjZXg1NjJRRzFyQUhXaV96UlFQTVpQaG8wHhcNMjEw
OTE3MDcwNTE3WhcNMjIwNzE0MDcwNTE3WjA2MTQwMgYDVQQDDCtzaUFwTTl6QXZN
VWl4V1VlRmhrY2V4NTYyUUcxckFIV2lfelJRUE1aUGhvMFkwEwYHKoZIzj0CAQYI
KoZIzj0DAQcDQgAE8PbPvCv5D5xBFHEZlBp/q5OEUymq7RIgWIi7tkl9aGSpYE35
UH+kBKDnphJO3odpPZ5gvgKs2nwRWcrDnUjYLDAKBggqhkjOPQQDAgNIADBFAiEA
1yyMTRe66MhEXID9+uVub7woMkNYd0LhSHwKSPMUUTkCIFQGsfm1ecXOpeGOufAh
v+A1QWZMuTWqYt+uh/YSRNDn
-----END CERTIFICATE-----`
const ecPublicKey = await importX509(x509, algorithm)
```

**`example`** Import a PEM-encoded PKCS8 Private Key
```js
import { importPKCS8 } from 'jose/key/import'

const algorithm = 'ES256'
const pkcs8 = `-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgiyvo0X+VQ0yIrOaN
nlrnUclopnvuuMfoc8HHly3505OhRANCAAQWUcdZ8uTSAsFuwtNy4KtsKqgeqYxg
l6kwL5D4N3pEGYGIDjV69Sw0zAt43480WqJv7HCL0mQnyqFmSrxj8jMa
-----END PRIVATE KEY-----`
const ecPrivateKey = await importPKCS8(pkcs8, algorithm)
```

**`example`** Import a JSON Web Key (JWK)
```js
import { importJWK } from 'jose/key/import'

const ecPublicKey = await importJWK({
  crv: 'P-256',
  kty: 'EC',
  x: 'ySK38C1jBdLwDsNWKzzBHqKYEE5Cgv-qjWvorUXk9fw',
  y: '_LeQBw07cf5t57Iavn4j-BqJsAD1dpoz8gokd3sBsOo'
}, 'ES256')

const rsaPublicKey = await importJWK({
  kty: 'RSA',
  e: 'AQAB',
  n: '12oBZRhCiZFJLcPg59LkZZ9mdhSMTKAQZYq32k_ti5SBB6jerkh-WzOMAO664r_qyLkqHUSp3u5SbXtseZEpN3XPWGKSxjsy-1JyEFTdLSYe6f9gfrmxkUF_7DTpq0gn6rntP05g2-wFW50YO7mosfdslfrTJYWHFhJALabAeYirYD7-9kqq9ebfFMF4sRRELbv9oi36As6Q9B3Qb5_C1rAzqfao_PCsf9EPsTZsVVVkA5qoIAr47lo1ipfiBPxUCCNSdvkmDTYgvvRm6ZoMjFbvOtgyts55fXKdMWv7I9HMD5HwE9uW839PWA514qhbcIsXEYSFMPMV6fnlsiZvQQ'
}, 'PS256')
```

**`example`** (node) Secret KeyObject from hex encoded random bytes
```js
import { createSecretKey } from 'crypto'

const secretKey = createSecretKey(Buffer.from('7f908df6c8bd634f769c073a48986d77677b79bc6aa19b106f976f2db18d38c2', 'hex'))
```

#### Defined in

[types.d.ts:103](https://github.com/panva/jose/blob/v3.19.0/src/types.d.ts#L103)
