# Interface: SDJWTCredential\<PayloadType, SerializationType\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

A verified Issuer-signed SD-JWT held together with all supplied and successfully processed
Disclosures. A Holder cannot determine whether the Issuer supplied every non-decoy Disclosure.
Values exposed by a credential are ordinary mutable JavaScript values. Presentation operations
use separate internal snapshots and are not affected by mutations to those exposed values.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) |
| `SerializationType` *extends* [`SDJWT`](../../../types/type-aliases/SDJWT.md) | [`SDJWT`](../../../types/type-aliases/SDJWT.md) |

## Properties

### disclosures

• **disclosures**: [`SDJWTDisclosure`](SDJWTDisclosure.md)[]

Metadata for all Disclosures received from the Issuer.

***

### payload

• **payload**: `PayloadType` & [`JWTPayload`](../../../types/interfaces/JWTPayload.md)

Processed SD-JWT Payload containing permanently disclosed claims and every successfully
processed Disclosure, with `_sd` and `_sd_alg` removed.

***

### key?

• `optional` **key?**: [`CryptoKey`](https://developer.mozilla.org/docs/Web/API/CryptoKey)

Key resolved by a dynamic Issuer key resolver.

***

### protectedHeader?

• `optional` **protectedHeader?**: [`JWSHeaderParameters`](../../../types/interfaces/JWSHeaderParameters.md)

Protected header of the successfully verified Issuer signature, if present.

***

### unprotectedHeader?

• `optional` **unprotectedHeader?**: [`JWSHeaderParameters`](../../../types/interfaces/JWSHeaderParameters.md)

Unprotected header of the successfully verified Issuer signature, if present. Except for the
RFC 9901 transport parameters whose contents are validated separately, its members are not
integrity protected and must not drive security decisions.

## Methods

### addKeyBinding()

▸ **addKeyBinding**(`key`, `options?`): [`SDJWTKeyBinding`](SDJWTKeyBinding.md)\<`SerializationType`\>

Adds a Key Binding JWT to a presentation. This returns a fresh child builder and does not
mutate the credential. The private key must correspond to the confirmation method in the
Issuer-signed SD-JWT (for example, its `cnf.jwk`); the builder does not establish that
association, but the Verifier checks it.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | [`SDJWTHolderSigningKey`](../type-aliases/SDJWTHolderSigningKey.md) | Private asymmetric key used to sign the Key Binding JWT. |
| `options?` | [`SignOptions`](../../../types/interfaces/SignOptions.md) | JWS signing options. |

#### Returns

[`SDJWTKeyBinding`](SDJWTKeyBinding.md)\<`SerializationType`\>

#### Example

```js
const presentation = await credential
  .addKeyBinding(holderPrivateKey)
  .setProtectedHeader({ alg: 'ES256' })
  .setAudience('https://verifier.example')
  .setNonce(nonce)
  .setIssuedAt()
  .present(['/given_name'])
```

***

### present()

▸ **present**(`paths?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`SerializationType`\>

Creates a presentation without Key Binding. `paths` must contain exact values exposed by this
credential's `disclosures`. Omitting `paths` or passing an empty array includes no Disclosures.
The credential is reusable and the output preserves its Compact, Flattened JSON, or General
JSON serialization. A bare SD-JWT does not integrity protect the selected set of Disclosures
and can be forwarded or reduced by an intermediary; use Key Binding when that is not
acceptable.

Selecting a recursively disclosed child automatically includes its parent Disclosure. Any
cleartext siblings inside that parent are revealed with it.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `paths?` | readonly `string`[] |

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`SerializationType`\>
