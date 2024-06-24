# Class: GeneralSign

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

The GeneralSign class is used to build and sign General JWS objects.

This class is exported (as a named export) from the main `'jose'` module entry point as well as
from its subpath export `'jose/jws/general/sign'`.

## Example

```js
const jws = await new jose.GeneralSign(
  new TextEncoder().encode('It’s a dangerous business, Frodo, going out your door.'),
)
  .addSignature(ecPrivateKey)
  .setProtectedHeader({ alg: 'ES256' })
  .addSignature(rsaPrivateKey)
  .setProtectedHeader({ alg: 'PS256' })
  .sign()

console.log(jws)
```

## Constructors

### new GeneralSign()

▸ **new GeneralSign**(`payload`): [`GeneralSign`](GeneralSign.md)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `payload` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | Binary representation of the payload to sign. |

#### Returns

[`GeneralSign`](GeneralSign.md)

## Methods

### addSignature()

▸ **addSignature**(`key`, `options`?): [`Signature`](../interfaces/Signature.md)

Adds an additional signature for the General JWS object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) \| [`KeyLike`](../../../../types/type-aliases/KeyLike.md) \| [`JWK`](../../../../types/interfaces/JWK.md) | Private Key or Secret to sign the individual JWS signature with. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jws-alg). |
| `options`? | [`SignOptions`](../../../../types/interfaces/SignOptions.md) | JWS Sign options. |

#### Returns

[`Signature`](../interfaces/Signature.md)

***

### sign()

▸ **sign**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralJWS`](../../../../types/interfaces/GeneralJWS.md)\>

Signs and resolves the value of the General JWS object.

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralJWS`](../../../../types/interfaces/GeneralJWS.md)\>
