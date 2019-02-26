# @panva/jose API Documentation

**Table of Contents**

- [JWK (JSON Web Key)](#jwk-json-web-key)
- [JWKS (JSON Web Key Set)](#jwks-json-web-key-set)
- [JWS (JSON Web Signature)](#jws-json-web-signature)
- [JWE (JSON Web Encryption)](#jwe-json-web-encryption)

## Support

[<img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160" align="right">][support-patreon]
If you or your business use @panva/jose, please consider becoming a [Patron][support-patreon] so I can continue maintaining it and adding new features carefree. You may also donate one-time via [PayPal][support-paypal].
[<img src="https://cdn.jsdelivr.net/gh/gregoiresgt/payment-icons@183140a5ff8f39b5a19d59ebeb2c77f03c3a24d3/Assets/Payment/PayPal/Paypal@2x.png" width="100" align="right">][support-paypal]

<br>

---

## JWK (JSON Web Key)

<!-- TOC JWK START -->
- [Class: &lt;JWK.Key&gt; and &lt;JWK.RSAKey&gt; | &lt;JWK.ECKey&gt; | &lt;JWK.OctKey&gt;](#class-jwkkey-and-jwkrsakey--jwkeckey--jwkoctkey)
  - [key.kty](#keykty)
  - [key.alg](#keyalg)
  - [key.use](#keyuse)
  - [key.kid](#keykid)
  - [key.public](#keypublic)
  - [key.private](#keyprivate)
  - [key.algorithms([operation])](#keyalgorithmsoperation)
  - [key.toJWK([private])](#keytojwkprivate)
- JWK.importKey
  - [JWK.importKey(key[, options]) asymmetric key import](#jwkimportkeykey-options-asymmetric-key-import)
  - [JWK.importKey(secret[, options]) secret key import](#jwkimportkeysecret-options-secret-key-import)
  - [JWK.importKey(jwk) JWK-formatted key import](#jwkimportkeyjwk-jwk-formatted-key-import)
- [JWK.generate(kty[, crvOrSize[, options[, private]]]) generating new keys](#jwkgeneratekty-crvorsize-options-private-generating-new-keys)
- [JWK.generateSync(kty[, crvOrSize[, options[, private]]])](#jwkgeneratesynckty-crvorsize-options-private)
- [JWK.isKey(object)](#jwkiskeyobject)
<!-- TOC JWK END -->

All @panva/jose operations require `<JWK.Key>` or `<JWKS.KeyStore>` as arguments. Here's
how to get a `<JWK.Key>` instances generated or instantiated from existing key material.


```js
const { JWK } = require('@panva/jose')
// { importKey: [Function: importKey],
//   generate: [AsyncFunction: generate],
//   generateSync: [Function: generateSync] }
```

---

#### Class: `<JWK.Key>` and `<JWK.RSAKey>` | `<JWK.ECKey>` | `<JWK.OctKey>`

`<JWK.RSAKey>`, `<JWK.ECKey>` and `<JWK.OctKey>` represent a key usable for JWS and JWE operations. The
`JWK.importKey()` method is used to retrieve a key representation of an existing key or secret.
`JWK.generate()` method is used to generate a new random key.

`<JWK.RSAKey>`, `<JWK.ECKey>` and `<JWK.OctKey>` inherit methods from `<JWK.Key>` and in addition
to the properties documented below have the respective key component properties exported as `<string>`
in their format defined by the specifications.

- `e, n` for Public RSA Keys
- `e, n, d, p, q, dp, dq, qi` for Private RSA Keys
- `crv, x, y` for Public EC Keys
- `crv, x, y, n` for Private EC Keys
- `k` for Symmetric keys

---

#### `key.kty`

Returns the key's JWK Key Type Parameter. 'EC', 'RSA' or 'oct' for the respective supported key types

- `<string>`

---

#### `key.alg`

Returns the key's JWK Algorithm Parameter if set, undefined otherwise. If set the key is only usable
for that one algorithm and will fail when used with others.

- `<string>`

---

#### `key.use`

Returns the key's JWK Key Use Parameter if set, undefined otherwise. Only 'sig' and 'enc' values
are supported. If set the key can only be used for either signing / verification or encryption
related operations (key management or encryption)

- `<string>`

---

#### `key.kid`

Returns the key's JWK Key ID Parameter if set, if not set it will be calculated using the method
defined in [RFC7638][spec-thumbprint]

- `<string>`

---

#### `key.public`

Returns true/false if the key is asymmetric and public. Returns false for symmetric keys.

- `<boolean>`

---

#### `key.private`

Returns true/false if the key is asymmetric and private. Returns false for symmetric keys.

- `<boolean>`

---

#### `key.algorithms([operation])`

Returns a [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
of algorithms the key may perform.

- `operation`: `<string>` Must be one of 'encrypt', 'decrypt', 'sign', 'verify', 'wrapKey', 'unwrapKey'
- Returns: `Set<string>`

<details>
  <summary><em><strong>Example</strong></em> (Click to expand)</summary>

```js
const { JWK: { generateSync } } = require('@panva/jose')

const privateKey = generateSync('RSA')
privateKey.algorithms()
// Set {
//  'PS256',
//  'RS256',
//  'PS384',
//  'RS384',
//  'PS512',
//  'RS512',
//  'RSA-OAEP',
//  'RSA1_5' }
privateKey.algorithms('wrapKey')
// Set {
//  'RSA-OAEP',
//  'RSA1_5' }

const publicKey = generateSync('RSA', 2048, { use: 'enc' }, false)
publicKey.algorithms('sign')
// Set {}
publicKey.algorithms('unwrapKey')
// Set {}
publicKey.algorithms('wrapKey')
// Set {
//  'RSA-OAEP',
//  'RSA1_5' }
```
</details>

---

#### `key.toJWK([private])`

Exports the key to a JSON Web Key formatted object.

- `private`: `<boolean>` When true exports keys with its private components. **Default:** 'false'
- Returns: `<Object>`

<details>
  <summary><em><strong>Example</strong></em> (Click to expand)</summary>

```js
const { JWK: { generateSync } } = require('@panva/jose')

const key = generateSync('RSA', 2048, { use: 'sig', alg: 'PS256' })
key.toJWK()
// { kty: 'RSA',
//   kid: 'UFldqYiAzlc1aGj5SoqxqYnWcv2Nc4us2ryQe3-FsUA',
//   e: 'AQAB',
//   n:
//    'uKEKEJUrnfBdXr6zmzq91fQHhW_8GFFUAYtvt5Uvj9wzsWDbspfL9MorhJgkPioo9T6QQvyyEJBaAQOLZxLsPORk83vmB9OACQT3PEM2LbSFK7XUoZGwqlf8Anvs7M1GwvypYbc1v1WrCqcsjrbmYF9TZkV8nNsy2cweh9gFNR-lIiZCHWDgnP6PifoeGvC9RxKdusFa66vtUJGUcoVmMoiOM7EDVdYOP91qJtbDBx7NPPywwD-8pt3UVBW0bYvOqHGF6XXky5JiB8AZQ2NdZHWxklaM2fd8Mxu9CT3xSYg51nS0KV7wO9lAh_ynBpxE2Qmr-7nvKkkDMOL1FSoEQw',
//   alg: 'PS256',
//   use: 'sig' }
key.toJWK(true)
// { kty: 'RSA',
//   kid: 'UFldqYiAzlc1aGj5SoqxqYnWcv2Nc4us2ryQe3-FsUA',
//   e: 'AQAB',
//   n:
//    'uKEKEJUrnfBdXr6zmzq91fQHhW_8GFFUAYtvt5Uvj9wzsWDbspfL9MorhJgkPioo9T6QQvyyEJBaAQOLZxLsPORk83vmB9OACQT3PEM2LbSFK7XUoZGwqlf8Anvs7M1GwvypYbc1v1WrCqcsjrbmYF9TZkV8nNsy2cweh9gFNR-lIiZCHWDgnP6PifoeGvC9RxKdusFa66vtUJGUcoVmMoiOM7EDVdYOP91qJtbDBx7NPPywwD-8pt3UVBW0bYvOqHGF6XXky5JiB8AZQ2NdZHWxklaM2fd8Mxu9CT3xSYg51nS0KV7wO9lAh_ynBpxE2Qmr-7nvKkkDMOL1FSoEQw',
//   d:
//    'F9G24bLNAMBM23dQ5prqeNrVyZJL_LspUlWx4QZfL3kiNiUf0uegiYE3ohCaxGZeCF288Nd3BYoKAo15g5--WJDCsWLvp1zS7Nb2KpElQTpD4ALCXuHT3_Yf7hYc1-QX1_oOxCuFxJyBx4sPxY21JQPHV69pRzdEVTLvUWk-Kr8k-kgu8xFOsyqLK0g0IBAtwOX2ksIPLuHT-nGh_VQwfpJowq1MoUZD-y_6Ai5HWAZy9t6gARpG3K4yBcmAQBRIQgoFiGw41BqVB5fJyjVZDsMbvT_iEFKkrHRjifUI6QTNtt1k9xOFIL_Ojzn6aLylm58AGD8oORWZvfpmJJ03yQ',
//   p:
//    '8lvcv5Ov9rJsa_kaCJBRijeOdz3La11_26o2QDpkINFKKoDNWRpIT0KZNF4P16Z5OXOK6rSezuN2vACAPg3riUHVdbRyFhMI6FvQhlx7unyv07xBBqbnp8dV2NiQv3-rFeNPV_5RqZHJyqQga-VUXvwics3eUzm_2CbrMQG3Klc',
//   q:
//    'wwVZ6d5uZm9kj3tWICF1FqCWHwSWMt1wgFZ3DOp2LPuqBHjYPas4zwXd3V4wolaCi8irbTfbL0F6c51yN72-enAjgm6r5yzxedkV9GWk5U0y8VrNwYm55qz1o88LB6PX6RG5Lp2rYZp_34dgCrllQc8T-5YY4KIHy7TaLkKkGfU',
//   dp:
//    'sPZseCIxcPOVAT3xSWF_eGnah6zCVJH_4vglBr7cD65h9ij4R-BN_jnFvhwUe0Ud7No2C-x4rN4f-2RuP2FQo3dDkt-AEigx79_iocjzuxaCGBu0a1QBgFunjl-LSZjB5oiEjd6v6B4AdwtidQYNlhGKYcN6W9CmCQFZ5_21rZ8',
//   dq:
//    'sokKmGSuUw61U_mIjh-zDoTzCfBsBKLepE8D7AoVJ_c43aE37bT7a-MmCst44JUsLAYIkhMpkKh0DrXb45XMdFCG4ZipvRhS9Ma9J6GKBPXYpkYHyZ9pVfmPY2he456mQdOc4UUsqU0EtcE8NnUlcsq9s3vkyHjthBrMBr-xdaU',
//   qi:
//    'jbZrzP8f3y0-ZAjqSQAPbKnQI0Vli952nQTUgffF2Bh2q0dB719PHjmIV7NjwCFOMcNx-2usJFwI9VikgN9GTGauakvG7SFzXD8yHiRzFwcjYvXDuJ-4Q1Yjo1m4JUIW_BLVnzauSg0P9qnxT1dxvchEQRIIfF72FW80BsJD4LQ',
//   alg: 'PS256',
//   use: 'sig' }
```
</details>

---

#### `JWK.importKey(key[, options])` asymmetric key import

Imports an asymmetric private or public key. Supports importing JWK formatted keys (private, public,
secrets), `pem` and `der` formatted private and public keys, `pem` formatted X.509 certificates.
Private keys may also be passphrase protected.


- `key`: `<Object>` | `<string>` | `<Buffer>` | `<KeyObject>`
  - `key`: `<string>` | `<Buffer>`
  - `format`: `<string>` Must be 'pem' or 'der'. **Default:** 'pem'.
  - `type`: `<string>` Must be 'pkcs1', 'pkcs8' or 'sec1'. This option is required only if the format is 'der' and ignored if it is 'pem'.
  - `passphrase`: `<string>` | `<Buffer>` The passphrase to use for decryption.
- `options`: `<Object>`
  - `alg`: `<string>` option identifies the algorithm intended for use with the key.
  - `use`: `<string>` option indicates whether the key is to be used for encrypting & decrypting data or signing & verifying data. Must be 'sig' or 'enc'.
  - `kid`: `<string>` Key ID Parameter. When not provided is computed using the method defined in [RFC7638][spec-thumbprint]
- Returns: `<JWK.RSAKey>` | `<JWK.ECKey>`

See the underlying Node.js API for details on importing private and public keys in the different formats

- [crypto.createPrivateKey(key)](https://nodejs.org/api/crypto.html#crypto_crypto_createprivatekey_key)
- [crypto.createPublicKey(key)](https://nodejs.org/api/crypto.html#crypto_crypto_createpublickey_key)
- [crypto.createSecretKey(key)](https://nodejs.org/api/crypto.html#crypto_crypto_createsecretkey_key)

<details>
  <summary><em><strong>Example</strong></em> (Click to expand)</summary>

```js
const { readFileSync } = require('fs')
const { JWK: { importKey } } = require('@panva/jose')

const key = importKey(readFileSync('path/to/key/file'))
// ECKey {
//   kty: 'EC',
//   public: true,
//   kid: [Getter],
//   crv: [Getter],
//   x: [Getter],
//   y: [Getter] }
```
</details>

---

#### `JWK.importKey(secret[, options])` secret key import

Imports a symmetric key.

- `secret`: `<string>` | `<Buffer>` | `<KeyObject>`
- `options`: `<Object>`
  - `alg`: `<string>` option identifies the algorithm intended for use with the key.
  - `use`: `<string>` option indicates whether the key is to be used for encrypting & decrypting data or signing & verifying data. Must be 'sig' or 'enc'.
  - `kid`: `<string>` Key ID Parameter. When not provided is computed using the method defined in [RFC7638][spec-thumbprint]
- Returns: `<JWK.OctKey>`

<details>
  <summary><em><strong>Example</strong></em> (Click to expand)</summary>

```js
const { JWK: { importKey } } = require('@panva/jose')

const key = importKey(Buffer.from('8yHym6h5CG5FylbzrCn8fhxEbp3kOaTsgLaawaaJ'))
// OctKey {
//   kty: 'oct',
//   kid: [Getter],
//   k: [Getter] }
```
</details>

---

#### `JWK.importKey(jwk)` JWK-formatted key import

Imports a JWK formatted key. This supports JWK formatted EC, RSA and oct keys. Asymmetrical keys
may be both private and public.

- `jwk`: `<Object>`
  - `kty`: `<string>` Key type. Must be 'RSA', 'EC' or 'oct'.
  - `alg`: `<string>` option identifies the algorithm intended for use with the key.
  - `use`: `<string>` option indicates whether the key is to be used for encrypting & decrypting data or signing & verifying data. Must be 'sig' or 'enc'.
  - `kid`: `<string>` Key ID Parameter. When not provided is computed using the method defined in [RFC7638][spec-thumbprint]
  - `e`, `n` properties as `<string>` for RSA public keys
  - `e`, `n`, `d`, `p`, `q`, `dp`, `dq`, `qi` properties as `<string>` for RSA private keys
  - `crv`, `x`, `y` properties as `<string>` for EC public keys
  - `crv`, `x`, `y`, `d` properties as `<string>` for EC private keys
  - `k` properties as `<string>` for secret oct keys
- Returns: `<JWK.RSAKey>` | `<JWK.ECKey>` | `<JWK.OctKey>`

<details>
<summary><em><strong>Example</strong></em> (Click to expand)</summary>

```js
const { JWK: { importKey } } = require('@panva/jose')
const jwk = {
  kty: 'RSA',
  kid: 'r1LkbBo3925Rb2ZFFrKyU3MVex9T2817Kx0vbi6i_Kc',
  use: 'sig',
  e: 'AQAB',
  n: 'xwQ72P9z9OYshiQ-ntDYaPnnfwG6u9JAdLMZ5o0dmjlcyrvwQRdoFIKPnO65Q8mh6F_LDSxjxa2Yzo_wdjhbPZLjfUJXgCzm54cClXzT5twzo7lzoAfaJlkTsoZc2HFWqmcri0BuzmTFLZx2Q7wYBm0pXHmQKF0V-C1O6NWfd4mfBhbM-I1tHYSpAMgarSm22WDMDx-WWI7TEzy2QhaBVaENW9BKaKkJklocAZCxk18WhR0fckIGiWiSM5FcU1PY2jfGsTmX505Ub7P5Dz75Ygqrutd5tFrcqyPAtPTFDk8X1InxkkUwpP3nFU5o50DGhwQolGYKPGtQ-ZtmbOfcWQ'
}

const key = importKey(jwk)
// RSAKey {
//   kty: 'RSA',
//   public: true,
//   use: 'sig',
//   kid: 'r1LkbBo3925Rb2ZFFrKyU3MVex9T2817Kx0vbi6i_Kc',
//   e: [Getter],
//   n: [Getter] }
```
</details>

---

#### `JWK.generate(kty[, crvOrSize[, options[, private]]])` generating new keys

Securely generates a new RSA, EC or oct key.

- `kty`: `<string>` Key type. Must be 'RSA', 'EC' or 'oct'.
- `crvOrSize`: `<number>` | `<string>` key's bit size or in case of EC keys the curve
- `options`: `<Object>`
  - `alg`: `<string>` option identifies the algorithm intended for use with the key.
  - `use`: `<string>` option indicates whether the key is to be used for encrypting & decrypting data or signing & verifying data. Must be 'sig' or 'enc'.
  - `kid`: `<string>` Key ID Parameter. When not provided is computed using the method defined in [RFC7638][spec-thumbprint]
- `private`: `<boolean>` **Default** 'true'. Is the resulting key private or public (when asymmetrical)
- Returns: `Promise<JWK.RSAKey>` | `Promise<JWK.ECKey>` | `Promise<JWK.OctKey>`

<details>
<summary><em><strong>Example</strong></em> (Click to expand)</summary>

```js
const { JWK: { generate } } = require('@panva/jose')
(async () => {
  const key = await generate('EC', 'P-384', { use: 'sig' })
  // ECKey {
  //   kty: 'EC',
  //   private: true,
  //   use: 'sig',
  //   kid: [Getter],
  //   crv: [Getter],
  //   x: [Getter],
  //   y: [Getter],
  //   d: [Getter] }
})()
```
</details>

---

#### `JWK.generateSync(kty[, crvOrSize[, options[, private]]])`

Synchronous version of `JWK.generate()`

- `kty`: `<string>` Key type. Must be 'RSA', 'EC' or 'oct'.
- `crvOrSize`: `<number>` | `<string>` key's bit size or in case of EC keys the curve. **Default** 2048 for RSA, 'P-256' for EC and 256 for oct.
- `options`: `<Object>`
  - `alg`: `<string>` option identifies the algorithm intended for use with the key.
  - `use`: `<string>` option indicates whether the key is to be used for encrypting & decrypting data or signing & verifying data. Must be 'sig' or 'enc'.
  - `kid`: `<string>` Key ID Parameter. When not provided is computed using the method defined in [RFC7638][spec-thumbprint]
- `private`: `<boolean>` **Default** 'true'. Is the resulting key private or public (when asymmetrical)
- Returns: `<JWK.RSAKey>` | `<JWK.ECKey>` | `<JWK.OctKey>`

<details>
<summary><em><strong>Example</strong></em> (Click to expand)</summary>

```js
const { JWK: { generateSync } } = require('@panva/jose')
const key = generateSync('RSA', 2048, { use: 'enc' })
// RSAKey {
//   kty: 'RSA',
//   private: true,
//   use: 'enc',
//   kid: [Getter],
//   e: [Getter],
//   n: [Getter],
//   d: [Getter],
//   p: [Getter],
//   q: [Getter],
//   dp: [Getter],
//   dq: [Getter],
//   qi: [Getter] }
```
</details>

---

#### `JWK.isKey(object)`

Returns 'true' if the value is an instance of `<JWK.Key>`.

- `object`: `<any>`
- Returns: `<boolean>`

---

## JWKS (JSON Web Key Set)

<!-- TOC JWKS START -->
- [Class: <JWKS.KeyStore>](#class-jwkskeystore)
  - [new JWKS.KeyStore([keys])](#new-jwkskeystorekeys)
    - [keystore.size](#keystoresize)
    - [keystore.all([parameters])](#keystoreallparameters)
    - [keystore.get([parameters])](#keystoregetparameters)
    - [keystore.add(key)](#keystoreaddkey)
    - [keystore.remove(key)](#keystoreremovekey)
    - [keystore.generate(...)](#keystoregenerate)
    - [keystore.generateSync(...)](#keystoregeneratesync)
    - [keystore.toJWKS([private])](#keystoretojwksprivate)
  - [JWKS.KeyStore.fromJWKS(jwks)](#jwkskeystorefromjwksjwks)
<!-- TOC JWKS END -->

```js
const { JWKS } = require('@panva/jose')
// { KeyStore: [Function: KeyStore] }
```

#### Class: `<JWKS.KeyStore>`

`JWKS.KeyStore` is an abstraction representing a set of JWKs, a keystore instance may be queried for
keys matching specific parameters. Keystores may be instantiated either populated, or empty and there
are lifecycle `keystore.remove()` and `keystore.add()` methods for adding/removing keys from an existing
store.

---

#### `new JWKS.KeyStore([keys])`

Creates a new KeyStore, either empty or populated.

- `keys`: `<JWK.Key[]>` Array of key keys instantiated by `JWK.importKey()`
- Returns: `<JWKS.KeyStore>`

---

#### `keystore.size`

Returns the number of keys in the keystore.

- `<number>`
---

#### `keystore.all([parameters])`

Retrieves an array of keys matching the provider parameters, returns all if none are provided. The
returned array is sorted by relevance based on the parameters. Keys with the exact algorithm or use
specified by the parameters are first.

- `parameters`: `<Object>`
  - `kty`: `<string>` Key Type to filter for.
  - `alg`: `<string>` Key supported algorithm to filter for.
  - `use`: `<string>` Key use to filter for.
  - `kid`: `<string>` Key ID to filter for.
- Returns: `<Key[]>` Array of key instances or an empty array when none are matching the parameters.

---

#### `keystore.get([parameters])`

Retrieves a single key matching the provider parameters. The most relevant Key based on the
parameters is returned.

- `parameters`: `<Object>`
  - `kty`: `<string>` Key Type to filter for.
  - `alg`: `<string>` Key supported algorithm to filter for.
  - `use`: `<string>` Key use to filter for.
  - `kid`: `<string>` Key ID to filter for.
- Returns: `<JWK.RSAKey>` | `<JWK.ECKey>` | `<JWK.OctKey>` | `<undefined>`

---

#### `keystore.add(key)`

Adds a key instance to the store unless it is already included.

- `key`: `<JWK.RSAKey>` | `<JWK.ECKey>` | `<JWK.OctKey>`

---

#### `keystore.remove(key)`

Ensures a key is removed from a store.

- `key`: `<JWK.RSAKey>` | `<JWK.ECKey>` | `<JWK.OctKey>`

---

#### `keystore.generate(...)`

Asynchronously generates new random key and automatically adds it to the store. See `JWK.generate()` for the API.

---

#### `keystore.generateSync(...)`

Synchronous version of `keystore.generate()`.

---

#### `keystore.toJWKS([private])`

Exports the keystore to a JSON Web Key Set formatted object.

- `private`: `<boolean>` When true exports keys with their private components. **Default:** 'false'
- Returns: `<Object>`

---

#### `JWKS.KeyStore.fromJWKS(jwks)`

Creates a new KeyStore from a JSON Web Key Set.

- `jwks`: `<Object>` JWKS formatted object (`{ keys: [{ kty: '...', ... }, ...] }`)
- Returns: `<JWKS.KeyStore>`

<details>
<summary><em><strong>Example</strong></em> (Click to expand)</summary>

```js
const { JWKS: { KeyStore } } = require('@panva/jose')
const jwks = { keys:
   [ { kty: 'RSA',
       kid: 'gqUcZ2TjhmNrVOd1d27tedkabhOTs9WghMHIyjIBn7Y',
       e: 'AQAB',
       n:
        'vi1Aui6R0rUL_7pdcFKKMhBF25h4x8WiTZ4w66eNZhwIp48lz-vBuyUUrSR-RwcuvnxlXdjBdSaN-PZkNRDv2bXE3mVtjZgoYyzQlGLJ1wduQaBXIkrQWxc7yzL91MvtP1kWwFHHrQHZRlpiFQQm9gNCy2wXCTbWGT9kjrR1W1bkwhmOKK4rF-hMgaCNDrtEQ6xWknxV8aXW4itouJ0pJv8xplc6J14f_SNq6arVUcAZ26EzJYC2fcvqwsrnKzvW7QxQGQzh-u9Tn82Tl14Omh1KDV8C7Vb_m8XClv_9zOrKBGdaTl1zgINyMEaa_IMophnBgK_kAXvtVvEThQ93GQ',
       use: 'enc' } ] }
const ks = KeyStore.fromJWKS(jwks)
// KeyStore {}
ks.size
// 1
```
</details>

---

## JWS (JSON Web Signature)

<!-- TOC JWS START -->
- [Class: &lt;JWS.Sign&gt;](#class-jwssign)
  - [new JWS.Sign(payload)](#new-jwssignpayload)
  - [sign.recipient(key[, protected[, header]])](#signrecipientkey-protected-header)
  - [sign.sign(serialization)](#signsignserialization)
- [JWS.sign(payload, key[, protected])](#jwssignpayload-key-protected)
- [JWS.sign.flattened(payload, key[, protected[, header]])](#jwssignflattenedpayload-key-protected-header)
- [JWS.verify(jws, keyOrStore[, options])](#jwsverifyjws-keyorstore-options)
<!-- TOC JWS END -->

The `<JWS>` module provides methods required to sign or verify JSON Web Signatures in either one of
the defined serializations.

```js
const { JWS } = require('@panva/jose')
// { Sign: [Function: Sign],
//   sign:
//    { [Function: bound single]
//      flattened: [Function: bound single] },
//   verify: [Function: bound jwsVerify] }
```

#### Class: `<JWS.Sign>`

`<JWS.Sign>` is the class used when you need to produce a JWS for multiple recipients (with multiple
signatures of the same payload) using the General JWS JSON Serialization Syntax.

<details>
<summary><em><strong>Example</strong></em> (Click to expand)</summary>

```js
const { JWK, JWS } = require('@panva/jose')

const key = JWK.importKey({
  kty: 'oct',
  k: 'hJtXIZ2uSN5kbQfbtTNWbpdmhkV8FJG-Onbc6mxCcYg'
})
const key2 = JWK.importKey({
  kty: 'oct',
  k: 'AAPapAv4LbFbiVawEjagUBluYqN5rhna-8nuldDvOx8'
})

const payload = {
  sub: 'John Doe'
}

const sig = new JWS.Sign(payload)
sig.recipient(key, { alg: 'HS256' }, { foo: 'bar' })
sig.recipient(key2, { alg: 'HS512' }, { foo: 'baz' })
sig.sign('general')
// { payload: 'eyJzdWIiOiJKb2huIERvZSJ9',
//   signatures:
//    [ { protected: 'eyJhbGciOiJIUzI1NiJ9',
//        header: { foo: 'bar' },
//        signature: 'mnBcKK-9setCco03NtYws-RMlYXP3LGlDu2RUB7vetQ' },
//      { protected: 'eyJhbGciOiJIUzUxMiJ9',
//        header: { foo: 'baz' },
//        signature:
//         'R7e5ZUkgiZQLh8JagoCbwAY21e9A-Y0rhUGQkhihLOvIU8JG2AyZ9zROOUICaUucf8NQKc2dEaIKdRCXy-fDdQ' } ] }

```
</details>

---

#### `new JWS.Sign(payload)`

Creates a new Sign object for the provided payload, intended for one or more recipients.

- `payload`: `<Object>` | `<string>` | `<Buffer>` The payload that will be signed. When `<Object>` it
  will be automatically serialized to JSON before signing
- Returns: `<JWS.Sign>`

---

#### `sign.recipient(key[, protected[, header]])`

Adds a recipient to the JWS, the Algorithm that will be used to sign with is either provided as part
of the Protected or Unprotected Header or inferred from the provided `<JWK.Key>` instance.

- `key`: `<JWK.Key>` The key to sign with.
- `protected`: `<Object>` Protected Header for this recipient
- `header`: `<Object>` Unprotected Header for this recipient

---

#### `sign.sign(serialization)`

Performs the signing operations for each registered recipient and returns the final JWS representation
in the serialization requested. The JWS is validated for conformance during this step. Please note
that only 'general' and 'flattened' serialization supports Unprotected Per-Recipient Header and only
the 'general' serialization supports multiple recipients. See `<JWS.sign>` and `<JWS.sign.flattened>`
for shorthand methods to sign for a single recipient.

- `serialization`: `<string>` JWS Serialization. Must be one of 'general', 'flattened', 'compact'
- Returns: `<string>` | `<Object>`

---

#### `JWS.sign(payload, key[, protected])`

Performs the signing operation and 'compact' JWS serialization of the result. The Algorithm that
will be used to sign with is either provided as part of the Protected Header or inferred from the
provided `<JWK.Key>` instance.

- `payload`: `<Object>` | `<string>` | `<Buffer>` The payload that will be signed. When `<Object>` it
  will be automatically serialized to JSON before signing
- `key`: `<JWK.Key>` The key to sign with.
- `protected`: `<Object>` Protected Header
- Returns: `<string>`

<details>
<summary><em><strong>Example</strong></em> (Click to expand)</summary>

```js
const { JWK, JWS } = require('@panva/jose')

const key = JWK.importKey({
  kty: 'oct',
  k: 'hJtXIZ2uSN5kbQfbtTNWbpdmhkV8FJG-Onbc6mxCcYg'
})

const payload = {
  sub: 'John Doe'
}
JWS.sign(payload, key, { alg: 'HS256' })
// eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJKb2huIERvZSJ9.mnBcKK-9setCco03NtYws-RMlYXP3LGlDu2RUB7vetQ
```
</details>

---

#### `JWS.sign.flattened(payload, key[, protected[, header]])`

Performs the signing operation and 'flattened' JWS serialization of the result. The Algorithm that
will be used to sign with is either provided as part of the Protected or Unprotected Header or inferred from the
provided `<JWK.Key>` instance.

- `payload`: `<Object>` | `<string>` | `<Buffer>` The payload that will be signed. When `<Object>` it
  will be automatically serialized to JSON before signing
- `key`: `<JWK.Key>` The key to sign with.
- `protected`: `<Object>` Protected Header
- `header`: `<Object>` Unprotected Header
- Returns: `<Object>`

<details>
<summary><em><strong>Example</strong></em> (Click to expand)</summary>

```js
const { JWK, JWS } = require('@panva/jose')

const key = JWK.importKey({
  kty: 'oct',
  k: 'hJtXIZ2uSN5kbQfbtTNWbpdmhkV8FJG-Onbc6mxCcYg'
})

const payload = {
  sub: 'John Doe'
}

JWS.sign.flattened(payload, key)
// { payload: 'eyJzdWIiOiJKb2huIERvZSJ9',
//   protected: 'eyJhbGciOiJIUzI1NiJ9',
//   signature: 'mnBcKK-9setCco03NtYws-RMlYXP3LGlDu2RUB7vetQ' }
```
</details>

---

#### `JWS.verify(jws, keyOrStore[, options])`

Verifies the provided JWS in either serialization with a given `<JWK.Key>` or `<JWKS.KeyStore>`

- `jws`: `<Object>` | `<string>` The JWS to verify. This must be a valid JWS.
- `keyOrStore`: `<JWK.Key>` | `<JWKS.KeyStore>` The key or store to verify with. When `<JWKS.KeyStore>`
  instance is provided a selection of possible candidate keys will be done and the operation will
  succeed if just one key or signature (in case of General JWS JSON Serialization Syntax) matches.
- `options`: `<Object>`
  - `algorithms`: `string[]` Array of Algorithms to accept, when the signature does not use an
    algorithm from this list the verification will fail. **Default:** 'undefined' - accepts all
    algorithms available on the keys
  - `complete`: `<boolean>` When true returns a complete object with the parsed headers and payload
    instead of just the verified payload. **Default:** 'false'
  - `crit`: `string[]` Array of Critical Header Parameter names to recognize. **Default:** '[]'
- Returns: `<string>` | `<Object>`

<details>
<summary><em><strong>Example</strong></em> (Click to expand)</summary>

```js
const { JWK, JWS, JWKS } = require('@panva/jose')

const key = JWK.importKey({
  kty: 'oct',
  k: 'hJtXIZ2uSN5kbQfbtTNWbpdmhkV8FJG-Onbc6mxCcYg'
})
const key2 = JWK.importKey({
  kty: 'oct',
  k: 'AAPapAv4LbFbiVawEjagUBluYqN5rhna-8nuldDvOx8'
})

const compact = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJKb2huIERvZSJ9.mnBcKK-9setCco03NtYws-RMlYXP3LGlDu2RUB7vetQ'

const flattened = { payload: 'eyJzdWIiOiJKb2huIERvZSJ9',
  protected: 'eyJhbGciOiJIUzI1NiJ9',
  signature: 'mnBcKK-9setCco03NtYws-RMlYXP3LGlDu2RUB7vetQ' }

const general = { payload: 'eyJzdWIiOiJKb2huIERvZSJ9',
  signatures:
   [ { protected: 'eyJhbGciOiJIUzI1NiJ9',
       header: { foo: 'bar' },
       signature: 'mnBcKK-9setCco03NtYws-RMlYXP3LGlDu2RUB7vetQ' },
     { protected: 'eyJhbGciOiJIUzUxMiJ9',
       header: { foo: 'baz' },
       signature:
        'R7e5ZUkgiZQLh8JagoCbwAY21e9A-Y0rhUGQkhihLOvIU8JG2AyZ9zROOUICaUucf8NQKc2dEaIKdRCXy-fDdQ' } ] }

JWS.verify(compact, key)
// { sub: 'John Doe' }

JWS.verify(flattened, key2)
// JWSVerificationFailed: signature verification failed

JWS.verify(compact, key, { complete: true })
// { payload: { sub: 'John Doe' }, protected: { alg: 'HS256' }, key: OctKey {} }

JWS.verify(flattened, key, { algorithms: ['PS256'] })
// JOSEAlgNotWhitelisted: alg not whitelisted

JWS.verify(general, key)
// { sub: 'John Doe' }
JWS.verify(general, key2)
// { sub: 'John Doe' }

JWS.verify(general, key, { complete: true })
// { payload: { sub: 'John Doe' },
//   protected: { alg: 'HS256' },
//   header: { foo: 'bar' },
//   key: : OctKey {} } <- key
JWS.verify(general, key2, { complete: true })
// { payload: { sub: 'John Doe' },
//   protected: { alg: 'HS512' },
//   header: { foo: 'baz' },
//   key: : OctKey {} } <- key2
const keystore = new JWKS.KeyStore(key)
JWS.verify(general, keystore, { complete: true })
// { payload: { sub: 'John Doe' },
//   protected: { alg: 'HS256' },
//   header: { foo: 'bar' },
//   key: : OctKey {} } <- key that matched in the keystore
```
</details>

---

## JWE (JSON Web Encryption)

<!-- TOC JWE START -->
- [Class: &lt;JWE.Encrypt&gt;](#class-jweencrypt)
  - [new JWE.Encrypt(cleartext[, protected[, unprotected[, aad]]])](#new-jweencryptcleartext-protected-unprotected-aad)
  - [encrypt.recipient(key[, header])](#encryptrecipientkey-header)
  - [encrypt.encrypt(serialization)](#encryptencryptserialization)
- [JWE.encrypt(cleartext, key[, protected])](#jweencryptcleartext-key-protected)
- [JWE.encrypt.flattened(cleartext, key[, protected[, header[, aad]]])](#jweencryptflattenedcleartext-key-protected-header-aad)
- [JWE.decrypt(jwe, keyOrStore[, options])](#jwedecryptjwe-keyorstore-options)
<!-- TOC JWE END -->

The `<JWE>` module provides methods required to encrypt or decrypt JSON Web Encryptions in either one of
the defined serializations.

```js
const { JWE } = require('@panva/jose')
// { Encrypt: [Function: Encrypt],
//   encrypt:
//    { [Function: bound single]
//      flattened: [Function: bound single] },
//   decrypt: [Function: bound jweDecrypt] }
```

#### Class: `<JWE.Encrypt>`

`<JWE.Encrypt>` is the class used when you need to produce a JWE for multiple recipients using the
General JWE JSON Serialization Syntax.

---

#### `new JWE.Encrypt(cleartext[, protected[, unprotected[, aad]]])`

Creates a new Encrypt object for the provided cleartext with optional Protected and Unprotected
Headers and Additional Authenticated Data.

- `cleartext`: `<string>` | `<Buffer>` The cleartext that will be encrypted.
- `protected`: `<Object>` JWE Protected Header
- `unprotected`: `<Object>` JWE Shared Unprotected Header
- `aad`: `<string>` | `<Buffer>` JWE Additional Authenticated Data
- Returns: `<JWE.Encrypt>`

---

#### `encrypt.recipient(key[, header])`

Adds a recipient to the JWE, the Algorithm that will be used to wrap or derive the Content Encryption
Key (CEK) is either provided as part of the combined JWE Header for the recipient or inferred from
the provided `<JWK.Key>` instance.

- `key`: `<JWK.Key>` The key to use for Key Management or Direct Encryption
- `header`: `<Object>` JWE Per-Recipient Unprotected Header

---

#### `encrypt.encrypt(serialization)`

Performs the encryption operations for each registered recipient and returns the final JWE representation
in the serialization requested. The JWE is validated for conformance during this step. Please note
that only 'general' and 'flattened' serialization supports Unprotected Per-Recipient Header and AAD
and only the 'general' serialization supports multiple recipients. See `<JWE.encrypt>` and `<JWE.encrypt.flattened>`
for shorthand methods to encrypt for a single recipient.

- `serialization`: `<string>` JWE Serialization. Must be one of 'general', 'flattened', 'compact'
- Returns: `<string>` | `<Object>`

---

#### `JWE.encrypt(cleartext, key[, protected])`

Performs the encryption operation and 'compact' JWE serialization of the result. The Algorithm that
will be used to wrap or derive the Content Encryption Key (CEK) is either provided as part of the
Protected Header or inferred from the provided `<JWK.Key>` instance.

- `cleartext`: `<string>` | `<Buffer>` The cleartext that will be encrypted.
- `key`: `<JWK.Key>` The key to use for Key Management or Direct Encryption
- `protected`: `<Object>` JWE Protected Header
- Returns: `<string>`

---

#### `JWE.encrypt.flattened(cleartext, key[, protected[, header[, aad]]])`

Performs the encryption operation and 'flattened' JWE serialization of the result. The Algorithm that
will be used to wrap or derive the Content Encryption Key (CEK) is either provided as part of the
combined JWE Header or inferred from the provided `<JWK.Key>` instance.

- `cleartext`: `<string>` | `<Buffer>` The cleartext that will be encrypted.
- `key`: `<JWK.Key>` The key to use for Key Management or Direct Encryption
- `protected`: `<Object>` JWE Protected Header
- `unprotected`: `<Object>` JWE Shared Unprotected Header
- `aad`: `<string>` | `<Buffer>` JWE Additional Authenticated Data
- Returns: `<Object>`

---

#### `JWE.decrypt(jwe, keyOrStore[, options])`

Verifies the provided JWE in either serialization with a given `<JWK.Key>` or `<JWKS.KeyStore>`

- `jwe`: `<Object>` | `<string>` The JWE to decrypt. This must be a valid JWE.
- `keyOrStore`: `<JWK.Key>` | `<JWKS.KeyStore>` The key or store to decrypt with. When `<JWKS.KeyStore>`
  instance is provided a selection of possible candidate keys will be done and the operation will
  succeed if just one key or signature (in case of General JWE JSON Serialization Syntax) matches.
- `options`: `<Object>`
  - `algorithms`: `string[]` Array of Algorithms to accept, when the JWE does not use an
    Key Management algorithm from this list the decryption will fail. **Default:** 'undefined' -
    accepts all algorithms available on the keys
  - `complete`: `<boolean>` When true returns a complete object with the parsed headers, verified AAD
    and cleartext instead of just the cleartext. **Default:** 'false'
- Returns: `<string>` | `<Object>`


[spec-thumbprint]: https://tools.ietf.org/html/rfc7638
[support-patreon]: https://www.patreon.com/panva
[support-paypal]: https://www.paypal.me/panva
