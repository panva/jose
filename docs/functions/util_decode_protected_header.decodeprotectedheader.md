# Function: decodeProtectedHeader

[util/decode_protected_header](../modules/util_decode_protected_header.md).decodeProtectedHeader

▸ **decodeProtectedHeader**(`token`: *string* \| *object*): [*ProtectedHeaderParameters*](../types/util_decode_protected_header.protectedheaderparameters.md)

Decodes the Protected Header of a JWE/JWS/JWT token utilizing any JOSE serialization.

**`example`** ESM import
```js
import { decodeProtectedHeader } from 'jose/util/decode_protected_header'
```

**`example`** CJS import
```js
const { decodeProtectedHeader } = require('jose/util/decode_protected_header')
```

**`example`** Usage
```js
const protectedHeader = decodeProtectedHeader(token)
console.log(protectedHeader)
```

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `token` | *string* \| *object* | JWE/JWS/JWT token in any JOSE serialization. |

**Returns:** [*ProtectedHeaderParameters*](../types/util_decode_protected_header.protectedheaderparameters.md)

Defined in: [util/decode_protected_header.ts:31](https://github.com/panva/jose/blob/v3.11.6/src/util/decode_protected_header.ts#L31)
