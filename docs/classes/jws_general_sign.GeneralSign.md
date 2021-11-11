# Class: GeneralSign

The GeneralSign class is a utility for creating General JWS objects.

**`example`** Usage
```js
const jws = await new jose.GeneralSign(
  new TextEncoder().encode(
    'It’s a dangerous business, Frodo, going out your door.'
  )
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
| `payload` | `Uint8Array` | Binary representation of the payload to sign. |

## Methods

### addSignature

▸ **addSignature**(`key`, `options?`): [`Signature`](../interfaces/jws_general_sign.Signature.md)

Adds an additional signature for the General JWS object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | [`KeyLike`](../types/types.KeyLike.md) \| `Uint8Array` | Private Key or Secret to sign the individual JWS signature with. |
| `options?` | [`SignOptions`](../interfaces/types.SignOptions.md) | JWS Sign options. |

#### Returns

[`Signature`](../interfaces/jws_general_sign.Signature.md)

___

### sign

▸ **sign**(): `Promise`<[`GeneralJWS`](../interfaces/types.GeneralJWS.md)\>

Signs and resolves the value of the General JWS object.

#### Returns

`Promise`<[`GeneralJWS`](../interfaces/types.GeneralJWS.md)\>
