# WIP

```
$ nvm use stable
$ node removeme/asym.js
$ node removeme/sym.js
```

# ultimate-jose

[![build][travis-image]][travis-url] [![codecov][codecov-image]][codecov-url]

TODO:

**Table of Contents**

TODO:

## Implemented specs & features

- **✓** Implemented
- **✕** Missing node crypto support
- **◯** TODO

---

- ◯ JWKS abstraction
- ◯ JWE abstraction
- ✓ JWT sign/verify
- ◯ JWT encrypt/decrypt

| JWK Key Types | |
| -- | -- |
| RSA | ✓ |
| EC | ✓ |
| oct | ✓ |

| JWS Algorithms | |
| -- | -- |
| RS256 | ✓ |
| RS384 | ✓ |
| RS512 | ✓ |
| PS256 | ✓ |
| PS384 | ✓ |
| PS512 | ✓ |
| ES256 | ✓ |
| ES384 | ✓ |
| ES512 | ✓ |
| HS256 | ✓ |
| HS384 | ✓ |
| HS512 | ✓ |

| JWS Serializations | |
| -- | -- |
| Compact | ✓ |
| General JSON | ✓ |
| Flattened JSON  | ✓ |

| JWE Key Wrapping Algorithms | |
| -- | -- |
| A128KW | ✓ |
| A192KW | ✓ |
| A256KW | ✓ |
| A128GCMKW | ✓ |
| A192GCMKW | ✓ |
| A256GCMKW | ✓ |
| RSA-OAEP | ✓ |
| RSA-OAEP-256 | ✕ |
| RSA1_5 | ✓ |
| PBES2-HS256+A128KW | ✓ |
| PBES2-HS384+A192KW | ✓ |
| PBES2-HS512+A256KW | ✓ |
| ECDH-ES | ◯ |
| ECDH-ES+A128KW | ◯ |
| ECDH-ES+A192KW | ◯ |
| ECDH-ES+A256KW | ◯ |

| JWE Serializations | |
| -- | -- |
| Compact | ◯ |
| General JSON | ◯ |
| Flattened JSON  | ◯ |

| JWE Content Encryption Algorithms | |
| -- | -- |
| A128GCM | ✓ |
| A192GCM | ✓ |
| A256GCM | ✓ |
| A128CBC-HS256 | ✓ |
| A192CBC-HS384 | ✓ |
| A256CBC-HS512 | ✓ |

Missing a feature? - If it wasn't already discussed before, [ask for it][suggest-feature].  
Found a bug? - [report it][bug].

<h2>Support</h2>

[<img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160" align="right">][support-patreon]
If you or your business use ultimate-jose, please consider becoming a [Patron][support-patreon] so I can continue maintaining it and adding new features carefree. You may also donate one-time via [PayPal][support-paypal].
[<img src="https://cdn.jsdelivr.net/gh/gregoiresgt/payment-icons@183140a5ff8f39b5a19d59ebeb2c77f03c3a24d3/Assets/Payment/PayPal/Paypal@2x.png" width="100" align="right">][support-paypal]

## Usage

TODO:


[travis-image]: https://api.travis-ci.com/panva/ultimate-jose.svg?branch=master
[travis-url]: https://travis-ci.com/panva/ultimate-jose
[codecov-image]: https://img.shields.io/codecov/c/github/panva/ultimate-jose/master.svg
[codecov-url]: https://codecov.io/gh/panva/ultimate-jose
[suggest-feature]: https://github.com/panva/ultimate-jose/issues/new?template=feature-request.md
[bug]: https://github.com/panva/ultimate-jose/issues/new?template=bug-report.md
[support-patreon]: https://www.patreon.com/panva
[support-paypal]: https://www.paypal.me/panva
