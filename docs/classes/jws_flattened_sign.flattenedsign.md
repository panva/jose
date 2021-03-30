# Class: FlattenedSign

[jws/flattened/sign](../modules/jws_flattened_sign.md).FlattenedSign

The FlattenedSign class is a utility for creating Flattened JWS objects.

**`example`** 
```js
// ESM import
import { FlattenedSign } from 'jose/jws/flattened/sign'
```

**`example`** 
```js
// CJS import
const { FlattenedSign } = require('jose/jws/flattened/sign')
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

const jws = await new FlattenedSign(encoder.encode('It’s a dangerous business, Frodo, going out your door.'))
  .setProtectedHeader({ alg: 'ES256' })
  .sign(privateKey)
console.log(jws)
```

## Table of contents

### Constructors

- [constructor](jws_flattened_sign.flattenedsign.md#constructor)

### Methods

- [setProtectedHeader](jws_flattened_sign.flattenedsign.md#setprotectedheader)
- [setUnprotectedHeader](jws_flattened_sign.flattenedsign.md#setunprotectedheader)
- [sign](jws_flattened_sign.flattenedsign.md#sign)

## Constructors

### constructor

\+ **new FlattenedSign**(`payload`: *Uint8Array*): [*FlattenedSign*](jws_flattened_sign.flattenedsign.md)

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`payload` | *Uint8Array* | Binary representation of the payload to sign.    |

**Returns:** [*FlattenedSign*](jws_flattened_sign.flattenedsign.md)

Defined in: [jws/flattened/sign.ts:56](https://github.com/panva/jose/blob/v3.11.2/src/jws/flattened/sign.ts#L56)

## Methods

### setProtectedHeader

▸ **setProtectedHeader**(`protectedHeader`: [*JWSHeaderParameters*](../interfaces/types.jwsheaderparameters.md)): [*FlattenedSign*](jws_flattened_sign.flattenedsign.md)

Sets the JWS Protected Header on the FlattenedSign object.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`protectedHeader` | [*JWSHeaderParameters*](../interfaces/types.jwsheaderparameters.md) | JWS Protected Header.    |

**Returns:** [*FlattenedSign*](jws_flattened_sign.flattenedsign.md)

Defined in: [jws/flattened/sign.ts:70](https://github.com/panva/jose/blob/v3.11.2/src/jws/flattened/sign.ts#L70)

___

### setUnprotectedHeader

▸ **setUnprotectedHeader**(`unprotectedHeader`: [*JWSHeaderParameters*](../interfaces/types.jwsheaderparameters.md)): [*FlattenedSign*](jws_flattened_sign.flattenedsign.md)

Sets the JWS Unprotected Header on the FlattenedSign object.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`unprotectedHeader` | [*JWSHeaderParameters*](../interfaces/types.jwsheaderparameters.md) | JWS Unprotected Header.    |

**Returns:** [*FlattenedSign*](jws_flattened_sign.flattenedsign.md)

Defined in: [jws/flattened/sign.ts:83](https://github.com/panva/jose/blob/v3.11.2/src/jws/flattened/sign.ts#L83)

___

### sign

▸ **sign**(`key`: [*KeyLike*](../types/types.keylike.md), `options?`: [*SignOptions*](../interfaces/types.signoptions.md)): *Promise*<[*FlattenedJWS*](../interfaces/types.flattenedjws.md)\>

Signs and resolves the value of the Flattened JWS object.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`key` | [*KeyLike*](../types/types.keylike.md) | Private Key or Secret to sign the JWS with.   |
`options?` | [*SignOptions*](../interfaces/types.signoptions.md) | JWS Sign options.    |

**Returns:** *Promise*<[*FlattenedJWS*](../interfaces/types.flattenedjws.md)\>

Defined in: [jws/flattened/sign.ts:97](https://github.com/panva/jose/blob/v3.11.2/src/jws/flattened/sign.ts#L97)
