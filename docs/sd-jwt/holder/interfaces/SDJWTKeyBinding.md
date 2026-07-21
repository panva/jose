# Interface: SDJWTKeyBinding\<SerializationType\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Builds a Key Binding JWT for an SD-JWT presentation.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `SerializationType` *extends* [`SDJWT`](../../../types/type-aliases/SDJWT.md) | [`SDJWT`](../../../types/type-aliases/SDJWT.md) |

## Methods

### present()

▸ **present**(`paths?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`SerializationType`\>

Creates a presentation containing the Disclosures selected by `paths` and the configured Key
Binding. Omitting `paths` or passing an empty array includes no Disclosures; the Key Binding
JWT is still created.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `paths?` | readonly `string`[] |

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`SerializationType`\>

***

### setAudience()

▸ **setAudience**(`audience`): `this`

Sets the intended Verifier identifier as the Key Binding JWT `aud` claim.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `audience` | `string` |

#### Returns

`this`

***

### setIssuedAt()

▸ **setIssuedAt**(`input?`): `this`

Sets the Key Binding JWT `iat` claim. The current time is used when this method is omitted or
called without an argument.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `input?` | `string` \| `number` \| [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) |

#### Returns

`this`

***

### setNonce()

▸ **setNonce**(`nonce`): `this`

Sets the fresh transaction nonce supplied by the Verifier. The Verifier is responsible for
securely issuing and consuming the nonce to prevent replay.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `nonce` | `string` |

#### Returns

`this`

***

### setPayload()

▸ **setPayload**(`payload`): `this`

Sets custom Key Binding JWT Claims. The `aud`, `nonce`, `iat`, and `sd_hash` claims are managed
through dedicated builder methods or by the library and must not be included. RFC 9901
recommends avoiding additional Key Binding JWT claims unless an application profile or another
compelling reason requires them.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `payload` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) |

#### Returns

`this`

***

### setProtectedHeader()

▸ **setProtectedHeader**(`protectedHeader`): `this`

Sets the Key Binding JWT Protected Header. A digital-signature `alg` is required and `typ` is
set to `kb+jwt`.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `protectedHeader` | [`JWTHeaderParameters`](../../../types/interfaces/JWTHeaderParameters.md) |

#### Returns

`this`
