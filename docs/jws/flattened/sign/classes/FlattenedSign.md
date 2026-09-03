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

### Constructor

▸ **new FlattenedSign**(`payload`): `FlattenedSign`

FlattenedSign constructor

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `payload` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | Binary representation of the payload to sign. |

#### Returns

`FlattenedSign`

## Methods

### setProtectedHeader()

▸ **setProtectedHeader**(`protectedHeader`): `this`

Sets the Protected Header on the JWS, JWE, or JWT producer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `protectedHeader` | [`SelectedJWSHeaderParameters`](../../../../algorithms/jws/interfaces/SelectedJWSHeaderParameters.md) | JOSE Protected Header accepted by this producer. |

#### Returns

`this`

***

### setUnprotectedHeader()

▸ **setUnprotectedHeader**(`unprotectedHeader`): `this`

Sets the JWS Unprotected Header or JWE Per-Recipient Unprotected Header on the producer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `unprotectedHeader` | [`SelectedJWSHeaderParameters`](../../../../algorithms/jws/interfaces/SelectedJWSHeaderParameters.md) | JWS Unprotected Header or JWE Per-Recipient Unprotected Header. |

#### Returns

`this`

***

### sign()

▸ **sign**(`key`, `options?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`FlattenedJWS`](../../../../types/interfaces/FlattenedJWS.md)\>

Signs and resolves the JWS or signed JWT.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | [`JWSKeyInput`](../../../../algorithms/jws/type-aliases/JWSKeyInput.md) | Private Key or Secret to sign the JWS or JWT with. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jws-alg). |
| `options?` | [`SignOptions`](../../../../types/interfaces/SignOptions.md) | JWS or JWT Sign options. |

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`FlattenedJWS`](../../../../types/interfaces/FlattenedJWS.md)\>
