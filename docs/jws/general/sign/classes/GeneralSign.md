# Class: GeneralSign

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Builds and signs General JWS objects.

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

### Constructor

▸ **new GeneralSign**(`payload`): `GeneralSign`

Creates a General JWS signer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `payload` | [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | Binary representation of the payload to sign. |

#### Returns

`GeneralSign`

## Methods

### addSignature()

▸ **addSignature**(`key`, `options?`): [`Signature`](../interfaces/Signature.md)

Adds a signature and returns its configuration.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | [`KeyInput`](../../../../types/type-aliases/KeyInput.md) | Private key or shared secret. See [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jws-alg). |
| `options?` | [`SignOptions`](../../../../types/interfaces/SignOptions.md) | JWS Sign options. |

#### Returns

[`Signature`](../interfaces/Signature.md)

***

### sign()

▸ **sign**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralJWS`](../../../../types/interfaces/GeneralJWS.md)\>

Signs the payload as a General JWS.

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`GeneralJWS`](../../../../types/interfaces/GeneralJWS.md)\>
