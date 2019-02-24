# @panva/jose

[![build][travis-image]][travis-url] [![codecov][codecov-image]][codecov-url]

"JSON Web Almost Everything" - JWA, JWS, JWE, JWK, JWKS for Node.js with minimal dependencies

See the [`@panva/jwt`](https://github.com/panva/jwt) package for JWT.

**Table of Contents**

- [Implemented specs & features](#implemented-specs--features)
- [Usage](#usage)

## Implemented specs & features

The following specifications are implemented by @panva/jose

- [RFC7515 - JSON Web Signature (JWS)][spec-jws]
- [RFC7516 - JSON Web Encryption (JWE)][spec-jwe]
- [RFC7517 - JSON Web Key (JWK)][spec-jwk]
- [RFC7518 - JSON Web Algorithms (JWA)][spec-jwa]
- [RFC7638 - JSON Web Key (JWK) Thumbprint][spec-thumbprint]
- [RFC7797 - JWS Unencoded Payload Option][spec-b64]

The test suite utilizes examples defined in [RFC7520][spec-cookbook] to confirm its JOSE
implementation is correct.

<details>
  <summary><em><strong>Detailed feature matrix</strong></em> (Click to expand)</summary><br>

Legend:
- **✓** Implemented
- **✕** Missing node crypto support / won't implement / not planned / PR welcome

| JWK Key Types | Supported ||
| -- | -- | -- |
| RSA | ✓ | RSA |
| Elliptic Curve | ✓ | EC |
| Octet sequence | ✓ | oct |

| Serialization | JWS Sign | JWS Verify | JWE Encrypt | JWE Decrypt |
| -- | -- | -- | -- | -- |
| Compact | ✓ | ✓ | ✓ | ✓ |
| General JSON | ✓ | ✓ | ✓ | ✓ |
| Flattened JSON  | ✓ | ✓ | ✓ | ✓ |

| JWS Algorithms | Supported ||
| -- | -- | -- |
| RSASSA-PKCS1-v1_5 | ✓ | RS256, RS384, RS512 |
| RSASSA-PSS | ✓ | PS256, PS384, PS512 |
| ECDSA | ✓ | ES256, ES384, ES512 |
| HMAC with SHA-2 | ✓ | HS256, HS384, HS512 |

| JWE Key Management Algorithms | Supported ||
| -- | -- | -- |
| AES | ✓ | A128KW, A192KW, A256KW |
| AES GCM | ✓ | A128GCMKW, A192GCMKW, A256GCMKW |
| Direct Key Agreement | ✓ | dir |
| RSAES OAEP | ✓<sup>*</sup> | RSA-OAEP <sub>(<sup>*</sup>RSA-OAEP-256 is not supported due to its lack of support in Node.JS)</sub> |
| RSAES-PKCS1-v1_5 | ✓ | RSA1_5 |
| PBES2 | ✓ | PBES2-HS256+A128KW, PBES2-HS384+A192KW, PBES2-HS512+A256KW |
| ECDH-ES | ✓ | ECDH-ES, ECDH-ES+A128KW, ECDH-ES+A192KW, ECDH-ES+A256KW |

| JWE Content Encryption Algorithms | Supported ||
| -- | -- | -- |
| AES GCM | ✓ | A128GCM, A192GCM, A256GCM |
| AES_CBC_HMAC_SHA2 | ✓ |  A128CBC-HS256, A192CBC-HS384, A256CBC-HS512 |

---

Remaining tasks:
- ✓ JWKS abstraction
- ✓ `crit` JWE/JWS Header parameter handling
- ✓ `b64` JWS crit support
- ✓ JWE `zip` handling
- ✓ JWE/JWS decrypt/verify algorithm whitelisting
- ◯ JWE/JWS reference (true/false for `kid`, name of the field for other fields)
- ◯ whitelist additional JWK reference fields (`kid`, `jku`, `x5c`, `x5t`, `x5t#S256`, `x5u`)
- ◯ README and documentation
- ◯ .d.ts types
- ◯ .github files (templates, CoC, Contributing)
- ◯ `@panva/jwt`
  - `compact` only with convenience methods and options
  - `@panva/jose` as a dependency

Won't implement:
- ✕ JWS embedded key / referenced verification - won't implement, who needs it can decode the header
  and pass the (`x5c`, `jwk`) to `JWK.importKey` and validate with that key, similarly the
  application can handle fetching the referenced `x5u` or `jku`
- ✕ JWS detached content - won't implement, who needs it can remove/attach the payload after/before
  the respective operation
- ✕ "none" alg support, no crypto, no use, don't bother

</details>

Missing a feature? - If it wasn't already discussed before, [ask for it][suggest-feature].  
Found a bug? - [report it][bug].

<h2>Support</h2>

[<img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160" align="right">][support-patreon]
If you or your business use @panva/jose, please consider becoming a [Patron][support-patreon] so I can continue maintaining it and adding new features carefree. You may also donate one-time via [PayPal][support-paypal].
[<img src="https://cdn.jsdelivr.net/gh/gregoiresgt/payment-icons@183140a5ff8f39b5a19d59ebeb2c77f03c3a24d3/Assets/Payment/PayPal/Paypal@2x.png" width="100" align="right">][support-paypal]

## Usage

The minimal Node.js version supported is v11.8.0

```js
const {
  JWE, // JSON Web Encryption (JWE)
  JWK, // JSON Web Key (JWK)
  JWKS, // JSON Web Key Set (JWKS)
  JWS, // JSON Web Signature (JWS)
  errors // errors utilized by @panva/jose
} = require('@panva/jose')

```

## JWK (JSON Web Key)

All @panva/jose operations require `JWK.Key` or `JWKS.KeyStore` as arguments. Here's
how to get a `JWK.Key`.

#### Class: JWK `<RSAKey>` | `<ECKey>` | `<OctKey>`

`<RSAKey>`, `<ECKey>` and `<OctKey>` represent a key usable for JWS and JWE operations. The
`JWK.importKey()` method is used to retrieve a key representation of an existing key or secret.
`JWK.generate()` method is used to generate a new random key.

#### JWK `#importKey(key[, options])` asymmetric key import

Imports an asymmetric private or public key. Supports importing JWK formatted keys (private, public,
secrets), `pem` and `der` formatted private and public keys, `pem` formatted X.509 certificates.
Private keys may also be passphrase protected.

<details>
  <summary><em><strong>API</strong></em> (Click to expand)</summary>

- `key`: `<Object>` | `<string>` | `<Buffer>` | `<KeyObject>`
  - `key`: `<string>` | `<Buffer>`
  - `format`: `<string>` Must be 'pem' or 'der'. Default: 'pem'.
  - `type`: `<string>` Must be 'pkcs1', 'pkcs8' or 'sec1'. This option is required only if the format is 'der' and ignored if it is 'pem'.
  - `passphrase`: `<string>` | `<Buffer>` The passphrase to use for decryption.
- `options`: `<Object>`
  - `alg`: `<string>` option identifies the algorithm intended for use with the key.
  - `use`: `<string>` option indicates whether the key is to be used for encrypting & decrypting data or signing & verifying data. Must be 'sig' or 'enc'.
  - `kid`: `<string>` Key ID Parameter. When not provided is computed using the method defined in [RFC7638][spec-thumbprint]
- Returns: `<RSAKey>` | `<ECKey>`

See the underlying Node.js API for details on importing private and public keys in the different formats

- [crypto.createPrivateKey(key)](https://nodejs.org/api/crypto.html#crypto_crypto_createprivatekey_key)
- [crypto.createPublicKey(key)](https://nodejs.org/api/crypto.html#crypto_crypto_createpublickey_key)
- [crypto.createSecretKey(key)](https://nodejs.org/api/crypto.html#crypto_crypto_createsecretkey_key)

</details>

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

#### JWK `#importKey(secret[, options])` secret key import

Imports a symmetric key.

<details>
  <summary><em><strong>API</strong></em> (Click to expand)</summary>

- `secret`: `<string>` | `<Buffer>` | `<KeyObject>`
- `options`: `<Object>`
  - `alg`: `<string>` option identifies the algorithm intended for use with the key.
  - `use`: `<string>` option indicates whether the key is to be used for encrypting & decrypting data or signing & verifying data. Must be 'sig' or 'enc'.
  - `kid`: `<string>` Key ID Parameter. When not provided is computed using the method defined in [RFC7638][spec-thumbprint]
- Returns: `<OctKey>`

</details>

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

#### JWK `#importKey(jwk)` JWK-formatted key import

Imports a JWK formatted key. This supports JWK formatted EC, RSA and oct keys. Asymmetrical keys
may be both private and public.

<details>
  <summary><em><strong>API</strong></em> (Click to expand)</summary>

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
- Returns: `<RSAKey>` | `<ECKey>` | `<OctKey>`

</details>

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

#### JWK `#generate(kty[, crvOrSize[, options[, private]]])` generating new keys

Securely generates a new RSA, EC or oct key.

<details>
  <summary><em><strong>API</strong></em> (Click to expand)</summary>

- `kty`: `<string>` Key type. Must be 'RSA', 'EC' or 'oct'.
- `crvOrSize`: `<number>` | `<string>` key's bit size or in case of EC keys the curve
- `options`: `<Object>`
  - `alg`: `<string>` option identifies the algorithm intended for use with the key.
  - `use`: `<string>` option indicates whether the key is to be used for encrypting & decrypting data or signing & verifying data. Must be 'sig' or 'enc'.
  - `kid`: `<string>` Key ID Parameter. When not provided is computed using the method defined in [RFC7638][spec-thumbprint]
- `private`: `<boolean>` **Default** 'true'. Is the resulting key private or public (when asymmetrical)
- Returns: `Promise<RSAKey>` | `Promise<ECKey>` | `Promise<OctKey>`

</details>

#### JWK `#generateSync(kty[, crvOrSize[, options[, private]]])`

Synchronous version of JWK `#generate`

<details>
  <summary><em><strong>API</strong></em> (Click to expand)</summary>

- `kty`: `<string>` Key type. Must be 'RSA', 'EC' or 'oct'.
- `crvOrSize`: `<number>` | `<string>` key's bit size or in case of EC keys the curve. **Default** 2048 for RSA, 'P-256' for EC and 256 for oct.
- `options`: `<Object>`
  - `alg`: `<string>` option identifies the algorithm intended for use with the key.
  - `use`: `<string>` option indicates whether the key is to be used for encrypting & decrypting data or signing & verifying data. Must be 'sig' or 'enc'.
  - `kid`: `<string>` Key ID Parameter. When not provided is computed using the method defined in [RFC7638][spec-thumbprint]
- `private`: `<boolean>` **Default** 'true'. Is the resulting key private or public (when asymmetrical)
- Returns: `<RSAKey>` | `<ECKey>` | `<OctKey>`

</details>

## JWKS (JSON Web Key Set)

- [Class: KeyStore](#class-keystore)
- [new KeyStore([keys])](#new-keystorekeys)
- [keystore.all([parameters])](#keystoreallparameters)
- [keystore.get([parameters])](#keystoregetparameters)
- [keystore.add(key)](#keystoreaddkey)
- [keystore.remove(key)](#keystoreremovekey)
- [keystore.generate(...)](#keystoregenerate)
- [keystore.generateSync(...)](#keystoregeneratesync)

#### Class: `KeyStore`

`KeyStore` is an abstraction representing a set of JWKs

#### `new KeyStore([keys])`

Creates a new KeyStore, either empty or populated.

<details>
  <summary><em><strong>API</strong></em> (Click to expand)</summary>

- `keys`: `<Key[]>` Array of key keys instantiated by `JWK.importKey`
- Returns: `<KeyStore>`

</details>

#### `keystore.all([parameters])`

Retrieves an array of keys matching the provider parameters, returns all if none are provided. The
returned array is sorted by relevance based on the parameters. Keys with the exact algorithm or use
specified by the parameters are first.

<details>
  <summary><em><strong>API</strong></em> (Click to expand)</summary>

- `parameters`: `<Object>`
  - `kty`: `<string>` Key Type to filter for.
  - `alg`: `<string>` Key supported algorithm to filter for.
  - `use`: `<string>` Key use to filter for.
  - `kid`: `<string>` Key ID to filter for.
- Returns: `<Key[]>` Array of key instances or an empty array when none are matching the parameters.

</details>

#### `keystore.get([parameters])`

Retrieves a single key matching the provider parameters. The most relevant Key based on the
parameters is returned.

<details>
  <summary><em><strong>API</strong></em> (Click to expand)</summary>

- `parameters`: `<Object>`
  - `kty`: `<string>` Key Type to filter for.
  - `alg`: `<string>` Key supported algorithm to filter for.
  - `use`: `<string>` Key use to filter for.
  - `kid`: `<string>` Key ID to filter for.
- Returns: `<RSAKey>` | `<ECKey>` | `<OctKey>` | `<undefined>`

</details>

#### `keystore.add(key)`

Adds a key instance to the store unless it is already included.

<details>
  <summary><em><strong>API</strong></em> (Click to expand)</summary>

- `key`: `<RSAKey>` | `<ECKey>` | `<OctKey>`

</details>

#### `keystore.remove(key)`

Ensures a key is removed from a store.

<details>
  <summary><em><strong>API</strong></em> (Click to expand)</summary>

- `key`: `<RSAKey>` | `<ECKey>` | `<OctKey>`

</details>

#### `keystore.generate(...)`

Asynchronously generates new random key and automatically adds it to the store. See `JWK.generate` for the API.

#### `keystore.generateSync(...)`

Synchronous version of `keystore.generate`.



[travis-image]: https://api.travis-ci.com/panva/jose.svg?branch=master
[travis-url]: https://travis-ci.com/panva/jose
[codecov-image]: https://img.shields.io/codecov/c/github/panva/jose/master.svg
[codecov-url]: https://codecov.io/gh/panva/jose
[suggest-feature]: https://github.com/panva/jose/issues/new?template=feature-request.md
[bug]: https://github.com/panva/jose/issues/new?template=bug-report.md
[support-patreon]: https://www.patreon.com/panva
[support-paypal]: https://www.paypal.me/panva
[spec-jwa]: https://tools.ietf.org/html/rfc7518
[spec-jws]: https://tools.ietf.org/html/rfc7515
[spec-jwe]: https://tools.ietf.org/html/rfc7516
[spec-b64]: https://tools.ietf.org/html/rfc7797
[spec-jwk]: https://tools.ietf.org/html/rfc7517
[spec-thumbprint]: https://tools.ietf.org/html/rfc7638
[spec-cookbook]: https://tools.ietf.org/html/rfc7520
