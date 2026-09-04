# types

## Interfaces

| Interface | Description |
| ------ | ------ |
| [CompactDecryptResult](interfaces/CompactDecryptResult.md) | Compact JWE decryption result |
| [CompactJWEHeaderParameters](interfaces/CompactJWEHeaderParameters.md) | Recognized Compact JWE Header Parameters, any other Header Members may also be present. |
| [CompactJWSHeaderParameters](interfaces/CompactJWSHeaderParameters.md) | Recognized Compact JWS Header Parameters, any other Header Members may also be present. |
| [CompactVerifyResult](interfaces/CompactVerifyResult.md) | Compact JWS verification result |
| [CritOption](interfaces/CritOption.md) | Shared Interface with a "crit" property for all sign, verify, encrypt and decrypt operations. |
| [CryptoKeyStructuralFallback](interfaces/CryptoKeyStructuralFallback.md) | Used as [CryptoKey](type-aliases/CryptoKey.md) when the host runtime's `crypto` global is not exposed on `typeof globalThis`, including when it is absent from ambient types or declared with `const` or `let`. It remains structurally compatible with host [CryptoKey](https://developer.mozilla.org/docs/Web/API/CryptoKey) declarations so values flow freely to and from [SubtleCrypto](https://developer.mozilla.org/docs/Web/API/SubtleCrypto) APIs. |
| [DecryptOptions](interfaces/DecryptOptions.md) | JWE Decryption options. |
| [EncryptOptions](interfaces/EncryptOptions.md) | JWE Encryption options. |
| [FlattenedDecryptResult](interfaces/FlattenedDecryptResult.md) | Flattened JWE JSON Serialization Syntax decryption result |
| [FlattenedJWE](interfaces/FlattenedJWE.md) | Flattened JWE JSON Serialization Syntax token. |
| [FlattenedJWS](interfaces/FlattenedJWS.md) | Flattened JWS JSON Serialization Syntax token. Payload is returned as an empty string when JWS Unencoded Payload ([RFC7797](https://www.rfc-editor.org/info/rfc7797/)) is used. |
| [FlattenedJWSInput](interfaces/FlattenedJWSInput.md) | Flattened JWS definition for verify function inputs, allows payload as [Uint8Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) for detached signature validation. |
| [FlattenedVerifyResult](interfaces/FlattenedVerifyResult.md) | Flattened JWS JSON Serialization Syntax verification result |
| [GeneralDecryptResult](interfaces/GeneralDecryptResult.md) | General JWE JSON Serialization Syntax decryption result |
| [GeneralJWE](interfaces/GeneralJWE.md) | General JWE JSON Serialization Syntax token. |
| [GeneralJWS](interfaces/GeneralJWS.md) | General JWS JSON Serialization Syntax token. Payload is returned as an empty string when JWS Unencoded Payload ([RFC7797](https://www.rfc-editor.org/info/rfc7797/)) is used. |
| [GeneralJWSInput](interfaces/GeneralJWSInput.md) | General JWS definition for verify function inputs, allows payload as [Uint8Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) for detached signature validation. |
| [GeneralVerifyResult](interfaces/GeneralVerifyResult.md) | General JWS JSON Serialization Syntax verification result |
| [GetKeyFunction](interfaces/GetKeyFunction.md) | Interface for consuming operations dynamic key resolution. |
| [JoseHeaderParameters](interfaces/JoseHeaderParameters.md) | Header Parameters common to JWE and JWS |
| [JSONWebKeySet](interfaces/JSONWebKeySet.md) | JSON Web Key Set |
| [JWEHeaderParameters](interfaces/JWEHeaderParameters.md) | Recognized JWE Header Parameters, any other Header members may also be present. |
| [JWEKeyManagementHeaderParameters](interfaces/JWEKeyManagementHeaderParameters.md) | Recognized JWE Key Management-related Header Parameters. |
| [JWK\_AKP\_Private](interfaces/JWK_AKP_Private.md) | Convenience interface for Private AKP JSON Web Keys |
| [JWK\_AKP\_Public](interfaces/JWK_AKP_Public.md) | Convenience interface for Public AKP JSON Web Keys |
| [JWK\_EC\_Private](interfaces/JWK_EC_Private.md) | Convenience interface for Private EC JSON Web Keys |
| [JWK\_EC\_Public](interfaces/JWK_EC_Public.md) | Convenience interface for Public EC JSON Web Keys |
| [JWK\_oct](interfaces/JWK_oct.md) | Convenience interface for oct JSON Web Keys |
| [JWK\_OKP\_Private](interfaces/JWK_OKP_Private.md) | Convenience interface for Private OKP JSON Web Keys |
| [JWK\_OKP\_Public](interfaces/JWK_OKP_Public.md) | Convenience interface for Public OKP JSON Web Keys |
| [JWK\_RSA\_Private](interfaces/JWK_RSA_Private.md) | Convenience interface for Private RSA JSON Web Keys |
| [JWK\_RSA\_Public](interfaces/JWK_RSA_Public.md) | Convenience interface for Public RSA JSON Web Keys |
| [JWSHeaderParameters](interfaces/JWSHeaderParameters.md) | Recognized JWS Header Parameters, any other Header Members may also be present. |
| [JWTClaimVerificationOptions](interfaces/JWTClaimVerificationOptions.md) | JWT Claims Set verification options. |
| [JWTDecryptResult](interfaces/JWTDecryptResult.md) | Encrypted JSON Web Token (JWT) decryption result |
| [JWTHeaderParameters](interfaces/JWTHeaderParameters.md) | Recognized Signed JWT Header Parameters, any other Header Members may also be present. |
| [JWTPayload](interfaces/JWTPayload.md) | Recognized JWT Claims Set members, any other members may also be present. |
| [JWTVerifyResult](interfaces/JWTVerifyResult.md) | Signed JSON Web Token (JWT) verification result |
| [KeyObject](interfaces/KeyObject.md) | [KeyObject](https://nodejs.org/api/crypto.html#class-keyobject) is a representation of a key/secret available in the Node.js runtime. You may use the Node.js runtime APIs [createPublicKey](https://nodejs.org/api/crypto.html#cryptocreatepublickeykey), [createPrivateKey](https://nodejs.org/api/crypto.html#cryptocreateprivatekeykey), and [createSecretKey](https://nodejs.org/api/crypto.html#cryptocreatesecretkeykey-encoding) to obtain a [KeyObject](https://nodejs.org/api/crypto.html#class-keyobject) from your existing key material. |
| [ProduceJWT](interfaces/ProduceJWT.md) | Generic interface for JWT producing classes. |
| [ResolvedKey](interfaces/ResolvedKey.md) | When key resolver functions are used this becomes part of successful resolves |
| [SignOptions](interfaces/SignOptions.md) | JWS Signing options. |
| [VerifyOptions](interfaces/VerifyOptions.md) | JWS Verification options. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [AnyJWK](type-aliases/AnyJWK.md) | Discriminated union of the JSON Web Key shapes supported by this module. Unlike [JWK](type-aliases/JWK.md), each member requires and fixes the "kty" (Key Type) Parameter to its key type so that the union can be narrowed on it. |
| [CryptoKey](type-aliases/CryptoKey.md) | [CryptoKey](https://developer.mozilla.org/docs/Web/API/CryptoKey) is a representation of a key/secret available in all supported runtimes. In addition to the [Key Import Functions](../key/import/README.md) you may use the [SubtleCrypto.importKey](https://developer.mozilla.org/docs/Web/API/SubtleCrypto/importKey) API to obtain a [CryptoKey](https://developer.mozilla.org/docs/Web/API/CryptoKey) from your existing key material. |
| [JWK](type-aliases/JWK.md) | JSON Web Key ([JWK](https://www.rfc-editor.org/info/rfc7517/)). "RSA", "EC", "OKP", "AKP", and "oct" key types are supported. |
| [JWKParameters](type-aliases/JWKParameters.md) | Generic JSON Web Key Parameters. |
| [KeyInput](type-aliases/KeyInput.md) | Key or secret input accepted by all sign, verify, encrypt, and decrypt operations. |
