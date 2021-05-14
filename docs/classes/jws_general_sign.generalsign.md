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

- [constructor](jws_general_sign.generalsign.md#constructor)

### Methods

- [addSignature](jws_general_sign.generalsign.md#addsignature)
- [sign](jws_general_sign.generalsign.md#sign)

## Constructors

### constructor

\+ **new GeneralSign**(`payload`: *Uint8Array*): [*GeneralSign*](jws_general_sign.generalsign.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | *Uint8Array* | Binary representation of the payload to sign. |

**Returns:** [*GeneralSign*](jws_general_sign.generalsign.md)

Defined in: [jws/general/sign.ts:99](https://github.com/panva/jose/blob/v3.12.1/src/jws/general/sign.ts#L99)

## Methods

### addSignature

▸ **addSignature**(`key`: [*KeyLike*](../types/types.keylike.md), `options?`: [*SignOptions*](../interfaces/types.signoptions.md)): [*Signature*](../interfaces/jws_general_sign.signature.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | [*KeyLike*](../types/types.keylike.md) |
| `options?` | [*SignOptions*](../interfaces/types.signoptions.md) |

**Returns:** [*Signature*](../interfaces/jws_general_sign.signature.md)

Defined in: [jws/general/sign.ts:108](https://github.com/panva/jose/blob/v3.12.1/src/jws/general/sign.ts#L108)

___

### sign

▸ **sign**(): *Promise*<[*GeneralJWS*](../interfaces/types.generaljws.md)\>

Signs and resolves the value of the General JWS object.

**Returns:** *Promise*<[*GeneralJWS*](../interfaces/types.generaljws.md)\>

Defined in: [jws/general/sign.ts:118](https://github.com/panva/jose/blob/v3.12.1/src/jws/general/sign.ts#L118)
