# Class: FlattenedSign

[jws/flattened/sign](../modules/jws_flattened_sign.md).FlattenedSign

The FlattenedSign class is a utility for creating Flattened JWS objects.

**`example`** ESM import
```js
import { FlattenedSign } from 'jose/jws/flattened/sign'
```

**`example`** CJS import
```js
const { FlattenedSign } = require('jose/jws/flattened/sign')
```

**`example`** Deno import
```js
import { FlattenedSign } from 'https://deno.land/x/jose@v3.15.5/jws/flattened/sign.ts'
```

**`example`** Usage
```js
const encoder = new TextEncoder()

const jws = await new FlattenedSign(encoder.encode('It’s a dangerous business, Frodo, going out your door.'))
  .setProtectedHeader({ alg: 'ES256' })
  .sign(privateKey)
console.log(jws)
```

## Table of contents

### Constructors

- [constructor](jws_flattened_sign.FlattenedSign.md#constructor)

### Methods

- [setProtectedHeader](jws_flattened_sign.FlattenedSign.md#setprotectedheader)
- [setUnprotectedHeader](jws_flattened_sign.FlattenedSign.md#setunprotectedheader)
- [sign](jws_flattened_sign.FlattenedSign.md#sign)

## Constructors

### constructor

• **new FlattenedSign**(`payload`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `Uint8Array` | Binary representation of the payload to sign. |

#### Defined in

[jws/flattened/sign.ts:51](https://github.com/panva/jose/blob/v3.15.5/src/jws/flattened/sign.ts#L51)

## Methods

### setProtectedHeader

▸ **setProtectedHeader**(`protectedHeader`): [`FlattenedSign`](jws_flattened_sign.FlattenedSign.md)

Sets the JWS Protected Header on the FlattenedSign object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `protectedHeader` | [`JWSHeaderParameters`](../interfaces/types.JWSHeaderParameters.md) | JWS Protected Header. |

#### Returns

[`FlattenedSign`](jws_flattened_sign.FlattenedSign.md)

#### Defined in

[jws/flattened/sign.ts:60](https://github.com/panva/jose/blob/v3.15.5/src/jws/flattened/sign.ts#L60)

___

### setUnprotectedHeader

▸ **setUnprotectedHeader**(`unprotectedHeader`): [`FlattenedSign`](jws_flattened_sign.FlattenedSign.md)

Sets the JWS Unprotected Header on the FlattenedSign object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `unprotectedHeader` | [`JWSHeaderParameters`](../interfaces/types.JWSHeaderParameters.md) | JWS Unprotected Header. |

#### Returns

[`FlattenedSign`](jws_flattened_sign.FlattenedSign.md)

#### Defined in

[jws/flattened/sign.ts:73](https://github.com/panva/jose/blob/v3.15.5/src/jws/flattened/sign.ts#L73)

___

### sign

▸ **sign**(`key`, `options?`): `Promise`<[`FlattenedJWS`](../interfaces/types.FlattenedJWS.md)\>

Signs and resolves the value of the Flattened JWS object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | [`KeyLike`](../types/types.KeyLike.md) | Private Key or Secret to sign the JWS with. |
| `options?` | [`SignOptions`](../interfaces/types.SignOptions.md) | JWS Sign options. |

#### Returns

`Promise`<[`FlattenedJWS`](../interfaces/types.FlattenedJWS.md)\>

#### Defined in

[jws/flattened/sign.ts:87](https://github.com/panva/jose/blob/v3.15.5/src/jws/flattened/sign.ts#L87)
