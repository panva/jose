# Class: FlattenedSign

[💗 Help the project](https://github.com/sponsors/panva)

The FlattenedSign class is a utility for creating Flattened JWS objects.

**`example`** Usage

```js
const jws = await new jose.FlattenedSign(
  new TextEncoder().encode('It’s a dangerous business, Frodo, going out your door.'),
)
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

___

### sign

▸ **sign**(`key`, `options?`): `Promise`<[`FlattenedJWS`](../interfaces/types.FlattenedJWS.md)\>

Signs and resolves the value of the Flattened JWS object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `Uint8Array` \| [`KeyLike`](../types/types.KeyLike.md) | Private Key or Secret to sign the JWS with. |
| `options?` | [`SignOptions`](../interfaces/types.SignOptions.md) | JWS Sign options. |

#### Returns

`Promise`<[`FlattenedJWS`](../interfaces/types.FlattenedJWS.md)\>
