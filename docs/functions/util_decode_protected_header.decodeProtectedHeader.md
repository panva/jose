# Function: decodeProtectedHeader

▸ **decodeProtectedHeader**(`token`): [`ProtectedHeaderParameters`](../types/util_decode_protected_header.ProtectedHeaderParameters.md)

Decodes the Protected Header of a JWE/JWS/JWT token utilizing any JOSE serialization.

**`example`** Usage
```js
const protectedHeader = decodeProtectedHeader(token)
console.log(protectedHeader)
```

**`example`** ESM import
```js
import { decodeProtectedHeader } from 'jose'
```

**`example`** CJS import
```js
const { decodeProtectedHeader } = require('jose')
```

**`example`** Deno import
```js
import { decodeProtectedHeader } from 'https://deno.land/x/jose@v4.0.1/index.ts'
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `token` | `string` \| `object` | JWE/JWS/JWT token in any JOSE serialization. |

#### Returns

[`ProtectedHeaderParameters`](../types/util_decode_protected_header.ProtectedHeaderParameters.md)
