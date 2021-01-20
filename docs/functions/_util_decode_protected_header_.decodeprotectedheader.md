# Function: decodeProtectedHeader

▸ **decodeProtectedHeader**(`token`: string \| object): [ProtectedHeaderParameters](../types/_util_decode_protected_header_.protectedheaderparameters.md)

*Defined in [src/util/decode_protected_header.ts:34](https://github.com/panva/jose/blob/v3.5.3/src/util/decode_protected_header.ts#L34)*

Decodes the Protected Header of a JWE/JWS/JWT token utilizing any JOSE serialization.

**`example`** 
```js
// ESM import
import decodeProtectedHeader from 'jose/util/decode_protected_header'
```

**`example`** 
```js
// CJS import
const { default: decodeProtectedHeader } = require('jose/util/decode_protected_header')
```

**`example`** 
```js
// usage
const protectedHeader = decodeProtectedHeader(token)
console.log(protectedHeader)
```

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`token` | string \| object | JWE/JWS/JWT token in any JOSE serialization.  |

**Returns:** [ProtectedHeaderParameters](../types/_util_decode_protected_header_.protectedheaderparameters.md)
