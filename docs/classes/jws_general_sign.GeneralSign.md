# Class: GeneralSign

The GeneralSign class is a utility for creating General JWS objects.

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

**`example`** ESM import
```js
import { GeneralSign } from 'jose'
```

**`example`** CJS import
```js
const { GeneralSign } = require('jose')
```

**`example`** Deno import
```js
import { GeneralSign } from 'https://deno.land/x/jose@v4.0.0/index.ts'
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

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | [`KeyLike`](../types/types.KeyLike.md) \| `Uint8Array` |
| `options?` | [`SignOptions`](../interfaces/types.SignOptions.md) |

#### Returns

[`Signature`](../interfaces/jws_general_sign.Signature.md)

___

### sign

▸ **sign**(): `Promise`<[`GeneralJWS`](../interfaces/types.GeneralJWS.md)\>

Signs and resolves the value of the General JWS object.

#### Returns

`Promise`<[`GeneralJWS`](../interfaces/types.GeneralJWS.md)\>
