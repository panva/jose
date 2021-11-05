# Class: CompactSign

The CompactSign class is a utility for creating Compact JWS strings.

**`example`** Usage
```js
const encoder = new TextEncoder()

const jws = await new CompactSign(encoder.encode('It’s a dangerous business, Frodo, going out your door.'))
  .setProtectedHeader({ alg: 'ES256' })
  .sign(privateKey)

console.log(jws)
```

**`example`** ESM import
```js
import { CompactSign } from 'jose'
```

**`example`** CJS import
```js
const { CompactSign } = require('jose')
```

**`example`** Deno import
```js
import { CompactSign } from 'https://deno.land/x/jose@v4.1.5/index.ts'
```

## Table of contents

### Constructors

- [constructor](jws_compact_sign.CompactSign.md#constructor)

### Methods

- [setProtectedHeader](jws_compact_sign.CompactSign.md#setprotectedheader)
- [sign](jws_compact_sign.CompactSign.md#sign)

## Constructors

### constructor

• **new CompactSign**(`payload`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `payload` | `Uint8Array` | Binary representation of the payload to sign. |

## Methods

### setProtectedHeader

▸ **setProtectedHeader**(`protectedHeader`): [`CompactSign`](jws_compact_sign.CompactSign.md)

Sets the JWS Protected Header on the Sign object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `protectedHeader` | [`JWSHeaderParameters`](../interfaces/types.JWSHeaderParameters.md) | JWS Protected Header. |

#### Returns

[`CompactSign`](jws_compact_sign.CompactSign.md)

___

### sign

▸ **sign**(`key`, `options?`): `Promise`<`string`\>

Signs and resolves the value of the Compact JWS string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | [`KeyLike`](../types/types.KeyLike.md) \| `Uint8Array` | Private Key or Secret to sign the JWS with. |
| `options?` | [`SignOptions`](../interfaces/types.SignOptions.md) | JWS Sign options. |

#### Returns

`Promise`<`string`\>
