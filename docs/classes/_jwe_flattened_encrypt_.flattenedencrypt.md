# Class: FlattenedEncrypt

The FlattenedEncrypt class is a utility for creating Flattened JWE
objects.

**`example`** 
```js
// ESM import
import FlattenedEncrypt from 'jose/jwe/flattened/encrypt'
```

**`example`** 
```js
// CJS import
const { default: FlattenedEncrypt } = require('jose/jwe/flattened/encrypt')
```

**`example`** 
```js
// usage
import parseJwk from 'jose/jwk/parse'

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

## Index

### Constructors

* [constructor](_jwe_flattened_encrypt_.flattenedencrypt.md#constructor)

### Methods

* [encrypt](_jwe_flattened_encrypt_.flattenedencrypt.md#encrypt)
* [setAdditionalAuthenticatedData](_jwe_flattened_encrypt_.flattenedencrypt.md#setadditionalauthenticateddata)
* [setContentEncryptionKey](_jwe_flattened_encrypt_.flattenedencrypt.md#setcontentencryptionkey)
* [setInitializationVector](_jwe_flattened_encrypt_.flattenedencrypt.md#setinitializationvector)
* [setKeyManagementParameters](_jwe_flattened_encrypt_.flattenedencrypt.md#setkeymanagementparameters)
* [setProtectedHeader](_jwe_flattened_encrypt_.flattenedencrypt.md#setprotectedheader)
* [setSharedUnprotectedHeader](_jwe_flattened_encrypt_.flattenedencrypt.md#setsharedunprotectedheader)
* [setUnprotectedHeader](_jwe_flattened_encrypt_.flattenedencrypt.md#setunprotectedheader)

## Constructors

### constructor

\+ **new FlattenedEncrypt**(`plaintext`: Uint8Array): [FlattenedEncrypt](_jwe_flattened_encrypt_.flattenedencrypt.md)

*Defined in [src/jwe/flattened/encrypt.ts:75](https://github.com/panva/jose/blob/v3.1.0/src/jwe/flattened/encrypt.ts#L75)*

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`plaintext` | Uint8Array | Binary representation of the plaintext to encrypt.  |

**Returns:** [FlattenedEncrypt](_jwe_flattened_encrypt_.flattenedencrypt.md)

## Methods

### encrypt

▸ **encrypt**(`key`: [KeyLike](../types/_types_d_.keylike.md), `options?`: [EncryptOptions](../interfaces/_types_d_.encryptoptions.md)): Promise\<[FlattenedJWE](../interfaces/_types_d_.flattenedjwe.md)>

*Defined in [src/jwe/flattened/encrypt.ts:187](https://github.com/panva/jose/blob/v3.1.0/src/jwe/flattened/encrypt.ts#L187)*

Encrypts and resolves the value of the Flattened JWE object.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`key` | [KeyLike](../types/_types_d_.keylike.md) | Public Key or Secret to encrypt the JWE with. |
`options?` | [EncryptOptions](../interfaces/_types_d_.encryptoptions.md) | JWE Encryption options.  |

**Returns:** Promise\<[FlattenedJWE](../interfaces/_types_d_.flattenedjwe.md)>

___

### setAdditionalAuthenticatedData

▸ **setAdditionalAuthenticatedData**(`aad`: Uint8Array): this

*Defined in [src/jwe/flattened/encrypt.ts:144](https://github.com/panva/jose/blob/v3.1.0/src/jwe/flattened/encrypt.ts#L144)*

Sets the Additional Authenticated Data on the FlattenedEncrypt object.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`aad` | Uint8Array | Additional Authenticated Data.  |

**Returns:** this

___

### setContentEncryptionKey

▸ **setContentEncryptionKey**(`cek`: Uint8Array): this

*Defined in [src/jwe/flattened/encrypt.ts:157](https://github.com/panva/jose/blob/v3.1.0/src/jwe/flattened/encrypt.ts#L157)*

Sets a content encryption key to use, by default a random suitable one
is generated for the JWE enc" (Encryption Algorithm) Header Parameter.
You do not need to invoke this method, it is only really intended for
test and vector validation purposes.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`cek` | Uint8Array | JWE Content Encryption Key.  |

**Returns:** this

___

### setInitializationVector

▸ **setInitializationVector**(`iv`: Uint8Array): this

*Defined in [src/jwe/flattened/encrypt.ts:173](https://github.com/panva/jose/blob/v3.1.0/src/jwe/flattened/encrypt.ts#L173)*

Sets the JWE Initialization Vector to use for content encryption, by default
a random suitable one is generated for the JWE enc" (Encryption Algorithm)
Header Parameter. You do not need to invoke this method, it is only really
intended for test and vector validation purposes.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`iv` | Uint8Array | JWE Initialization Vector.  |

**Returns:** this

___

### setKeyManagementParameters

▸ **setKeyManagementParameters**(`parameters`: [JWEKeyManagementHeaderParameters](../interfaces/_types_d_.jwekeymanagementheaderparameters.md)): this

*Defined in [src/jwe/flattened/encrypt.ts:92](https://github.com/panva/jose/blob/v3.1.0/src/jwe/flattened/encrypt.ts#L92)*

Sets the JWE Key Management parameters to be used when encrypting.
Use of this is method is really only needed for ECDH-ES based algorithms
when utilizing the Agreement PartyUInfo or Agreement PartyVInfo parameters.
Other parameters will always be randomly generated when needed and missing.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`parameters` | [JWEKeyManagementHeaderParameters](../interfaces/_types_d_.jwekeymanagementheaderparameters.md) | JWE Key Management parameters.  |

**Returns:** this

___

### setProtectedHeader

▸ **setProtectedHeader**(`protectedHeader`: [JWEHeaderParameters](../interfaces/_types_d_.jweheaderparameters.md)): this

*Defined in [src/jwe/flattened/encrypt.ts:105](https://github.com/panva/jose/blob/v3.1.0/src/jwe/flattened/encrypt.ts#L105)*

Sets the JWE Protected Header on the FlattenedEncrypt object.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`protectedHeader` | [JWEHeaderParameters](../interfaces/_types_d_.jweheaderparameters.md) | JWE Protected Header.  |

**Returns:** this

___

### setSharedUnprotectedHeader

▸ **setSharedUnprotectedHeader**(`sharedUnprotectedHeader`: [JWEHeaderParameters](../interfaces/_types_d_.jweheaderparameters.md)): this

*Defined in [src/jwe/flattened/encrypt.ts:118](https://github.com/panva/jose/blob/v3.1.0/src/jwe/flattened/encrypt.ts#L118)*

Sets the JWE Shared Unprotected Header on the FlattenedEncrypt object.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`sharedUnprotectedHeader` | [JWEHeaderParameters](../interfaces/_types_d_.jweheaderparameters.md) | JWE Shared Unprotected Header.  |

**Returns:** this

___

### setUnprotectedHeader

▸ **setUnprotectedHeader**(`unprotectedHeader`: [JWEHeaderParameters](../interfaces/_types_d_.jweheaderparameters.md)): this

*Defined in [src/jwe/flattened/encrypt.ts:131](https://github.com/panva/jose/blob/v3.1.0/src/jwe/flattened/encrypt.ts#L131)*

Sets the JWE Per-Recipient Unprotected Header on the FlattenedEncrypt object.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`unprotectedHeader` | [JWEHeaderParameters](../interfaces/_types_d_.jweheaderparameters.md) | JWE Per-Recipient Unprotected Header.  |

**Returns:** this
