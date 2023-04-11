# Class: GeneralSign

[💗 Help the project](https://github.com/sponsors/panva)

The GeneralSign class is a utility for creating General JWS objects.

**`example`** Usage

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

## Table of contents

### Constructors

- [constructor](jws_general_sign.GeneralSign.md#constructor)

### Methods

- [addSignature](jws_general_sign.GeneralSign.md#addsignature)
- [sign](jws_general_sign.GeneralSign.md#sign)

## Constructors

### constructor

• **new GeneralSign**(`payload`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`Uint8Array`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array ) | Binary representation of the payload to sign. |

## Methods

### addSignature

▸ **addSignature**(`key`, `options?`): [`Signature`](../interfaces/jws_general_sign.Signature.md)

Adds an additional signature for the General JWS object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | [`Uint8Array`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array ) \| [`KeyLike`](../types/types.KeyLike.md) | Private Key or Secret to sign the individual JWS signature with. See also [Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jws-alg). |
| `options?` | [`SignOptions`](../interfaces/types.SignOptions.md) | JWS Sign options. |

#### Returns

[`Signature`](../interfaces/jws_general_sign.Signature.md)

___

### sign

▸ **sign**(): [`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<[`GeneralJWS`](../interfaces/types.GeneralJWS.md)\>

Signs and resolves the value of the General JWS object.

#### Returns

[`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<[`GeneralJWS`](../interfaces/types.GeneralJWS.md)\>
