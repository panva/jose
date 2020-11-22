# Class: CompactSign

The CompactSign class is a utility for creating Compact JWS strings.

**`example`** 
```js
// ESM import
import CompactSign from 'jose/jws/compact/sign'
```

**`example`** 
```js
// CJS import
const { default: CompactSign } = require('jose/jws/compact/sign')
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

const jws = await new CompactSign(encoder.encode('It’s a dangerous business, Frodo, going out your door.'))
  .setProtectedHeader({ alg: 'ES256' })
  .sign(privateKey)

console.log(jws)
```

## Index

### Constructors

* [constructor](_jws_compact_sign_.compactsign.md#constructor)

### Methods

* [setProtectedHeader](_jws_compact_sign_.compactsign.md#setprotectedheader)
* [sign](_jws_compact_sign_.compactsign.md#sign)

## Constructors

### constructor

\+ **new CompactSign**(`payload`: Uint8Array): [CompactSign](_jws_compact_sign_.compactsign.md)

*Defined in [src/jws/compact/sign.ts:44](https://github.com/panva/jose/blob/v3.1.0/src/jws/compact/sign.ts#L44)*

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`payload` | Uint8Array | Binary representation of the payload to sign.  |

**Returns:** [CompactSign](_jws_compact_sign_.compactsign.md)

## Methods

### setProtectedHeader

▸ **setProtectedHeader**(`protectedHeader`: [JWSHeaderParameters](../interfaces/_types_d_.jwsheaderparameters.md)): this

*Defined in [src/jws/compact/sign.ts:58](https://github.com/panva/jose/blob/v3.1.0/src/jws/compact/sign.ts#L58)*

Sets the JWS Protected Header on the Sign object.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`protectedHeader` | [JWSHeaderParameters](../interfaces/_types_d_.jwsheaderparameters.md) | JWS Protected Header.  |

**Returns:** this

___

### sign

▸ **sign**(`key`: [KeyLike](../types/_types_d_.keylike.md)): Promise\<string>

*Defined in [src/jws/compact/sign.ts:68](https://github.com/panva/jose/blob/v3.1.0/src/jws/compact/sign.ts#L68)*

Signs and resolves the value of the Compact JWS string.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`key` | [KeyLike](../types/_types_d_.keylike.md) | Private Key or Secret to sign the JWS with.  |

**Returns:** Promise\<string>
