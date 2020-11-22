# Function: fromKeyLike

▸ **fromKeyLike**(`key`: [KeyLike](../types/_types_d_.keylike.md)): Promise\<[JWK](../interfaces/_types_d_.jwk.md)>

*Defined in [src/jwk/from_key_like.ts:32](https://github.com/panva/jose/blob/v3.1.0/src/jwk/from_key_like.ts#L32)*

Converts a runtime-specific key representation (KeyLike) to a JWK.

**`example`** 
```js
// ESM import
import fromKeyLike from 'jose/jwk/from_key_like'
```

**`example`** 
```js
// CJS import
const { default: fromKeyLike } = require('jose/jwk/from_key_like')
```

**`example`** 
```js
// usage
const privateJwk = fromKeyLike(privateKey)
const publicJwk = fromKeyLike(publicKey)

console.log(privateJwk)
console.log(publicJwk)
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`key` | [KeyLike](../types/_types_d_.keylike.md) | Key representation to transform to a JWK.  |

**Returns:** Promise\<[JWK](../interfaces/_types_d_.jwk.md)>
