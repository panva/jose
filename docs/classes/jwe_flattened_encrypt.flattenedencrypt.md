# Class: FlattenedEncrypt

[jwe/flattened/encrypt](../modules/jwe_flattened_encrypt.md).FlattenedEncrypt

The FlattenedEncrypt class is a utility for creating Flattened JWE
objects.

**`example`** ESM import
```js
import { FlattenedEncrypt } from 'jose/jwe/flattened/encrypt'
```

**`example`** CJS import
```js
const { FlattenedEncrypt } = require('jose/jwe/flattened/encrypt')
```

**`example`** Usage
```js
const encoder = new TextEncoder()

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

Defined in: [jwe/flattened/encrypt.ts:65](https://github.com/panva/jose/blob/v3.11.5/src/jwe/flattened/encrypt.ts#L65)

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

Defined in: [jwe/flattened/encrypt.ts:177](https://github.com/panva/jose/blob/v3.11.5/src/jwe/flattened/encrypt.ts#L177)

___

### setAdditionalAuthenticatedData

▸ **setAdditionalAuthenticatedData**(`aad`: *Uint8Array*): [*FlattenedEncrypt*](jwe_flattened_encrypt.flattenedencrypt.md)

Sets the Additional Authenticated Data on the FlattenedEncrypt object.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`aad` | *Uint8Array* | Additional Authenticated Data.    |

**Returns:** [*FlattenedEncrypt*](jwe_flattened_encrypt.flattenedencrypt.md)

Defined in: [jwe/flattened/encrypt.ts:134](https://github.com/panva/jose/blob/v3.11.5/src/jwe/flattened/encrypt.ts#L134)

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

Defined in: [jwe/flattened/encrypt.ts:147](https://github.com/panva/jose/blob/v3.11.5/src/jwe/flattened/encrypt.ts#L147)

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

Defined in: [jwe/flattened/encrypt.ts:163](https://github.com/panva/jose/blob/v3.11.5/src/jwe/flattened/encrypt.ts#L163)

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

Defined in: [jwe/flattened/encrypt.ts:82](https://github.com/panva/jose/blob/v3.11.5/src/jwe/flattened/encrypt.ts#L82)

___

### setProtectedHeader

▸ **setProtectedHeader**(`protectedHeader`: [*JWEHeaderParameters*](../interfaces/types.jweheaderparameters.md)): [*FlattenedEncrypt*](jwe_flattened_encrypt.flattenedencrypt.md)

Sets the JWE Protected Header on the FlattenedEncrypt object.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`protectedHeader` | [*JWEHeaderParameters*](../interfaces/types.jweheaderparameters.md) | JWE Protected Header.    |

**Returns:** [*FlattenedEncrypt*](jwe_flattened_encrypt.flattenedencrypt.md)

Defined in: [jwe/flattened/encrypt.ts:95](https://github.com/panva/jose/blob/v3.11.5/src/jwe/flattened/encrypt.ts#L95)

___

### setSharedUnprotectedHeader

▸ **setSharedUnprotectedHeader**(`sharedUnprotectedHeader`: [*JWEHeaderParameters*](../interfaces/types.jweheaderparameters.md)): [*FlattenedEncrypt*](jwe_flattened_encrypt.flattenedencrypt.md)

Sets the JWE Shared Unprotected Header on the FlattenedEncrypt object.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`sharedUnprotectedHeader` | [*JWEHeaderParameters*](../interfaces/types.jweheaderparameters.md) | JWE Shared Unprotected Header.    |

**Returns:** [*FlattenedEncrypt*](jwe_flattened_encrypt.flattenedencrypt.md)

Defined in: [jwe/flattened/encrypt.ts:108](https://github.com/panva/jose/blob/v3.11.5/src/jwe/flattened/encrypt.ts#L108)

___

### setUnprotectedHeader

▸ **setUnprotectedHeader**(`unprotectedHeader`: [*JWEHeaderParameters*](../interfaces/types.jweheaderparameters.md)): [*FlattenedEncrypt*](jwe_flattened_encrypt.flattenedencrypt.md)

Sets the JWE Per-Recipient Unprotected Header on the FlattenedEncrypt object.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`unprotectedHeader` | [*JWEHeaderParameters*](../interfaces/types.jweheaderparameters.md) | JWE Per-Recipient Unprotected Header.    |

**Returns:** [*FlattenedEncrypt*](jwe_flattened_encrypt.flattenedencrypt.md)

Defined in: [jwe/flattened/encrypt.ts:121](https://github.com/panva/jose/blob/v3.11.5/src/jwe/flattened/encrypt.ts#L121)
