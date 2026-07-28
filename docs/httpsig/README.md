# httpsig

HTTP Message Signature signing and verification primitives

This functionality is exported exclusively from the `'jose/httpsig'` subpath.

This module implements the `HTTP_SIGN` and `HTTP_VERIFY` cryptographic primitives defined in
[RFC 9421 Section 3.3](https://www.rfc-editor.org/info/rfc9421/#section-3.3). Constructing
the signature base, resolving derived components, parsing and serializing Structured Fields,
producing the `Signature-Input` and `Signature` field values, calculating `Content-Digest`, and
enforcing component coverage, `created`, `expires`, `nonce`, `tag`, `keyid`, and replay policy
remain the application's responsibility.

Both the identifiers from the IANA "HTTP Signature Algorithms" registry and the JSON Web
Signature algorithm identifiers supported by `jose` are accepted.

## Example

```js
import * as httpsig from 'jose/httpsig'

// The signature base is constructed by the application per RFC 9421 Section 2.5
const data = new TextEncoder().encode(
  '"@method": POST\n' +
    '"@authority": example.com\n' +
    '"@signature-params": ("@method" "@authority");created=1618884473;keyid="my-key"',
)

const signature = await httpsig.sign('ecdsa-p256-sha256', privateKey, data)

const valid = await httpsig.verify('ecdsa-p256-sha256', publicKey, signature, data)
console.log(valid)
```

## Functions

- [sign](functions/sign.md)
- [verify](functions/verify.md)
