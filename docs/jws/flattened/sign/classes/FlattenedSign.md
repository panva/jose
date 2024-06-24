# Class: FlattenedSign

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

The FlattenedSign class is used to build and sign Flattened JWS objects.

This class is exported (as a named export) from the main `'jose'` module entry point as well as
from its subpath export `'jose/jws/flattened/sign'`.

## Example

```js
const jws = await new jose.FlattenedSign(
  new TextEncoder().encode('It’s a dangerous business, Frodo, going out your door.'),
)
  .setProtectedHeader({ alg: 'ES256' })
  .sign(privateKey)

console.log(jws)
```

## Constructors

### new FlattenedSign()

▸ **new FlattenedSign**(`payload`): [`FlattenedSign`](FlattenedSign.md)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `payload` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | Binary representation of the payload to sign. |

#### Returns

[`FlattenedSign`](FlattenedSign.md)

## Methods

### setProtectedHeader()

▸ **setProtectedHeader**(`protectedHeader`): `this`

Sets the JWS Protected Header on the FlattenedSign object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `protectedHeader` | [`JWSHeaderParameters`](../../../../types/interfaces/JWSHeaderParameters.md) | JWS Protected Header. |

#### Returns

`this`

***

### setUnprotectedHeader()

▸ **setUnprotectedHeader**(`unprotectedHeader`): `this`

Sets the JWS Unprotected Header on the FlattenedSign object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `unprotectedHeader` | [`JWSHeaderParameters`](../../../../types/interfaces/JWSHeaderParameters.md) | JWS Unprotected Header. |

#### Returns

`this`

***

### sign()

▸ **sign**(`key`, `options`?): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`FlattenedJWS`](../../../../types/interfaces/FlattenedJWS.md)\>

Signs and resolves the value of the Flattened JWS object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`KeyLike`](../../../../types/type-aliases/KeyLike.md) \| [`JWK`](../../../../types/interfaces/JWK.md) | Private Key or Secret to sign the JWS with. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jws-alg). |
| `options`? | [`SignOptions`](../../../../types/interfaces/SignOptions.md) | JWS Sign options. |

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`FlattenedJWS`](../../../../types/interfaces/FlattenedJWS.md)\>
