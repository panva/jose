# Class: CompactEncrypt

The CompactEncrypt class is a utility for creating Compact JWE strings.

**`example`** 
```js
// ESM import
import CompactEncrypt from 'jose/jwe/compact/encrypt'
```

**`example`** 
```js
// CJS import
const { default: CompactEncrypt } = require('jose/jwe/compact/encrypt')
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

const jwe = await new CompactEncrypt(encoder.encode('It’s a dangerous business, Frodo, going out your door.'))
  .setProtectedHeader({ alg: 'RSA-OAEP-256', enc: 'A256GCM' })
  .encrypt(publicKey)

console.log(jwe)
```

## Index

### Constructors

* [constructor](_jwe_compact_encrypt_.compactencrypt.md#constructor)

### Methods

* [encrypt](_jwe_compact_encrypt_.compactencrypt.md#encrypt)
* [setContentEncryptionKey](_jwe_compact_encrypt_.compactencrypt.md#setcontentencryptionkey)
* [setInitializationVector](_jwe_compact_encrypt_.compactencrypt.md#setinitializationvector)
* [setKeyManagementParameters](_jwe_compact_encrypt_.compactencrypt.md#setkeymanagementparameters)
* [setProtectedHeader](_jwe_compact_encrypt_.compactencrypt.md#setprotectedheader)

## Constructors

### constructor

\+ **new CompactEncrypt**(`plaintext`: Uint8Array): [CompactEncrypt](_jwe_compact_encrypt_.compactencrypt.md)

*Defined in [src/jwe/compact/encrypt.ts:45](https://github.com/panva/jose/blob/v3.1.0/src/jwe/compact/encrypt.ts#L45)*

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`plaintext` | Uint8Array | Binary representation of the plaintext to encrypt.  |

**Returns:** [CompactEncrypt](_jwe_compact_encrypt_.compactencrypt.md)

## Methods

### encrypt

▸ **encrypt**(`key`: [KeyLike](../types/_types_d_.keylike.md), `options?`: [EncryptOptions](../interfaces/_types_d_.encryptoptions.md)): Promise\<string>

*Defined in [src/jwe/compact/encrypt.ts:108](https://github.com/panva/jose/blob/v3.1.0/src/jwe/compact/encrypt.ts#L108)*

Encrypts and resolves the value of the Compact JWE string.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`key` | [KeyLike](../types/_types_d_.keylike.md) | Public Key or Secret to encrypt the JWE with. |
`options?` | [EncryptOptions](../interfaces/_types_d_.encryptoptions.md) | JWE Encryption options.  |

**Returns:** Promise\<string>

___

### setContentEncryptionKey

▸ **setContentEncryptionKey**(`cek`: Uint8Array): this

*Defined in [src/jwe/compact/encrypt.ts:62](https://github.com/panva/jose/blob/v3.1.0/src/jwe/compact/encrypt.ts#L62)*

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

*Defined in [src/jwe/compact/encrypt.ts:75](https://github.com/panva/jose/blob/v3.1.0/src/jwe/compact/encrypt.ts#L75)*

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

*Defined in [src/jwe/compact/encrypt.ts:97](https://github.com/panva/jose/blob/v3.1.0/src/jwe/compact/encrypt.ts#L97)*

Sets the JWE Key Management parameters to be used when encrypting the Content
Encryption Key. You do not need to invoke this method, it is only really
intended for test and vector validation purposes.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`parameters` | [JWEKeyManagementHeaderParameters](../interfaces/_types_d_.jwekeymanagementheaderparameters.md) | JWE Key Management parameters.  |

**Returns:** this

___

### setProtectedHeader

▸ **setProtectedHeader**(`protectedHeader`: [JWEHeaderParameters](../interfaces/_types_d_.jweheaderparameters.md)): this

*Defined in [src/jwe/compact/encrypt.ts:85](https://github.com/panva/jose/blob/v3.1.0/src/jwe/compact/encrypt.ts#L85)*

Sets the JWE Protected Header on the CompactEncrypt object.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`protectedHeader` | [JWEHeaderParameters](../interfaces/_types_d_.jweheaderparameters.md) | JWE Protected Header object.  |

**Returns:** this
