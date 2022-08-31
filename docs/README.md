# `jose` API Documentation

> "JSON Web Almost Everything" - JWA, JWS, JWE, JWT, JWK, JWKS for Node.js with minimal dependencies

**Table of Contents**

- [JWK (JSON Web Key)](#jwk-json-web-key)
- [JWKS (JSON Web Key Set)](#jwks-json-web-key-set)
- [JWT (JSON Web Token)](#jwt-json-web-token)
- [JWS (JSON Web Signature)](#jws-json-web-signature)
- [JWE (JSON Web Encryption)](#jwe-json-web-encryption)
- [errors](#errors)

## Support

If you or your business use `jose`, please consider becoming a [sponsor][support-sponsor] so I can continue maintaining it and adding new features carefree.

<br>

---

## JWK (JSON Web Key)

<!-- TOC JWK START -->
- [Class: &lt;JWK.Key&gt; and &lt;JWK.RSAKey&gt; &vert; &lt;JWK.ECKey&gt; &vert; &lt;JWK.OKPKey&gt; &vert; &lt;JWK.OctKey&gt;](#class-jwkkey-and-jwkrsakey--jwkeckey--jwkokpkey--jwkoctkey)
  - [key.kty](#keykty)
  - [key.alg](#keyalg)
  - [key.use](#keyuse)
  - [key.kid](#keykid)
  - [key.x5c](#keyx5c)
  - [key.x5t](#keyx5t)
  - [key['x5t#S256']](#keyx5ts256)
  - [key.key_ops](#keykey_ops)
  - [key.thumbprint](#keythumbprint)
  - [key.type](#keytype)
  - [key.public](#keypublic)
  - [key.private](#keyprivate)
  - [key.secret](#keysecret)
  - [key.keyObject](#keykeyobject)
  - [key.algorithms([operation])](#keyalgorithmsoperation)
  - [key.toJWK([private])](#keytojwkprivate)
  - [key.toPEM([private[, encoding]])](#keytopemprivate-encoding)
- JWK.asKey
  - [JWK.asKey(key[, options]) asymmetric key import](#jwkaskeykey-options-asymmetric-key-import)
  - [JWK.asKey(secret[, options]) secret key import](#jwkaskeysecret-options-secret-key-import)
  - [JWK.asKey(jwk[, options]) JWK-formatted key import](#jwkaskeyjwk-options-jwk-formatted-key-import)
- [JWK.generate(kty[, crvOrSize[, options[, private]]]) generating new keys](#jwkgeneratekty-crvorsize-options-private-generating-new-keys)
- [JWK.generateSync(kty[, crvOrSize[, options[, private]]])](#jwkgeneratesynckty-crvorsize-options-private)
- [JWK.isKey(object)](#jwkiskeyobject)
- [JWK.None](#jwknone)
- [JWK.EmbeddedJWK](#jwkembeddedjwk)
- [JWK.EmbeddedX5C](#jwkembeddedx5c)
<!-- TOC JWK END -->

All sign and encrypt operations require `<JWK.Key>` or `JWK.asKey()` compatible input.  
All verify and decrypt operations require `<JWK.Key>`, `<JWKS.KeyStore>`, or `JWK.asKey()` compatible input.  

Whenever you're re-using the same key input for an operation it is recommended that you instantiate
the  `<JWK.Key>` instance. Here's how to get a `<JWK.Key>` instances generated or instantiated from existing key material.


```js
const { JWK } = require('jose')
// { asKey: [Function: asKey],
//   generate: [AsyncFunction: generate],
//   generateSync: [Function: generateSync] }
```

---

#### Class: `<JWK.Key>` and `<JWK.RSAKey>` &vert; `<JWK.ECKey>` &vert; `<JWK.OKPKey>` &vert; `<JWK.OctKey>`

`<JWK.RSAKey>`, `<JWK.ECKey>`, `<JWK.OKPKey>` and `<JWK.OctKey>` represent a key usable for JWS and JWE operations.
The `JWK.asKey()` method is used to retrieve a key representation of an existing key or secret.
`JWK.generate()` method is used to generate a new random key.

`<JWK.RSAKey>`, `<JWK.ECKey>`, `<JWK.OKPKey>` and `<JWK.OctKey>` inherit methods from `<JWK.Key>` and in addition
to the properties documented below have the respective key component properties exported as
`<string>` in their format defined by the specifications.

- `e, n` for Public RSA Keys
- `e, n, d, p, q, dp, dq, qi` for Private RSA Keys
- `crv, x, y` for Public EC Keys
- `crv, x, y, n` for Private EC Keys
- `crv, x` for Public OKP Keys
- `crv, x, n` for Private OKP Keys
- `k` for Symmetric keys

---

#### `key.kty`

Returns the key's JWK Key Type Parameter. 'EC', 'RSA', 'OKP' or 'oct' for the respective supported
key types.

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
related operations (key management or encryption).

- `<string>`

---

#### `key.kid`

Returns the key's JWK Key ID Parameter if set, if not set it will be calculated using the method
defined in [RFC7638][spec-thumbprint].

- `<string>`

---

#### `key.x5c`

Returns the key's X.509 Certificate Chain Parameter if set

- `string[]`

---

#### `key.x5t`

Returns the key's X.509 Certificate SHA-1 Thumbprint Parameter if set. This
property can be either set manually by the JWK producer or left to the library to compute based
on the first certificate in the key's `x5c`, the latter is preferred.

- `<string>`

---

#### `key['x5t#S256']`

Returns the key's X.509 Certificate SHA-256 Thumbprint Parameter if set. This
property can be either set manually by the JWK producer or left to the library to compute based
on the first certificate in the key's `x5c`, the latter is preferred.

- `<string>`

---

#### `key.key_ops`

Returns the key's JWK Key Operations Parameter if set. If set the key can only be used for the
specified operations. Supported values are 'sign', 'verify', 'encrypt', 'decrypt', 'wrapKey',
'unwrapKey' and 'deriveKey'.

- `string[]`

---

#### `key.thumbprint`

Returns the key's JWK Key thumbprint calculated using the method defined in [RFC7638][spec-thumbprint].

- `<string>`

---

#### `key.type`

Returns the type of key. One of 'private', 'public' or 'secret'

- `<string>`

---

#### `key.public`

Returns true/false if the key is asymmetric and public. Returns false for symmetric keys.

- `<boolean>`

---

#### `key.private`

Returns true/false if the key is asymmetric and private. Returns false for symmetric keys.

- `<boolean>`

#### `key.secret`

Returns true/false if the key is symmetric. Returns false for asymmetric keys.

- `<boolean>`

---

#### `key.keyObject`

Returns the underlying [`KeyObject`](https://nodejs.org/api/crypto.html#crypto_class_keyobject)
instance. Throws `JOSENotSupported` when KeyObject API is not supported in the Node.js runtime.

- `<KeyObject>`

---

#### `key.algorithms([operation])`

Returns a [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
of algorithms the key may perform.

- `operation`: `<string>` Must be one of 'encrypt', 'decrypt', 'sign', 'verify', 'wrapKey',
  'unwrapKey'
- Returns: `Set<string>`

<details>
  <summary><em><strong>Example</strong></em> (Click to expand)</summary>

```js
const { JWK: { generateSync } } = require('jose')

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
//  'RSA-OAEP-256',
//  'RSA1_5' }
privateKey.algorithms('wrapKey')
// Set {
//  'RSA-OAEP',
//  'RSA-OAEP-256',
//  'RSA1_5' }

const publicKey = generateSync('RSA', 2048, { use: 'enc' }, false)
publicKey.algorithms('sign')
// Set {}
publicKey.algorithms('unwrapKey')
// Set {}
publicKey.algorithms('wrapKey')
// Set {
//  'RSA-OAEP',
//  'RSA-OAEP-256',
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
const { JWK: { generateSync } } = require('jose')

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

#### `key.toPEM([private[, encoding]])`

Exports an asymmetric key as a PEM string with specified encoding and optional encryption for private keys.

- `private`: `<boolean>` When true exports keys as private. **Default:** 'false'
- `encoding`: `<Object>` See below
- Returns: `<string>`

For public key export, the following encoding options can be used:

- `type`: `<string>` Must be one of 'pkcs1' (RSA only) or 'spki'. **Default:** 'spki'


For private key export, the following encoding options can be used:

- `type`: `<string>` Must be one of 'pkcs1' (RSA only), 'pkcs8' or 'sec1' (EC only). **Default:** 'pkcs8'
- `cipher`: `<string>` If specified, the private key will be encrypted with the given cipher and
  passphrase using PKCS#5 v2.0 password based encryption. **Default**: 'undefined' (no encryption)
- `passphrase`: `<string>` &vert; `<Buffer>` The passphrase to use for encryption. **Default**: 'undefined' (no encryption)

<details>
  <summary><em><strong>Example</strong></em> (Click to expand)</summary>

```js
const { JWK: { generateSync } } = require('jose')

const key = generateSync('RSA', 2048)
key.toPEM()
// -----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEATPpxgDY7XU8cYX9Rb44xxXDO6zP\nzELVOHTcutCiXS9HZvUrZsnG7U/SPj0AT1hsH6lTUK4uFr7GG7KWgsf1Aw==\n-----END PUBLIC KEY-----\n
key.toPEM(true)
// -----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgUdAzlvX4i+RJS2BL\nQrqRj/ndTbpqugX61Ih9X+rvAcShRANCAAQBM+nGANjtdTxxhf1FvjjHFcM7rM/M\nQtU4dNy60KJdL0dm9StmycbtT9I+PQBPWGwfqVNQri4WvsYbspaCx/UD\n-----END PRIVATE KEY-----\n
key.toPEM(true, { passphrase: 'super-strong', cipher: 'aes-256-cbc' })
// -----BEGIN ENCRYPTED PRIVATE KEY-----\nMIHsMFcGCSqGSIb3DQEFDTBKMCkGCSqGSIb3DQEFDDAcBAjjeqsgorjSqwICCAAw\nDAYIKoZIhvcNAgkFADAdBglghkgBZQMEASoEEJFcyG1ZBe2FZuvXIqiRFUcEgZD5\nWzt2XIUGIEZQIUUpJ1naaIFKiZvBcFAXhqG5KJ6PgaohgcmRUK8OZTA9Ome+uXB+\n9PLLfKscOsyr0gkd45gYYNRDLYwbQSqDQ4g8pHrCVjR+R3mh1nk8jIkOxSppwzmF\n7aoCmnQo7oXRy1+kRZL7OfwAD5gAXnsIA42D9RgOG1XIiBYTvAITcFVX0UPh0zM=\n-----END ENCRYPTED PRIVATE KEY-----\n
```
</details>

---

#### `JWK.asKey(key[, options])` asymmetric key import

Imports an asymmetric private or public key. Supports importing JWK formatted keys (private, public,
secrets), `pem` and `der` formatted private and public keys, `pem` formatted X.509 certificates.
Private keys may also be passphrase protected.


- `key`: `<Object>` &vert; `<string>` &vert; `<Buffer>` &vert; `<KeyObject>`
  - `key`: `<string>` &vert; `<Buffer>`
  - `format`: `<string>` Must be 'pem' or 'der'. **Default:** 'pem'.
  - `type`: `<string>` Must be 'pkcs1', 'pkcs8', or 'sec1' for private keys, 'pkcs1', 'spki' for
    public keys. This option is required only if the format is 'der' and ignored if it is 'pem'.
  - `passphrase`: `<string>` &vert; `<Buffer>` The passphrase to use for decryption.
- `options`: `<Object>`
  - `alg`: `<string>` option identifies the algorithm intended for use with the key.
  - `kid`: `<string>` Key ID Parameter. When not provided is computed using the method defined in
    [RFC7638][spec-thumbprint]
  - `use`: `<string>` option indicates whether the key is to be used for encrypting & decrypting
    data or signing & verifying data. Must be 'sig' or 'enc'.
- Returns: `<JWK.RSAKey>` &vert; `<JWK.ECKey>` &vert; `<JWK.OKPKey>`

See the underlying Node.js API for details on importing private and public keys in the different
formats

- [crypto.createPrivateKey(key)](https://nodejs.org/api/crypto.html#crypto_crypto_createprivatekey_key)
- [crypto.createPublicKey(key)](https://nodejs.org/api/crypto.html#crypto_crypto_createpublickey_key)

<details>
  <summary><em><strong>Example</strong></em> (Click to expand)</summary>

```js
const { readFileSync } = require('fs')
const { JWK: { asKey } } = require('jose')

const key = asKey(readFileSync('path/to/key/file'))
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

#### `JWK.asKey(secret[, options])` secret key import

Imports a symmetric key.

- `secret`: `<string>` &vert; `<Buffer>` &vert; `<KeyObject>`
- `options`: `<Object>`
  - `alg`: `<string>` option identifies the algorithm intended for use with the key.
  - `kid`: `<string>` Key ID Parameter. When not provided is computed using the method defined in
    [RFC7638][spec-thumbprint]
  - `use`: `<string>` option indicates whether the key is to be used for encrypting & decrypting
    data or signing & verifying data. Must be 'sig' or 'enc'.
- Returns: `<JWK.OctKey>`

<details>
  <summary><em><strong>Example</strong></em> (Click to expand)</summary>

```js
const { JWK: { asKey } } = require('jose')

const key = asKey(Buffer.from('8yHym6h5CG5FylbzrCn8fhxEbp3kOaTsgLaawaaJ'))
// OctKey {
//   kty: 'oct',
//   kid: [Getter],
//   k: [Getter] }
```
</details>

---

#### `JWK.asKey(jwk[, options])` JWK-formatted key import

Imports a JWK formatted key. This supports JWK formatted RSA, EC, OKP and oct keys. Asymmetrical
keys may be both private and public.

- `jwk`: `<Object>`
  - `kty`: `<string>` Key type. Must be 'RSA', 'EC', 'OKP' or 'oct'.
  - `alg`: `<string>` option identifies the algorithm intended for use with the key.
  - `use`: `<string>` option indicates whether the key is to be used for encrypting & decrypting
    data or signing & verifying data. Must be 'sig' or 'enc'.
  - `kid`: `<string>` Key ID Parameter. When not provided is computed using the method defined in
    [RFC7638][spec-thumbprint]
  - `e`, `n` properties as `<string>` for RSA public keys
  - `e`, `n`, `d`, `p`, `q`, `dp`, `dq`, `qi` properties as `<string>` for RSA private keys
  - `e`, `n`, `d` properties as `<string>` for RSA private keys without optimization parametes (only
    with `calculateMissingRSAPrimes` option, see below)
  - `crv`, `x`, `y` properties as `<string>` for EC public keys
  - `crv`, `x`, `y`, `d` properties as `<string>` for EC private keys
  - `crv`, `x`, properties as `<string>` for OKP public keys
  - `crv`, `x`, `d` properties as `<string>` for OKP private keys
  - `k` properties as `<string>` for secret oct keys
- `options`: `<Object>`
  - `calculateMissingRSAPrimes`: `<boolean>` **Default** 'false'. This option is really only in
    effect when importing private RSA JWK keys, by default, keys without the optimization private
    key parameters (p, q, dp, dq, qi) won't be imported because their calculation is heavy and prone
    to blocking the process. Setting this option to true will enable these keys to be imported,
    albeit at your own risk. Depending on the key size the calculation takes long and it should
    only be used for JWK keys from trusted sources.
- Returns: `<JWK.RSAKey>` &vert; `<JWK.ECKey>` &vert; `<JWK.OKPKey>` &vert; `<JWK.OctKey>`


<details>
<summary><em><strong>Example</strong></em> (Click to expand)</summary>

```js
const { JWK: { asKey } } = require('jose')
const jwk = {
  kty: 'RSA',
  kid: 'r1LkbBo3925Rb2ZFFrKyU3MVex9T2817Kx0vbi6i_Kc',
  use: 'sig',
  e: 'AQAB',
  n: 'xwQ72P9z9OYshiQ-ntDYaPnnfwG6u9JAdLMZ5o0dmjlcyrvwQRdoFIKPnO65Q8mh6F_LDSxjxa2Yzo_wdjhbPZLjfUJXgCzm54cClXzT5twzo7lzoAfaJlkTsoZc2HFWqmcri0BuzmTFLZx2Q7wYBm0pXHmQKF0V-C1O6NWfd4mfBhbM-I1tHYSpAMgarSm22WDMDx-WWI7TEzy2QhaBVaENW9BKaKkJklocAZCxk18WhR0fckIGiWiSM5FcU1PY2jfGsTmX505Ub7P5Dz75Ygqrutd5tFrcqyPAtPTFDk8X1InxkkUwpP3nFU5o50DGhwQolGYKPGtQ-ZtmbOfcWQ'
}

const key = asKey(jwk)
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

Securely generates a new RSA, EC, OKP or oct key.

- `kty`: `<string>` Key type. Must be 'RSA', 'EC', 'OKP' or 'oct'.
- `crvOrSize`: `<number>` &vert; `<string>` key's bit size or in case of OKP and EC keys the curve
  **Default:** 2048 for RSA, 'P-256' for EC, 'Ed25519' for OKP and 256 for oct.
- `options`: `<Object>`
  - `alg`: `<string>` Key Algorithm Parameter. It identifies the algorithm intended for use with the
    key.
  - `kid`: `<string>` Key ID Parameter. When not provided is computed using the method defined in
    [RFC7638][spec-thumbprint].
  - `use`: `<string>` Public Key Use Parameter. Indicates whether the key is to be used for
    encrypting & decrypting data or signing & verifying data. Must be 'sig' or 'enc'.
  - `key_ops`: `string[]` Key Operations Parameter. If set, the key can only be used for the
    specified operations. Supported values are 'sign', 'verify', 'encrypt', 'decrypt', 'wrapKey',
    'unwrapKey' and 'deriveKey'.
- `private`: `<boolean>` **Default** 'true'. Is the resulting key private or public (when
  asymmetrical)
- Returns: `Promise<JWK.RSAKey>` &vert; `Promise<JWK.ECKey>` &vert; `Promise<JWK.OKPKey>` &vert; `Promise<JWK.OctKey>`

<details>
<summary><em><strong>Example</strong></em> (Click to expand)</summary>

```js
const { JWK: { generate } } = require('jose')
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

- `kty`: `<string>` Key type. Must be 'RSA', 'EC', 'OKP' or 'oct'.
- `crvOrSize`: `<number>` &vert; `<string>` key's bit size or in case of OKP and EC keys the curve.
  **Default:** 2048 for RSA, 'P-256' for EC, 'Ed25519' for OKP and 256 for oct.
- `options`: `<Object>`
  - `alg`: `<string>` Key Algorithm Parameter. It identifies the algorithm intended for use with the
    key.
  - `kid`: `<string>` Key ID Parameter. When not provided is computed using the method defined in
    [RFC7638][spec-thumbprint].
  - `use`: `<string>` Public Key Use Parameter. Indicates whether the key is to be used for
    encrypting & decrypting data or signing & verifying data. Must be 'sig' or 'enc'.
  - `key_ops`: `string[]` Key Operations Parameter. If set, the key can only be used for the
    specified operations. Supported values are 'sign', 'verify', 'encrypt', 'decrypt', 'wrapKey',
    'unwrapKey' and 'deriveKey'.
- `private`: `<boolean>` **Default** 'true'. Is the resulting key private or public (when
  asymmetrical)
- Returns: `<JWK.RSAKey>` &vert; `<JWK.ECKey>` &vert; `<JWK.OKPKey>` &vert; `<JWK.OctKey>`

<details>
<summary><em><strong>Example</strong></em> (Click to expand)</summary>

```js
const { JWK: { generateSync } } = require('jose')
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

#### `JWK.None`

`JWK.None` is a special key object that can be used with JWS/JWT sign and verify whenever you want
to opt-in for the `none` Unsecured JWS algorithm. Using this key fulfills the requirements given by
the [specification](https://tools.ietf.org/html/rfc7518#section-3.6), namely:

- Implementations MUST NOT accept Unsecured JWSs by default.
- Implementations that support Unsecured JWSs MUST NOT accept such objects as valid unless the
application specifies that it is acceptable for a specific object to not be integrity protected.

```js
const { JWK: { None, generateSync }, JWT, JWS } = require('jose')
const anActualKey = generateSync('RSA')

const signedJWT = JWT.sign({ sub: 'John Doe' }, anActualKey)
JWT.verify(signedJWT, None)
// Thrown:
// JWKKeySupport: the key does not support PS256 verify algorithm
//   name: 'JWKKeySupport',
//   code: 'ERR_JWK_KEY_SUPPORT'

const unsecuredJWT = JWT.sign({ sub: 'John Doe' }, None)
// eyJhbGciOiJub25lIn0.eyJzdWIiOiJKb2huIERvZSIsImlhdCI6MTU3OTc5NDM2Mn0.

JWT.verify(unsecuredJWT, anActualKey)
// Thrown:
// JWKKeySupport: the key does not support none verify algorithm
//   name: 'JWKKeySupport',
//   code: 'ERR_JWK_KEY_SUPPORT'

JWT.verify(unsecuredJWT, None)
// { sub: 'John Doe', iat: 1579794362 }

const unsecuredJWS = JWS.sign('foobar', None)
// eyJhbGciOiJub25lIn0.Zm9vYmFy.

JWS.verify(unsecuredJWS, anActualKey)
// Thrown:
// JWKKeySupport: the key does not support none verify algorithm
//   name: 'JWKKeySupport',
//   code: 'ERR_JWK_KEY_SUPPORT'

JWS.verify(unsecuredJWS, None)
// => verifies
```

---

#### `JWK.EmbeddedJWK`

`JWK.EmbeddedJWK` is a special key object that can be used with the JWS/JWT verify operations
whenever you want to opt-in to verify signatures with a public key embedded in the JWS Header `jwk`
parameter. It is recommended to combine this with the verify `algorithms` option to whitelist
JWS algorithms to accept as well as the `complete` option set to `true` if you need to work with the
instantiated `JWK.Key` from the token.

---

#### `JWK.EmbeddedX5C`

`JWK.EmbeddedX5C` is a special key object that can be used with the JWS/JWT verify operations
whenever you want to opt-in to verify signatures with a public key embedded in the first JWS Header
`x5c` parameter member. It is recommended to combine this with the verify `algorithms` option to whitelist
JWS algorithms to accept as well as the `complete` option set to `true` if you need to work with
the instantiated `JWK.Key` from the token. ⚠️ the x5c members are all validated to be certificates
but their chain or trust is not validated. Unfortunately Node.js does not have any good tools to do
that reliably.

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
  - [JWKS.asKeyStore(jwks[, options])](#jwksaskeystorejwks-options)
<!-- TOC JWKS END -->

```js
const { JWKS } = require('jose')
// { KeyStore: [Function: KeyStore] }
```

#### Class: `<JWKS.KeyStore>`

`JWKS.KeyStore` is an abstraction representing a set of JWKs, a keystore instance may be queried for
keys matching specific parameters. Keystores may be instantiated either populated, or empty and
there are lifecycle `keystore.remove()` and `keystore.add()` methods for adding/removing keys from
an existing store.

---

#### `new JWKS.KeyStore([keys])`

Creates a new KeyStore, either empty or populated.

- `keys`: `<JWK.Key[]>` Array of key keys instantiated by `JWK.asKey()`
- Returns: `<JWKS.KeyStore>`

---

#### `keystore.size`

Returns the number of keys in the keystore.

- `<number>`
---

#### `keystore.all([parameters])`

Retrieves an array of keys matching the provided parameters, returns all if none are provided. The
returned array is sorted by relevance based on the parameters. Keys with the exact algorithm or use
specified by the parameters are first.

- `parameters`: `<Object>`
  - `kty`: `<string>` Key Type to filter for.
  - `crv`: `<string>` Key Curve to filter for. (for EC and OKP keys)
  - `alg`: `<string>` Key supported algorithm to filter for.
  - `kid`: `<string>` Key ID to filter for.
  - `thumbprint`: `<string>` JWK Key thumbprint to filter for.
  - `use`: `<string>` Filter keys with the specified use defined. Keys missing "use" parameter will
    be matched but rank lower then ones with an exact match.
  - `key_ops`: `string[]` Filter keys with specified key_ops defined (if key_ops is defined on the
    key). Keys missing "key_ops" parameter will be matched but rank lower then ones with matching
    entries.
  - `x5t`: `<string>` Key X.509 Certificate SHA-1 Thumbprint to filter for.
  - `x5t#S256`: `<string>` Key X.509 Certificate SHA-256 Thumbprint to filter for.
- Returns: `<Key[]>` Array of key instances or an empty array when none are matching the parameters.

---

#### `keystore.get([parameters])`

Retrieves a single key matching the provided parameters. The most relevant Key based on the
parameters is returned.

- `parameters`: `<Object>`
  - `kty`: `<string>` Key Type to filter for.
  - `crv`: `<string>` Key Curve to filter for. (for EC and OKP keys)
  - `alg`: `<string>` Key supported algorithm to filter for.
  - `kid`: `<string>` Key ID to filter for.
  - `thumbprint`: `<string>` JWK Key thumbprint to filter for.
  - `use`: `<string>` Filter keys with the specified use defined. Keys missing "use" parameter will
    be matched but rank lower then ones with an exact match.
  - `key_ops`: `string[]` Filter keys with specified key_ops defined (if key_ops is defined on the
    key). Keys missing "key_ops" parameter will be matched but rank lower then ones with matching
    entries.
  - `x5t`: `<string>` Key X.509 Certificate SHA-1 Thumbprint to filter for.
  - `x5t#S256`: `<string>` Key X.509 Certificate SHA-256 Thumbprint to filter for.
- Returns: `<JWK.RSAKey>` &vert; `<JWK.ECKey>` &vert; `<JWK.OKPKey>` &vert; `<JWK.OctKey>` &vert; `undefined`

---

#### `keystore.add(key)`

Adds a key instance to the store unless it is already included.

- `key`: `<JWK.RSAKey>` &vert; `<JWK.ECKey>` &vert; `<JWK.OKPKey>` &vert; `<JWK.OctKey>`

---

#### `keystore.remove(key)`

Ensures a key is removed from a store.

- `key`: `<JWK.RSAKey>` &vert; `<JWK.ECKey>` &vert; `<JWK.OKPKey>` &vert; `<JWK.OctKey>`

---

#### `keystore.generate(...)`

Asynchronously generates new random key and automatically adds it to the store. See `JWK.generate()`
for the API.

---

#### `keystore.generateSync(...)`

Synchronous version of `keystore.generate()`.

---

#### `keystore.toJWKS([private])`

Exports the keystore to a JSON Web Key Set formatted object.

- `private`: `<boolean>` When true exports private keys with their private components. **Default:** 'false'
- Returns: `<Object>`

---

#### `JWKS.asKeyStore(jwks[, options])`

Creates a new KeyStore from a JSON Web Key Set.

- `jwks`: `<Object>` JWKS formatted object (`{ keys: [{ kty: '...', ... }, ...] }`)
- `options`: `<Object>`
  - `ignoreErrors`: `<boolean>` **Default** 'false'. This will make it so that keys
    unsupported by your Node.js runtime version (or otherwise faulty keys) get swallowed.
  - `calculateMissingRSAPrimes`: `<boolean>` **Default** 'false'. This option is really only in
    effect when the JWKS contains private RSA JWK keys, by default, keys without the optimization
    private key parameters (p, q, dp, dq, qi) won't be imported because their calculation is heavy and
    prone to blocking the process. Setting this option to true will enable these keys to be
    imported, albeit at your own risk. Depending on the key size the calculation takes long and it
    should only be used for JWKS from trusted sources.
- Returns: `<JWKS.KeyStore>`

<details>
<summary><em><strong>Example</strong></em> (Click to expand)</summary>

```js
const { JWKS: { KeyStore, asKeyStore } } = require('jose')
const jwks = {
  keys: [
    { kty: 'RSA',
      kid: 'gqUcZ2TjhmNrVOd1d27tedkabhOTs9WghMHIyjIBn7Y',
      e: 'AQAB',
      n:
      'vi1Aui6R0rUL_7pdcFKKMhBF25h4x8WiTZ4w66eNZhwIp48lz-vBuyUUrSR-RwcuvnxlXdjBdSaN-PZkNRDv2bXE3mVtjZgoYyzQlGLJ1wduQaBXIkrQWxc7yzL91MvtP1kWwFHHrQHZRlpiFQQm9gNCy2wXCTbWGT9kjrR1W1bkwhmOKK4rF-hMgaCNDrtEQ6xWknxV8aXW4itouJ0pJv8xplc6J14f_SNq6arVUcAZ26EzJYC2fcvqwsrnKzvW7QxQGQzh-u9Tn82Tl14Omh1KDV8C7Vb_m8XClv_9zOrKBGdaTl1zgINyMEaa_IMophnBgK_kAXvtVvEThQ93GQ',
      use: 'enc' }
  ]
}
const ks = asKeyStore(jwks)
// KeyStore {}
ks.size
// 1
ks instanceof KeyStore
// true
```
</details>

------

## JWT (JSON Web Token)

<!-- TOC JWT START -->
- [JWT.sign(payload, key[, options])](#jwtsignpayload-key-options)
- [JWT.verify(token, keyOrStore[, options])](#jwtverifytoken-keyorstore-options)
- [JWT.AccessToken.verify(token, keyOrStore, options)](#jwtaccesstokenverifytoken-keyorstore-options)
- [JWT.IdToken.verify(token, keyOrStore, options)](#jwtidtokenverifytoken-keyorstore-options)
- [JWT.LogoutToken.verify(token, keyOrStore, options)](#jwtlogouttokenverifytoken-keyorstore-options)
<!-- TOC JWT END -->

```js
const { JWT } = require('jose')
// { sign: [Function], verify: [Function] }
```

#### `JWT.sign(payload, key[, options])`

Serializes and signs the payload as JWT using the provided private or symmetrical key. The Algorithm
that will be used to sign with is either provided as part of the 'options.algorithm',
'options.header.alg' or inferred from the provided `<JWK.Key>` instance.

- `payload`: `<Object>` JWT Claims Set
- `key`: `<JWK.Key>` The key to sign with. Any `JWK.asKey()` compatible input also works.
  `<JWK.Key>` instances are recommended for performance purposes when re-using the same key for
  every operation.
- `options`: `<Object>`
  - `algorithm`: `<string>` The algorithm to use
  - `audience`: `<string>` &vert; `string[]` JWT Audience, "aud" claim value, if provided it will replace
    "aud" found in the payload
  - `expiresIn`: `<string>` JWT Expiration Time, "exp" claim value, specified as string which is
    added to the current unix epoch timestamp e.g. `24 hours`, `20 m`, `60s`, etc., if provided it
    will replace Expiration Time found in the payload
  - `header`: `<Object>` JWT Header object
  - `iat`: `<Boolean>` When true it pushes the "iat" to the JWT Header. **Default:** 'true'
  - `issuer`: `<string>` JWT Issuer, "iss" claim value, if provided it will replace "iss" found in
    the payload
  - `jti`: `<string>` JWT ID, "jti" claim value, if provided it will replace "jti" found in the
    payload
  - `kid`: `<Boolean>` When true it pushes the key's "kid" to the JWT Header. **Default:** 'true' for asymmetric keys, 'false' for symmetric keys.
  - `notBefore`: `<string>` JWT Not Before, "nbf" claim value, specified as string which is added to
    the current unix epoch timestamp e.g. `24 hours`, `20 m`, `60s`, etc., if provided it will
    replace Not Before found in the payload
  - `now`: `<Date>` Date object to be used instead of the current unix epoch timestamp.
    **Default:** 'new Date()'
  - `subject`: `<string>` JWT subject, "sub" claim value, if provided it will replace "sub" found in
    the payload
- Returns: `<string>`

<details>
<summary><em><strong>Example</strong></em> (Click to expand)</summary>

```js
const { JWT, JWK } = require('jose')
const key = JWK.asKey({
  kty: 'oct',
  k: 'hJtXIZ2uSN5kbQfbtTNWbpdmhkV8FJG-Onbc6mxCcYg'
})

const payload = {
  'urn:example:claim': 'foo'
}

const token = JWT.sign(payload, key, {
  audience: ['urn:example:client'],
  issuer: 'https://op.example.com',
  expiresIn: '2 hours',
  header: {
    typ: 'JWT'
  }
})
// eyJ0eXAiOiJKV1QiLCJraWQiOiJSdG9SdXJfMURpcjVNNHd1T2ZxTmtEWU9mOU9fNFJKLWFIa1RBNzVSTEE4IiwiYWxnIjoiSFMyNTYifQ.eyJ1cm46ZXhhbXBsZTpjbGFpbSI6ImZvbyIsImF1ZCI6WyJ1cm46ZXhhbXBsZTpjbGllbnQiXSwiaXNzIjoiaHR0cHM6Ly9vcC5leGFtcGxlLmNvbSIsImlhdCI6MTU1MTI5NDEzNywiZXhwIjoxNTUxMzAxMzM3fQ.YmtApwaGRBWlL9O8avbmpYcJ5UwNy0R8rpbxZqHxNd4
```
</details>

---

#### `JWT.verify(token, keyOrStore[, options])`

Verifies the claims and signature of a JSON Web Token.

- `token`: `<String>` JSON Web Token to verify
- `keyOrStore`: `<JWK.Key>` &vert; `<JWKS.KeyStore>` The key or store to verify with. When
  `<JWKS.KeyStore>` instance is provided a selection of possible candidate keys will be done and the
  operation will succeed if just one key matches. Any `JWK.asKey()` compatible input also works.
  `<JWK.Key>` instances are recommended for performance purposes when re-using the same key for
  every operation.
- `options`: `<Object>`
  - `algorithms`: `string[]` Array of expected signing algorithms. JWT signed with an algorithm not
    found in this option will be rejected. **Default:** accepts all algorithms available on the
    passed key (or keys in the keystore)
  - `audience`: `<string>` &vert; `string[]` Expected audience value(s). When string an exact match must
    be found in the payload, when array at least one must be matched.
  - `typ`: `<string>` Expected JWT "typ" Header Parameter value. An exact match must be found in the
    JWT header. **Default:** 'undefined' unless a `profile` with a specific value is used, in which
    case this option will be ignored.
  - `clockTolerance`: `<string>` Clock Tolerance for comparing timestamps, provided as timespan
    string e.g. `120s`, `2 minutes`, etc. **Default:** no clock tolerance
  - `complete`: `<Boolean>` When false only the parsed payload is returned, otherwise an object with
    a parsed header, payload, the key that verified and the base64url encoded signature will be
    returned
    **Default:** 'false'
  - `crit`: `string[]` Array of Critical Header Parameter names to recognize. **Default:** '[]'
  - `ignoreExp`: `<Boolean>` When true will not be validating the "exp" claim value to be in the
    future from now. **Default:** 'false'
  - `ignoreIat`: `<Boolean>` When true will not be validating the "iat" claim value to be in the
    past from now if expiration is not present. **Default:** 'false'
  - `ignoreNbf`: `<Boolean>` When true will not be validating the "nbf" claim value to be in the
    past from now. **Default:** 'false'
  - `issuer`: `<string>` &vert; `string[]` Expected issuer value(s). When string an exact match must
    be found in the payload, when array at least one must be matched.
  - `jti`: `<string>` Expected jti value. An exact match must be found in the payload.
  - `maxTokenAge`: `<string>` When provided the payload is checked to have the "iat" claim and its
    value is validated not to be older than the provided timespan string e.g. `30m`, `24 hours`.
    Do not confuse with maxAuthAge option.
  - `now`: `<Date>` Date object to be used instead of the current unix epoch timestamp.
    **Default:** 'new Date()'
  - `subject`: `<string>` Expected subject value. An exact match must be found in the payload.
- Returns: `<Object>`

<details>
<summary><em><strong>Example</strong></em> (Click to expand)</summary>

```js
const { JWK, JWT } = require('jose')

const key = JWK.asKey({
  kty: 'oct',
  k: 'hJtXIZ2uSN5kbQfbtTNWbpdmhkV8FJG-Onbc6mxCcYg'
})

const token = 'eyJ0eXAiOiJKV1QiLCJraWQiOiJSdG9SdXJfMURpcjVNNHd1T2ZxTmtEWU9mOU9fNFJKLWFIa1RBNzVSTEE4IiwiYWxnIjoiSFMyNTYifQ.eyJ1cm46ZXhhbXBsZTpjbGFpbSI6ImZvbyIsImF1ZCI6WyJ1cm46ZXhhbXBsZTpjbGllbnQiXSwiaXNzIjoiaHR0cHM6Ly9vcC5leGFtcGxlLmNvbSIsImlhdCI6MTU1MTI5NDEzNywiZXhwIjoxNTUxMzAxMzM3fQ.YmtApwaGRBWlL9O8avbmpYcJ5UwNy0R8rpbxZqHxNd4'

JWT.verify(token, key, {
  audience: 'urn:example:client',
  issuer: 'https://op.example.com',
  clockTolerance: '1 min'
})
```
</details>

<details>
<summary><em></em>Need to peak into a JWT without verifying it? (Click to expand)</summary>

#### `JWT.decode(token[, options])`

Decodes the JWT payload and optionally the header. Does not perform any claim validations what so
ever and also, clearly, **does not verify the token.** For JWT Verification use
[`JWT.verify`](#jwtverifytoken-keyorstore-options)

- `token`: `<String>` JSON Web Token to decode
- `options`: `<Object>`
  - `complete`: `<Boolean>` When false only the parsed payload is returned, otherwise an object with
    a parsed header, payload and the base64url encoded signature will be returned **Default:** 'false'
- Returns: `<Object>`

```js
const { JWT } = require('jose')

const token = 'eyJ0eXAiOiJKV1QiLCJraWQiOiJSdG9SdXJfMURpcjVNNHd1T2ZxTmtEWU9mOU9fNFJKLWFIa1RBNzVSTEE4IiwiYWxnIjoiSFMyNTYifQ.eyJ1cm46ZXhhbXBsZTpjbGFpbSI6ImZvbyIsImF1ZCI6WyJ1cm46ZXhhbXBsZTpjbGllbnQiXSwiaXNzIjoiaHR0cHM6Ly9vcC5leGFtcGxlLmNvbSIsImlhdCI6MTU1MTI5NDEzNywiZXhwIjoxNTUxMzAxMzM3fQ.YmtApwaGRBWlL9O8avbmpYcJ5UwNy0R8rpbxZqHxNd4'

JWT.decode(token)
// { 'urn:example:claim': 'foo',
//   aud: [ 'urn:example:client' ],
//   iss: 'https://op.example.com',
//   iat: 1551294137,
//   exp: 1551301337 }
JWT.decode(token, { complete: true })
// { header:
//    { typ: 'JWT',
//      kid: 'RtoRur_1Dir5M4wuOfqNkDYOf9O_4RJ-aHkTA75RLA8',
//      alg: 'HS256' },
//   payload:
//    { 'urn:example:claim': 'foo',
//      aud: [ 'urn:example:client' ],
//      iss: 'https://op.example.com',
//      iat: 1551294137,
//      exp: 1551301337 },
//   signature: 'YmtApwaGRBWlL9O8avbmpYcJ5UwNy0R8rpbxZqHxNd4' }
```
</details>

---

#### `JWT.AccessToken.verify(token, keyOrStore, options])`

A shorthand for [`JWT.verify`](#jwtverifytoken-keyorstore-options) with additional constraints and options
to verify an Access Token according to 
[JWT Profile for OAuth 2.0 Access Tokens](https://tools.ietf.org/html/draft-ietf-oauth-access-token-jwt-06).
This is an IETF **draft** implementation. Breaking draft implementations are included as minor versions of
the jose library, therefore, the ~ semver operator should be used and close attention be payed to library 
changelog as well as the drafts themselves.

The function arguments are the same as for [`JWT.verify`](#jwtverifytoken-keyorstore-options), only difference
is that `issuer` and `audience` options are required and the additional option:

- see [`JWT.verify`](#jwtverifytoken-keyorstore-options)
- `issuer`: `<string>` REQUIRED
- `audience`: `<string>` REQUIRED
- `maxAuthAge`: `<string>` When provided the payload is checked to have the "auth_time" claim and
  its value is validated, provided as timespan string e.g. `30m`, `24 hours`. See
  [OpenID Connect Core 1.0][connect-core] for details. Do not confuse with maxTokenAge option.

<details>
<summary><em><strong>Example</strong></em> (Click to expand)</summary>

```js
jose.JWT.AccessToken.verify(
  'eyJhbGciOiJQUzI1NiIsInR5cCI6ImF0K0pXVCIsImtpZCI6InIxTGtiQm8zOTI1UmIyWkZGckt5VTNNVmV4OVQyODE3S3gwdmJpNmlfS2MifQ.eyJzdWIiOiJmb28iLCJjbGllbnRfaWQiOiJ1cm46ZXhhbXBsZTpjbGllbnRfaWQiLCJhdWQiOiJ1cm46ZXhhbXBsZTpyZXNvdXJjZS1zZXJ2ZXIiLCJleHAiOjE1NjM4ODg4MzAsImlzcyI6Imh0dHBzOi8vb3AuZXhhbXBsZS5jb20iLCJzY29wZSI6ImFwaTpyZWFkIn0.UYy8vEGWS0cS24giCYobMMy9-bqI45p807yV1l-2WXX2J4UO-eohV_R58LE2oM88gl414c6XydO6QSYXul5roNPoOs41jpEvreQIP-HmegjbWGutktWJKfvoOblE5FjYwjrwStjLQGUzkq6KWcnDLPGmpFy7n6gZ4LF8YVz4dLEaO335hMNVNrmSPSXYqr7bAWybnLVpLxjDYwNfCO1g0_TlFx8fHh2OftHoOOmJFltFwb8JypkSB-JXVVSEh43IOEjeeMJIG_ylWIOxfLLi5Q7vPWgub83ZTkuGNe4KmlQJKIsH5k0yZSshsLYUOOH0RiXqQ-SA4Ubh3Fowigdu-g',
  keyOrStore,
  {
    issuer: 'https://op.example.com',
    audience: 'urn:example:resource-server',
    algorithms: ['PS256']
  }
)
```
</details>

---

#### `JWT.IdToken.verify(token, keyOrStore, options])`

A shorthand for [`JWT.verify`](#jwtverifytoken-keyorstore-options) with the `profile` option set to `id_token`.

The function arguments are the same as for [`JWT.verify`](#jwtverifytoken-keyorstore-options), only difference
is that `issuer` and `audience` options are required and the additional options:

- see [`JWT.verify`](#jwtverifytoken-keyorstore-options)
- `issuer`: `<string>` REQUIRED
- `audience`: `<string>` REQUIRED
- `maxAuthAge`: `<string>` When provided the payload is checked to have the "auth_time" claim and
  its value is validated, provided as timespan string e.g. `30m`, `24 hours`. See
  [OpenID Connect Core 1.0][connect-core] for details. Do not confuse with maxTokenAge option.
- `nonce`: `<string>` Expected nonce value. An exact match must be found in the payload. See
  [OpenID Connect Core 1.0][connect-core] for details.

<details>
<summary><em><strong>Example</strong></em> (Click to expand)</summary>

```js
jose.JWT.IdToken.verify(
  'eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InIxTGtiQm8zOTI1UmIyWkZGckt5VTNNVmV4OVQyODE3S3gwdmJpNmlfS2MifQ.eyJzdWIiOiJmb28iLCJub25jZSI6ImE1MWNjZjA4ZjRiYmIwNmU4ODcxNWRkYzRiYmI0MWQ4IiwiYXVkIjoidXJuOmV4YW1wbGU6Y2xpZW50X2lkIiwiZXhwIjoxNTYzODg4ODMwLCJpYXQiOjE1NjM4ODUyMzAsImlzcyI6Imh0dHBzOi8vb3AuZXhhbXBsZS5jb20ifQ.RKCZczgICF5G9XdNDSwe4dolGauQHptpFKPzahA2wYGG2HKrKhyC8ZzqpeVc8cbntuqFBgABJVv6_9YICRx_dgwPYydTpZfZYjHnxrdWF9QsIPEGs672mrnhqIXUnXoseZ0TF6GOq6P7Qbf6gk1ru7TAbr_ieyJnNWcJhh5iHpz1k3mFz0TyTh7UNXshtQXftPUipqz4OBni5r9UaZXHw8B3QYOnms8__GJ3owOxaqkr1jgRs_EWqMlBNjPaj7ElVaeBWljDKuoK673tH0heSpgzUmUX_W8IDUVqs33uglpZwAQC7cAA5mGEg2odcRpvpP5M-WaP4RE9dl9jzcYmrw',
  keyOrStore,
  {
    issuer: 'https://op.example.com',
    audience: 'urn:example:client_id',
    nonce: 'a51ccf08f4bbb06e88715ddc4bbb41d8',
    algorithms: ['PS256']
  }
)
```
</details>

---

#### `JWT.LogoutToken.verify(token, keyOrStore, options])`

A shorthand for [`JWT.verify`](#jwtverifytoken-keyorstore-options) with the `profile` option set to `logout_token`.
This is an OIDF **draft** implementation. Breaking draft implementations are included as minor versions of
the jose library, therefore, the ~ semver operator should be used and close attention be payed to library 
changelog as well as the drafts themselves.

The function arguments are the same as for [`JWT.verify`](#jwtverifytoken-keyorstore-options), only difference
is that `issuer` and `audience` options are required.

- see [`JWT.verify`](#jwtverifytoken-keyorstore-options)
- `issuer`: `<string>` REQUIRED
- `audience`: `<string>` REQUIRED

<details>
<summary><em><strong>Example</strong></em> (Click to expand)</summary>

```js
jose.JWT.LogoutToken.verify(
  'eyJhbGciOiJQUzI1NiJ9.eyJzdWIiOiJmb28iLCJhdWQiOiJ1cm46ZXhhbXBsZTpjbGllbnRfaWQiLCJpYXQiOjE1NjM4ODg4MzAsImp0aSI6ImhqazMyN2RzYSIsImlzcyI6Imh0dHBzOi8vb3AuZXhhbXBsZS5jb20iLCJldmVudHMiOnsiaHR0cDovL3NjaGVtYXMub3BlbmlkLm5ldC9ldmVudC9iYWNrY2hhbm5lbC1sb2dvdXQiOnt9fX0.SBi7uNUvjHL9TFoFzautGgTQ1MjyeGUNYHL7inpgq3XgTv6xc9EAKuPRtpixmhdNhmInGwUvAeqDSJxomwv1KK1cTndrC9zAMZ7h657BGQAwGhu7nTm41fWMpKQdiLa9sqp3yit5_FNBmqUNeOoMPrYT_Vl9ytsoNO89MUQy2aqCd-Z7BrNJZH0QycdW6dmYlrmZL7w3t3TaAXoJDJ4Hgl2Itkkkb6_6gO-VoPIdVD8sDuf1zQzGhIkmcFrk0fXczVYOkeF2hNYBuvsM8LuO-EPA3oyE2In9djai3M7yceTQetRa1vwlqWkg_xmYS59ry-6wT44aN7-Y6p0TdXm-Zg',
  keyOrStore,
  {
    issuer: 'https://op.example.com',
    audience: 'urn:example:client_id',
    algorithms: ['PS256']
  }
)
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
const { JWS } = require('jose')
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
const { JWK, JWS } = require('jose')

const key = JWK.asKey({
  kty: 'oct',
  k: 'hJtXIZ2uSN5kbQfbtTNWbpdmhkV8FJG-Onbc6mxCcYg'
})
const key2 = JWK.asKey({
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

- `payload`: `<Object>` &vert; `<string>` &vert; `<Buffer>` The payload that will be signed. When `<Object>`
  it will be automatically serialized to JSON before signing
- Returns: `<JWS.Sign>`

---

#### `sign.recipient(key[, protected[, header]])`

Adds a recipient to the JWS, the Algorithm that will be used to sign with is either provided as part
of the Protected or Unprotected Header or inferred from the provided `<JWK.Key>` instance.

- `key`: `<JWK.Key>` The key to sign with. Any `JWK.asKey()` compatible input also works.
  `<JWK.Key>` instances are recommended for performance purposes when re-using the same key for
  every operation.
- `protected`: `<Object>` Protected Header for this recipient
- `header`: `<Object>` Unprotected Header for this recipient

---

#### `sign.sign(serialization)`

Performs the signing operations for each registered recipient and returns the final JWS
representation in the serialization requested. The JWS is validated for conformance during this
step. Please note that only 'general' and 'flattened' serialization supports Unprotected
Per-Recipient Header and only the 'general' serialization supports multiple recipients. See
`<JWS.sign>` and `<JWS.sign.flattened>` for shorthand methods to sign for a single recipient.

- `serialization`: `<string>` JWS Serialization. Must be one of 'general', 'flattened', 'compact'
- Returns: `<string>` &vert; `<Object>`

---

#### `JWS.sign(payload, key[, protected])`

Performs the signing operation and 'compact' JWS serialization of the result. The Algorithm that
will be used to sign with is either provided as part of the Protected Header or inferred from the
provided `<JWK.Key>` instance.

- `payload`: `<Object>` &vert; `<string>` &vert; `<Buffer>` The payload that will be signed. When `<Object>`
  it will be automatically serialized to JSON before signing
- `key`: `<JWK.Key>` The key to sign with. Any `JWK.asKey()` compatible input also works.
  `<JWK.Key>` instances are recommended for performance purposes when re-using the same key for
  every operation.
- `protected`: `<Object>` Protected Header
- Returns: `<string>`

<details>
<summary><em><strong>Example</strong></em> (Click to expand)</summary>

```js
const { JWK, JWS } = require('jose')

const key = JWK.asKey({
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
will be used to sign with is either provided as part of the Protected or Unprotected Header or
inferred from the provided `<JWK.Key>` instance.

- `payload`: `<Object>` &vert; `<string>` &vert; `<Buffer>` The payload that will be signed. When `<Object>`
  it will be automatically serialized to JSON before signing
- `key`: `<JWK.Key>` The key to sign with. Any `JWK.asKey()` compatible input also works.
  `<JWK.Key>` instances are recommended for performance purposes when re-using the same key for
  every operation.
- `protected`: `<Object>` Protected Header
- `header`: `<Object>` Unprotected Header
- Returns: `<Object>`

<details>
<summary><em><strong>Example</strong></em> (Click to expand)</summary>

```js
const { JWK, JWS } = require('jose')

const key = JWK.asKey({
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

- `jws`: `<Object>` &vert; `<string>` The JWS to verify. This must be a valid JWS.
- `keyOrStore`: `<JWK.Key>` &vert; `<JWKS.KeyStore>` The key or store to verify with. When
  `<JWKS.KeyStore>` instance is provided a selection of possible candidate keys will be done and the
  operation will succeed if just one key or signature (in case of General JWS JSON Serialization
  Syntax) matches. Any `JWK.asKey()` compatible input also works. `<JWK.Key>` instances are
  recommended for performance purposes when re-using the same key for every operation.
- `options`: `<Object>`
  - `algorithms`: `string[]` Array of Algorithms to accept, when the signature does not use an
    algorithm from this list the verification will fail. **Default:** 'undefined' - accepts all
    algorithms available on the keys
  - `complete`: `<boolean>` When true returns a complete object with the parsed headers and payload
    instead of only the verified payload. **Default:** 'false'
  - `crit`: `string[]` Array of Critical Header Parameter names to recognize. **Default:** '[]'
- Returns: `<Buffer>`

<details>
<summary><em><strong>Example</strong></em> (Click to expand)</summary>

```js
const { JWK, JWS, JWKS } = require('jose')

const key = JWK.asKey({
  kty: 'oct',
  k: 'hJtXIZ2uSN5kbQfbtTNWbpdmhkV8FJG-Onbc6mxCcYg'
})
const key2 = JWK.asKey({
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
// <Buffer ...>

JWS.verify(flattened, key2)
// Thrown:
// JWSVerificationFailed: signature verification failed

JWS.verify(compact, key, { complete: true })
// { payload: <Buffer ...>, protected: { alg: 'HS256' }, key: OctKey {} }

JWS.verify(flattened, key, { algorithms: ['PS256'] })
// JOSEAlgNotWhitelisted: alg not whitelisted

JWS.verify(general, key)
// <Buffer ...>
JWS.verify(general, key2)
// <Buffer ...>

JWS.verify(general, key, { complete: true })
// { payload: <Buffer ...>,
//   protected: { alg: 'HS256' },
//   header: { foo: 'bar' },
//   key: : OctKey {} } <- key
JWS.verify(general, key2, { complete: true })
// { payload: <Buffer ...>,
//   protected: { alg: 'HS512' },
//   header: { foo: 'baz' },
//   key: : OctKey {} } <- key2
const keystore = new JWKS.KeyStore(key)
JWS.verify(general, keystore, { complete: true })
// { payload: <Buffer ...>,
//   protected: { alg: 'HS256' },
//   header: { foo: 'bar' },
//   key: : OctKey {} } <- key that matched in the keystore
```
</details>

---

## JWE (JSON Web Encryption)

<!-- TOC JWE START -->
- [Class: &lt;JWE.Encrypt&gt;](#class-jweencrypt)
  - [new JWE.Encrypt(cleartext[, protected[, aad[, unprotected]]])](#new-jweencryptcleartext-protected-aad-unprotected)
  - [encrypt.recipient(key[, header])](#encryptrecipientkey-header)
  - [encrypt.encrypt(serialization)](#encryptencryptserialization)
- [JWE.encrypt(cleartext, key[, protected])](#jweencryptcleartext-key-protected)
- [JWE.encrypt.flattened(cleartext, key[, protected[, aad[, unprotected]]])](#jweencryptflattenedcleartext-key-protected-aad-unprotected)
- [JWE.decrypt(jwe, keyOrStore[, options])](#jwedecryptjwe-keyorstore-options)
<!-- TOC JWE END -->

The `<JWE>` module provides methods required to encrypt or decrypt JSON Web Encryptions in either
one of the defined serializations.

```js
const { JWE } = require('jose')
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

#### `new JWE.Encrypt(cleartext[, protected[, aad[, unprotected]]])`

Creates a new Encrypt object for the provided cleartext with optional Protected and Unprotected
Headers and Additional Authenticated Data.

- `cleartext`: `<string>` &vert; `<Buffer>` The cleartext that will be encrypted.
- `protected`: `<Object>` JWE Protected Header
- `aad`: `<string>` &vert; `<Buffer>` JWE Additional Authenticated Data
- `unprotected`: `<Object>` JWE Shared Unprotected Header
- Returns: `<JWE.Encrypt>`

---

#### `encrypt.recipient(key[, header])`

Adds a recipient to the JWE, the Algorithm that will be used to wrap or derive the Content
Encryption Key (CEK) is either provided as part of the combined JWE Header for the recipient or
inferred from the provided `<JWK.Key>` instance.

- `key`: `<JWK.Key>` The key to use for Key Management or Direct Encryption. Any `JWK.asKey()`
  compatible input also works. `<JWK.Key>` instances are recommended for performance purposes when
  re-using the same key for every operation.
- `header`: `<Object>` JWE Per-Recipient Unprotected Header

---

#### `encrypt.encrypt(serialization)`

Performs the encryption operations for each registered recipient and returns the final JWE
representation in the serialization requested. The JWE is validated for conformance during this
step. Please note that only 'general' and 'flattened' serialization supports Unprotected
Per-Recipient Header and AAD and only the 'general' serialization supports multiple recipients. See
`<JWE.encrypt>` and `<JWE.encrypt.flattened>` for shorthand methods to encrypt for a single
recipient.

- `serialization`: `<string>` JWE Serialization. Must be one of 'general', 'flattened', 'compact'
- Returns: `<string>` &vert; `<Object>`

---

#### `JWE.encrypt(cleartext, key[, protected])`

Performs the encryption operation and 'compact' JWE serialization of the result. The Algorithm that
will be used to wrap or derive the Content Encryption Key (CEK) is either provided as part of the
Protected Header or inferred from the provided `<JWK.Key>` instance.

- `cleartext`: `<string>` &vert; `<Buffer>` The cleartext that will be encrypted.
- `key`: `<JWK.Key>` The key to use for Key Management or Direct Encryption. Any `JWK.asKey()`
  compatible input also works. `<JWK.Key>` instances are recommended for performance purposes when
  re-using the same key for every operation.
- `protected`: `<Object>` JWE Protected Header
- Returns: `<string>`

---

#### `JWE.encrypt.flattened(cleartext, key[, protected[, aad[, unprotected]]])`

Performs the encryption operation and 'flattened' JWE serialization of the result. The Algorithm
that will be used to wrap or derive the Content Encryption Key (CEK) is either provided as part of
the combined JWE Header or inferred from the provided `<JWK.Key>` instance.

- `cleartext`: `<string>` &vert; `<Buffer>` The cleartext that will be encrypted.
- `key`: `<JWK.Key>` The key to use for Key Management or Direct Encryption. Any `JWK.asKey()`
  compatible input also works. `<JWK.Key>` instances are recommended for performance purposes when
  re-using the same key for every operation.
- `protected`: `<Object>` JWE Protected Header
- `aad`: `<string>` &vert; `<Buffer>` JWE Additional Authenticated Data
- `unprotected`: `<Object>` JWE Shared Unprotected Header
- Returns: `<Object>`

---

#### `JWE.decrypt(jwe, keyOrStore[, options])`

Decrypts the provided JWE in either serialization with a given `<JWK.Key>` or `<JWKS.KeyStore>`

Note: This performs only the authenticated decryption, it does not process the resulting cleartext
in any way. If the resulting cleartext is a signed JWS/JWT, you must run it through a JWS/JWT verify
operation.

- `jwe`: `<Object>` &vert; `<string>` The JWE to decrypt. This must be a valid JWE.
- `keyOrStore`: `<JWK.Key>` &vert; `<JWKS.KeyStore>` The key or store to decrypt with. When
  `<JWKS.KeyStore>` instance is provided a selection of possible candidate keys will be done and the
  operation will succeed if just one key or signature (in case of General JWE JSON Serialization
  Syntax) matches. Any `JWK.asKey()` compatible input also works. `<JWK.Key>` instances are
  recommended for performance purposes when re-using the same key for every operation.
- `options`: `<Object>`
  - `contentEncryptionAlgorithms`: `string[]` Array of algorithms to accept as the `enc` (content 
    encryption), when the JWE does not use an Key Management algorithm from this list the decryption 
    will fail.  **Default:** 'undefined' - accepts all content encryption algorithms.
  - `keyManagementAlgorithms`: `string[]` Array of algorithms to accept as the `alg` (key management),
    when the JWE does not use an Key Management algorithm from this list the decryption will fail. 
    **Default:** 'undefined' - accepts all algorithms available on the key or key store.
  - `maxPBES2Count`: `number` (PBES2 Key Management Algorithms only) Maximum allowed "p2c" (PBES2
    Count) Header Parameter value. The PBKDF2 iteration count defines the algorithm's computational
    expense.
    **Default:** '10000'
  - `complete`: `<boolean>` When true returns an object with the parsed headers, verified
    AAD, the content encryption key, the key that was used to unwrap or derive the content
    encryption key, and cleartext instead of only the cleartext.
    **Default:** 'false'
- Returns: `<Buffer>` &vert; `<Object>`

---

## Errors

<!-- TOC Errors START -->
- [Class: &lt;TypeError&gt;](#class-typeerror)
- [Class: &lt;JOSEError&gt;](#class-joseerror)
- [Class: &lt;JOSEAlgNotWhitelisted&gt;](#class-josealgnotwhitelisted)
- [Class: &lt;JOSECritNotUnderstood&gt;](#class-josecritnotunderstood)
- [Class: &lt;JOSEMultiError&gt;](#class-josemultierror)
- [Class: &lt;JOSEInvalidEncoding&gt;](#class-joseinvalidencoding)
- [Class: &lt;JOSENotSupported&gt;](#class-josenotsupported)
- [Class: &lt;JWEDecryptionFailed&gt;](#class-jwedecryptionfailed)
- [Class: &lt;JWEInvalid&gt;](#class-jweinvalid)
- [Class: &lt;JWKImportFailed&gt;](#class-jwkimportfailed)
- [Class: &lt;JWKKeyInvalid&gt;](#class-jwkkeyinvalid)
- [Class: &lt;JWKKeySupport&gt;](#class-jwkkeysupport)
- [Class: &lt;JWKSNoMatchingKey&gt;](#class-jwksnomatchingkey)
- [Class: &lt;JWSInvalid&gt;](#class-jwsinvalid)
- [Class: &lt;JWSVerificationFailed&gt;](#class-jwsverificationfailed)
- [Class: &lt;JWTClaimInvalid&gt;](#class-jwtclaiminvalid)
- [Class: &lt;JWTExpired&gt;](#class-jwtexpired)
- [Class: &lt;JWTMalformed&gt;](#class-jwtmalformed)
<!-- TOC Errors END -->


The following errors are expected to be thrown by `jose` runtime and have their prototypes
exported in `jose.errors`. If you encounter an `Error` other then `TypeError` or one that's
`instanceof jose.errors.JOSEError` please report it, it is not intended.

#### Class: `TypeError`

Thrown when unexpected argument types or their format is encountered. This is the standard built-in
[`TypeError`](https://nodejs.org/api/errors.html#errors_class_typeerror).

#### Class: `JOSEError`

Base Error the others inherit from.

#### Class: `JOSEAlgNotWhitelisted`

Thrown when an algorithm whitelist is provided but the validated JWE/JWS does not use one from it.

```js
if (err instanceof jose.errors.JOSEError && err.code === 'ERR_JOSE_ALG_NOT_WHITELISTED') {
  // ...
}
```

#### Class: `JOSECritNotUnderstood`

Thrown when a Critical member is encountered that's not acknowledged. The only built in "crit"
handler is for "b64", it must still be acknowledged though.

```js
if (err instanceof jose.errors.JOSEError && err.code === 'ERR_JOSE_CRIT_NOT_UNDERSTOOD') {
  // ...
}
```

#### Class: `JOSEMultiError`

This error is thrown when

- multi-recipient JWE decryption fails for each recipient with errors other than `JWEDecryptionFailed (ERR_JWE_DECRYPTION_FAILED)`
- multi-recipient JWS verification fails for each recipient with errors other than `JWSVerificationFailed (ERR_JWS_VERIFICATION_FAILED)`
- KeyStore instance is passed to JWT/JWS verify, there are multiple usable keys and all of them fail with errors other than `JWSVerificationFailed (ERR_JWS_VERIFICATION_FAILED)`
- KeyStore instance is passed to JWE decrypt, there are multiple usable keys and all of them fail with errors other than `JWEDecryptionFailed (ERR_JWE_DECRYPTION_FAILED)`

The error is an [Iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#Iterables)
and yields every single one of the encountered errors.

```js
if (err instanceof jose.errors.JOSEError && err.code === 'ERR_JOSE_MULTIPLE_ERRORS') {
  for (const e of err) {
    console.log(e)
    // ...
  }
}
```

#### Class: `JOSEInvalidEncoding`

Thrown when invalid base64url encoding is detected.

```js
if (err instanceof jose.errors.JOSEError && err.code === 'ERR_JOSE_INVALID_ENCODING') {
  // ...
}
```

#### Class: `JOSENotSupported`

Thrown when an unsupported "alg", "kty" or specific header value like "zip" is encountered.

```js
if (err instanceof jose.errors.JOSEError && err.code === 'ERR_JOSE_NOT_SUPPORTED') {
  // ...
}
```

#### Class: `JWEDecryptionFailed`

Thrown when JWE decrypt operations are started but fail to decrypt. Only generic error message is
provided.

```js
if (err instanceof jose.errors.JOSEError && err.code === 'ERR_JWE_DECRYPTION_FAILED') {
  // ...
}
```

#### Class: `JWEInvalid`

Thrown when syntactically incorrect JWE is either requested to be encrypted or decrypted

```js
if (err instanceof jose.errors.JOSEError && err.code === 'ERR_JWE_INVALID') {
  // ...
}
```

#### Class: `JWKImportFailed`

Thrown when a key failed to import as `<JWK.Key>`

```js
if (err instanceof jose.errors.JOSEError && err.code === 'ERR_JWK_IMPORT_FAILED') {
  // ...
}
```

#### Class: `JWKKeyInvalid`

Thrown when key's parameters are invalid, e.g. key_ops and use values are inconsistent.

```js
if (err instanceof jose.errors.JOSEError && err.code === 'ERR_JWK_INVALID') {
  // ...
}
```

#### Class: `JWKKeySupport`

Thrown when a key does not support the request algorithm.

```js
if (err instanceof jose.errors.JOSEError && err.code === 'ERR_JWK_KEY_SUPPORT') {
  // ...
}
```

#### Class: `JWKSNoMatchingKey`

Thrown when `<JWKS.KeyStore>` is used as argument for decrypt / verify operation and no usable key
for the crypto operation is found in it

```js
if (err instanceof jose.errors.JOSEError && err.code === 'ERR_JWKS_NO_MATCHING_KEY') {
  // ...
}
```

#### Class: `JWSInvalid`

Thrown when syntactically incorrect JWS is either requested to be signed or
  verified

```js
if (err instanceof jose.errors.JOSEError && err.code === 'ERR_JWS_INVALID') {
  // ...
}
```

#### Class: `JWSVerificationFailed`

Thrown when JWS verify operations are started but fail to verify. Only generic error message is
provided.

```js
if (err instanceof jose.errors.JOSEError && err.code === 'ERR_JWS_VERIFICATION_FAILED') {
  // ...
}
```

#### Class: `JWTClaimInvalid`

Thrown when JWT Claim is either of incorrect type or fails to validate by the provided options.
Instances of `<JWTClaimInvalid>` have a `claim<string>` property with the name of the claim as well as
`reason<string>` property with one of the following values `'prohibited' | 'missing' | 'invalid' | 'check_failed' | 'unspecified'`.

```js
if (err instanceof jose.errors.JOSEError && err.code === 'ERR_JWT_CLAIM_INVALID') {
  // ...
}
```

#### Class: `JWTExpired`

Thrown when the JWT Claims indicate the JWT is expired by the provided options. `<JWTExpired>`
is a descendant of `<JWTClaimInvalid>` with a unique `code` property.

```js
if (err instanceof jose.errors.JOSEError && err.code === 'ERR_JWT_EXPIRED') {
  // ...
}
```

#### Class: `JWTMalformed`

Thrown when malformed JWT is either being verified.

```js
if (err instanceof jose.errors.JOSEError && err.code === 'ERR_JWT_MALFORMED') {
  // ...
}
```


[spec-thumbprint]: https://tools.ietf.org/html/rfc7638
[support-sponsor]: https://github.com/sponsors/panva
[connect-core]: https://openid.net/specs/openid-connect-core-1_0.html
