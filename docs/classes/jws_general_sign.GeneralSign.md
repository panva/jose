# Class: GeneralSign

[jws/general/sign](../modules/jws_general_sign.md).GeneralSign

The GeneralSign class is a utility for creating General JWS objects.

**`example`** ESM import
```js
import { GeneralSign } from 'jose/jws/general/sign'
```

**`example`** CJS import
```js
const { GeneralSign } = require('jose/jws/general/sign')
```

**`example`** Usage
```js
const encoder = new TextEncoder()

const sign = new GeneralSign(encoder.encode('It’s a dangerous business, Frodo, going out your door.'))

sign
  .addSignature(ecPrivateKey)
  .setProtectedHeader({ alg: 'ES256' })

sign
  .addSignature(rsaPrivateKey)
  .setProtectedHeader({ alg: 'PS256' })

const jws = await sign.sign()
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

#### Defined in

[jws/general/sign.ts:104](https://github.com/panva/jose/blob/v3.14.2/src/jws/general/sign.ts#L104)

## Methods

### addSignature

▸ **addSignature**(`key`, `options?`): [`Signature`](../interfaces/jws_general_sign.Signature.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | [`KeyLike`](../types/types.KeyLike.md) |
| `options?` | [`SignOptions`](../interfaces/types.SignOptions.md) |

#### Returns

[`Signature`](../interfaces/jws_general_sign.Signature.md)

#### Defined in

[jws/general/sign.ts:108](https://github.com/panva/jose/blob/v3.14.2/src/jws/general/sign.ts#L108)

___

### sign

▸ **sign**(): `Promise`<[`GeneralJWS`](../interfaces/types.GeneralJWS.md)\>

Signs and resolves the value of the General JWS object.

#### Returns

`Promise`<[`GeneralJWS`](../interfaces/types.GeneralJWS.md)\>

#### Defined in

[jws/general/sign.ts:118](https://github.com/panva/jose/blob/v3.14.2/src/jws/general/sign.ts#L118)
