# Class: CompactSign

[jws/compact/sign](../modules/jws_compact_sign.md).CompactSign

The CompactSign class is a utility for creating Compact JWS strings.

**`example`** 
```js
// ESM import
import { CompactSign } from 'jose/jws/compact/sign'
```

**`example`** 
```js
// CJS import
const { CompactSign } = require('jose/jws/compact/sign')
```

**`example`** 
```js
// usage
import { parseJwk } from 'jose/jwk/parse'

const encoder = new TextEncoder()
const privateKey = await parseJwk({
  alg: 'ES256',
  crv: 'P-256',
  kty: 'EC',
  d: 'VhsfgSRKcvHCGpLyygMbO_YpXc7bVKwi12KQTE4yOR4',
  x: 'ySK38C1jBdLwDsNWKzzBHqKYEE5Cgv-qjWvorUXk9fw',
  y: '_LeQBw07cf5t57Iavn4j-BqJsAD1dpoz8gokd3sBsOo'
})

const jws = await new CompactSign(encoder.encode('It’s a dangerous business, Frodo, going out your door.'))
  .setProtectedHeader({ alg: 'ES256' })
  .sign(privateKey)

console.log(jws)
```

## Table of contents

### Constructors

- [constructor](jws_compact_sign.compactsign.md#constructor)

### Methods

- [setProtectedHeader](jws_compact_sign.compactsign.md#setprotectedheader)
- [sign](jws_compact_sign.compactsign.md#sign)

## Constructors

### constructor

\+ **new CompactSign**(`payload`: *Uint8Array*): [*CompactSign*](jws_compact_sign.compactsign.md)

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`payload` | *Uint8Array* | Binary representation of the payload to sign.    |

**Returns:** [*CompactSign*](jws_compact_sign.compactsign.md)

Defined in: [jws/compact/sign.ts:44](https://github.com/panva/jose/blob/v3.11.2/src/jws/compact/sign.ts#L44)

## Methods

### setProtectedHeader

▸ **setProtectedHeader**(`protectedHeader`: [*JWSHeaderParameters*](../interfaces/types.jwsheaderparameters.md)): [*CompactSign*](jws_compact_sign.compactsign.md)

Sets the JWS Protected Header on the Sign object.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`protectedHeader` | [*JWSHeaderParameters*](../interfaces/types.jwsheaderparameters.md) | JWS Protected Header.    |

**Returns:** [*CompactSign*](jws_compact_sign.compactsign.md)

Defined in: [jws/compact/sign.ts:58](https://github.com/panva/jose/blob/v3.11.2/src/jws/compact/sign.ts#L58)

___

### sign

▸ **sign**(`key`: [*KeyLike*](../types/types.keylike.md), `options?`: [*SignOptions*](../interfaces/types.signoptions.md)): *Promise*<string\>

Signs and resolves the value of the Compact JWS string.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`key` | [*KeyLike*](../types/types.keylike.md) | Private Key or Secret to sign the JWS with.   |
`options?` | [*SignOptions*](../interfaces/types.signoptions.md) | JWS Sign options.    |

**Returns:** *Promise*<string\>

Defined in: [jws/compact/sign.ts:69](https://github.com/panva/jose/blob/v3.11.2/src/jws/compact/sign.ts#L69)
