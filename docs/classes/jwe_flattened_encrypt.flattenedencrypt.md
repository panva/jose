# Class: FlattenedEncrypt

[jwe/flattened/encrypt](../modules/jwe_flattened_encrypt.md).FlattenedEncrypt

The FlattenedEncrypt class is a utility for creating Flattened JWE
objects.

**`example`** 
```js
// ESM import
import { FlattenedEncrypt } from 'jose/jwe/flattened/encrypt'
```

**`example`** 
```js
// CJS import
const { FlattenedEncrypt } = require('jose/jwe/flattened/encrypt')
```

**`example`** 
```js
// usage
import { parseJwk } from 'jose/jwk/parse'

const encoder = new TextEncoder()
const publicKey = await parseJwk({
  e: 'AQAB',
  n: 'qpzYkTGRKSUcd12hZaJnYEKVLfdEsqu6HBAxZgRSvzLFj_zTSAEXjbf3fX47MPEHRw8NDcEXPjVOz84t4FTXYF2w2_LGWfp_myjV8pR6oUUncJjS7DhnUmTG5bpuK2HFXRMRJYz_iNR48xRJPMoY84jrnhdIFx8Tqv6w4ZHVyEvcvloPgwG3UjLidP6jmqbTiJtidVLnpQJRuFNFQJiluQXBZ1nOLC7raQshu7L9y0IatVU7vf0BPnmuSkcNNvmQkSta6ODQBPaL5-o5SW8H37vQjPDkrlJpreViNa3jqP5DB5HYUO-DMh4FegRv9gZWLDEvXpSd9A13YXCa9Q8K_w',
  kty: 'RSA'
}, 'RSA-OAEP-256')

const jwe = await new FlattenedEncrypt(encoder.encode('It’s a dangerous business, Frodo, going out your door.'))
  .setProtectedHeader({ alg: 'RSA-OAEP-256', enc: 'A256GCM' })
  .setAdditionalAuthenticatedData(encoder.encode('The Fellowship of the Ring'))
  .encrypt(publicKey)

console.log(jwe)
```

## Table of contents

### Constructors

- [constructor](jwe_flattened_encrypt.flattenedencrypt.md#constructor)

### Methods

- [encrypt](jwe_flattened_encrypt.flattenedencrypt.md#encrypt)
- [setAdditionalAuthenticatedData](jwe_flattened_encrypt.flattenedencrypt.md#setadditionalauthenticateddata)
- [setContentEncryptionKey](jwe_flattened_encrypt.flattenedencrypt.md#setcontentencryptionkey)
- [setInitializationVector](jwe_flattened_encrypt.flattenedencrypt.md#setinitializationvector)
- [setKeyManagementParameters](jwe_flattened_encrypt.flattenedencrypt.md#setkeymanagementparameters)
- [setProtectedHeader](jwe_flattened_encrypt.flattenedencrypt.md#setprotectedheader)
- [setSharedUnprotectedHeader](jwe_flattened_encrypt.flattenedencrypt.md#setsharedunprotectedheader)
- [setUnprotectedHeader](jwe_flattened_encrypt.flattenedencrypt.md#setunprotectedheader)

## Constructors

### constructor

\+ **new FlattenedEncrypt**(`plaintext`: *Uint8Array*): [*FlattenedEncrypt*](jwe_flattened_encrypt.flattenedencrypt.md)

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`plaintext` | *Uint8Array* | Binary representation of the plaintext to encrypt.    |

**Returns:** [*FlattenedEncrypt*](jwe_flattened_encrypt.flattenedencrypt.md)

Defined in: [jwe/flattened/encrypt.ts:75](https://github.com/panva/jose/blob/v3.11.1/src/jwe/flattened/encrypt.ts#L75)

## Methods

### encrypt

▸ **encrypt**(`key`: [*KeyLike*](../types/types.keylike.md), `options?`: [*EncryptOptions*](../interfaces/types.encryptoptions.md)): *Promise*<[*FlattenedJWE*](../interfaces/types.flattenedjwe.md)\>

Encrypts and resolves the value of the Flattened JWE object.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`key` | [*KeyLike*](../types/types.keylike.md) | Public Key or Secret to encrypt the JWE with.   |
`options?` | [*EncryptOptions*](../interfaces/types.encryptoptions.md) | JWE Encryption options.    |

**Returns:** *Promise*<[*FlattenedJWE*](../interfaces/types.flattenedjwe.md)\>

Defined in: [jwe/flattened/encrypt.ts:187](https://github.com/panva/jose/blob/v3.11.1/src/jwe/flattened/encrypt.ts#L187)

___

### setAdditionalAuthenticatedData

▸ **setAdditionalAuthenticatedData**(`aad`: *Uint8Array*): [*FlattenedEncrypt*](jwe_flattened_encrypt.flattenedencrypt.md)

Sets the Additional Authenticated Data on the FlattenedEncrypt object.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`aad` | *Uint8Array* | Additional Authenticated Data.    |

**Returns:** [*FlattenedEncrypt*](jwe_flattened_encrypt.flattenedencrypt.md)

Defined in: [jwe/flattened/encrypt.ts:144](https://github.com/panva/jose/blob/v3.11.1/src/jwe/flattened/encrypt.ts#L144)

___

### setContentEncryptionKey

▸ **setContentEncryptionKey**(`cek`: *Uint8Array*): [*FlattenedEncrypt*](jwe_flattened_encrypt.flattenedencrypt.md)

Sets a content encryption key to use, by default a random suitable one
is generated for the JWE enc" (Encryption Algorithm) Header Parameter.
You do not need to invoke this method, it is only really intended for
test and vector validation purposes.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`cek` | *Uint8Array* | JWE Content Encryption Key.    |

**Returns:** [*FlattenedEncrypt*](jwe_flattened_encrypt.flattenedencrypt.md)

Defined in: [jwe/flattened/encrypt.ts:157](https://github.com/panva/jose/blob/v3.11.1/src/jwe/flattened/encrypt.ts#L157)

___

### setInitializationVector

▸ **setInitializationVector**(`iv`: *Uint8Array*): [*FlattenedEncrypt*](jwe_flattened_encrypt.flattenedencrypt.md)

Sets the JWE Initialization Vector to use for content encryption, by default
a random suitable one is generated for the JWE enc" (Encryption Algorithm)
Header Parameter. You do not need to invoke this method, it is only really
intended for test and vector validation purposes.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`iv` | *Uint8Array* | JWE Initialization Vector.    |

**Returns:** [*FlattenedEncrypt*](jwe_flattened_encrypt.flattenedencrypt.md)

Defined in: [jwe/flattened/encrypt.ts:173](https://github.com/panva/jose/blob/v3.11.1/src/jwe/flattened/encrypt.ts#L173)

___

### setKeyManagementParameters

▸ **setKeyManagementParameters**(`parameters`: [*JWEKeyManagementHeaderParameters*](../interfaces/types.jwekeymanagementheaderparameters.md)): [*FlattenedEncrypt*](jwe_flattened_encrypt.flattenedencrypt.md)

Sets the JWE Key Management parameters to be used when encrypting.
Use of this is method is really only needed for ECDH-ES based algorithms
when utilizing the Agreement PartyUInfo or Agreement PartyVInfo parameters.
Other parameters will always be randomly generated when needed and missing.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`parameters` | [*JWEKeyManagementHeaderParameters*](../interfaces/types.jwekeymanagementheaderparameters.md) | JWE Key Management parameters.    |

**Returns:** [*FlattenedEncrypt*](jwe_flattened_encrypt.flattenedencrypt.md)

Defined in: [jwe/flattened/encrypt.ts:92](https://github.com/panva/jose/blob/v3.11.1/src/jwe/flattened/encrypt.ts#L92)

___

### setProtectedHeader

▸ **setProtectedHeader**(`protectedHeader`: [*JWEHeaderParameters*](../interfaces/types.jweheaderparameters.md)): [*FlattenedEncrypt*](jwe_flattened_encrypt.flattenedencrypt.md)

Sets the JWE Protected Header on the FlattenedEncrypt object.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`protectedHeader` | [*JWEHeaderParameters*](../interfaces/types.jweheaderparameters.md) | JWE Protected Header.    |

**Returns:** [*FlattenedEncrypt*](jwe_flattened_encrypt.flattenedencrypt.md)

Defined in: [jwe/flattened/encrypt.ts:105](https://github.com/panva/jose/blob/v3.11.1/src/jwe/flattened/encrypt.ts#L105)

___

### setSharedUnprotectedHeader

▸ **setSharedUnprotectedHeader**(`sharedUnprotectedHeader`: [*JWEHeaderParameters*](../interfaces/types.jweheaderparameters.md)): [*FlattenedEncrypt*](jwe_flattened_encrypt.flattenedencrypt.md)

Sets the JWE Shared Unprotected Header on the FlattenedEncrypt object.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`sharedUnprotectedHeader` | [*JWEHeaderParameters*](../interfaces/types.jweheaderparameters.md) | JWE Shared Unprotected Header.    |

**Returns:** [*FlattenedEncrypt*](jwe_flattened_encrypt.flattenedencrypt.md)

Defined in: [jwe/flattened/encrypt.ts:118](https://github.com/panva/jose/blob/v3.11.1/src/jwe/flattened/encrypt.ts#L118)

___

### setUnprotectedHeader

▸ **setUnprotectedHeader**(`unprotectedHeader`: [*JWEHeaderParameters*](../interfaces/types.jweheaderparameters.md)): [*FlattenedEncrypt*](jwe_flattened_encrypt.flattenedencrypt.md)

Sets the JWE Per-Recipient Unprotected Header on the FlattenedEncrypt object.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`unprotectedHeader` | [*JWEHeaderParameters*](../interfaces/types.jweheaderparameters.md) | JWE Per-Recipient Unprotected Header.    |

**Returns:** [*FlattenedEncrypt*](jwe_flattened_encrypt.flattenedencrypt.md)

Defined in: [jwe/flattened/encrypt.ts:131](https://github.com/panva/jose/blob/v3.11.1/src/jwe/flattened/encrypt.ts#L131)
