# Class: FlattenedSign

The FlattenedSign class is a utility for creating Flattened JWS objects.

**`example`** 
```js
// ESM import
import FlattenedSign from 'jose/jws/flattened/sign'
```

**`example`** 
```js
// CJS import
const { default: FlattenedSign } = require('jose/jws/flattened/sign')
```

**`example`** 
```js
// usage
import parseJwk from 'jose/jwk/parse'

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

## Index

### Constructors

* [constructor](_jws_flattened_sign_.flattenedsign.md#constructor)

### Methods

* [setProtectedHeader](_jws_flattened_sign_.flattenedsign.md#setprotectedheader)
* [setUnprotectedHeader](_jws_flattened_sign_.flattenedsign.md#setunprotectedheader)
* [sign](_jws_flattened_sign_.flattenedsign.md#sign)

## Constructors

### constructor

\+ **new FlattenedSign**(`payload`: Uint8Array): [FlattenedSign](_jws_flattened_sign_.flattenedsign.md)

*Defined in [src/jws/flattened/sign.ts:56](https://github.com/panva/jose/blob/v3.1.0/src/jws/flattened/sign.ts#L56)*

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`payload` | Uint8Array | Binary representation of the payload to sign.  |

**Returns:** [FlattenedSign](_jws_flattened_sign_.flattenedsign.md)

## Methods

### setProtectedHeader

▸ **setProtectedHeader**(`protectedHeader`: [JWSHeaderParameters](../interfaces/_types_d_.jwsheaderparameters.md)): this

*Defined in [src/jws/flattened/sign.ts:70](https://github.com/panva/jose/blob/v3.1.0/src/jws/flattened/sign.ts#L70)*

Sets the JWS Protected Header on the FlattenedSign object.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`protectedHeader` | [JWSHeaderParameters](../interfaces/_types_d_.jwsheaderparameters.md) | JWS Protected Header.  |

**Returns:** this

___

### setUnprotectedHeader

▸ **setUnprotectedHeader**(`unprotectedHeader`: [JWSHeaderParameters](../interfaces/_types_d_.jwsheaderparameters.md)): this

*Defined in [src/jws/flattened/sign.ts:83](https://github.com/panva/jose/blob/v3.1.0/src/jws/flattened/sign.ts#L83)*

Sets the JWS Unprotected Header on the FlattenedSign object.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`unprotectedHeader` | [JWSHeaderParameters](../interfaces/_types_d_.jwsheaderparameters.md) | JWS Unprotected Header.  |

**Returns:** this

___

### sign

▸ **sign**(`key`: [KeyLike](../types/_types_d_.keylike.md)): Promise\<[FlattenedJWS](../interfaces/_types_d_.flattenedjws.md)>

*Defined in [src/jws/flattened/sign.ts:96](https://github.com/panva/jose/blob/v3.1.0/src/jws/flattened/sign.ts#L96)*

Signs and resolves the value of the Flattened JWS object.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`key` | [KeyLike](../types/_types_d_.keylike.md) | Private Key or Secret to sign the JWS with.  |

**Returns:** Promise\<[FlattenedJWS](../interfaces/_types_d_.flattenedjws.md)>
