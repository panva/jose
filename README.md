# @panva/jose

[![build][travis-image]][travis-url] [![codecov][codecov-image]][codecov-url]

TODO:

**Table of Contents**

TODO:

## Implemented specs & features

Legend:
- **✓** Implemented
- **✕** Missing node crypto support / won't implement / not planned / PR welcome
- **◯** TODO

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
  and pass the (`x5c`, `jwk`) to JWK.importKey and validate with that key, similarly the
  application can handle fetching the referenced `x5u` or `jku`
- ✕ JWS detached content - won't implement, who needs it can remove/attach the payload after/before
  the respective operation
- ✕ "none" alg support, no crypto, no use, don't bother

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

Missing a feature? - If it wasn't already discussed before, [ask for it][suggest-feature].  
Found a bug? - [report it][bug].

<h2>Support</h2>

[<img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160" align="right">][support-patreon]
If you or your business use @panva/jose, please consider becoming a [Patron][support-patreon] so I can continue maintaining it and adding new features carefree. You may also donate one-time via [PayPal][support-paypal].
[<img src="https://cdn.jsdelivr.net/gh/gregoiresgt/payment-icons@183140a5ff8f39b5a19d59ebeb2c77f03c3a24d3/Assets/Payment/PayPal/Paypal@2x.png" width="100" align="right">][support-paypal]

## Usage

TODO:


[travis-image]: https://api.travis-ci.com/panva/jose.svg?branch=master
[travis-url]: https://travis-ci.com/panva/jose
[codecov-image]: https://img.shields.io/codecov/c/github/panva/jose/master.svg
[codecov-url]: https://codecov.io/gh/panva/jose
[suggest-feature]: https://github.com/panva/jose/issues/new?template=feature-request.md
[bug]: https://github.com/panva/jose/issues/new?template=bug-report.md
[support-patreon]: https://www.patreon.com/panva
[support-paypal]: https://www.paypal.me/panva
