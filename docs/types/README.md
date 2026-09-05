# types

## Interfaces

| Interface | Description |
| ------ | ------ |
| [CompactDecryptResult](interfaces/CompactDecryptResult.md) | Compact JWE decryption result. |
| [CompactJWEHeaderParameters](interfaces/CompactJWEHeaderParameters.md) | Recognized Compact JWE Header Parameters; additional members may also be present. |
| [CompactJWSHeaderParameters](interfaces/CompactJWSHeaderParameters.md) | Recognized Compact JWS Header Parameters; additional members may also be present. |
| [CompactVerifyResult](interfaces/CompactVerifyResult.md) | Compact JWS verification result. |
| [CritOption](interfaces/CritOption.md) | Shared "crit" option for signing, verification, encryption, and decryption. |
| [CryptoKeyStructuralFallback](interfaces/CryptoKeyStructuralFallback.md) | Structural fallback used when the host [CryptoKey](https://developer.mozilla.org/docs/Web/API/CryptoKey) type cannot be inferred. |
| [DecryptOptions](interfaces/DecryptOptions.md) | JWE Decryption options. |
| [EncryptOptions](interfaces/EncryptOptions.md) | JWE Encryption options. |
| [FlattenedDecryptResult](interfaces/FlattenedDecryptResult.md) | Flattened JWE JSON Serialization decryption result. |
| [FlattenedJWE](interfaces/FlattenedJWE.md) | Flattened JWE JSON Serialization token. |
| [FlattenedJWS](interfaces/FlattenedJWS.md) | Flattened JWS JSON Serialization token. The payload is an empty string when the [unencoded payload option](https://www.rfc-editor.org/info/rfc7797/) is used. |
| [FlattenedJWSInput](interfaces/FlattenedJWSInput.md) | Flattened JWS verification input. |
| [FlattenedVerifyResult](interfaces/FlattenedVerifyResult.md) | Flattened JWS JSON Serialization verification result. |
| [GeneralDecryptResult](interfaces/GeneralDecryptResult.md) | General JWE JSON Serialization decryption result. |
| [GeneralJWE](interfaces/GeneralJWE.md) | General JWE JSON Serialization token. |
| [GeneralJWS](interfaces/GeneralJWS.md) | General JWS JSON Serialization token. The payload is an empty string when the [unencoded payload option](https://www.rfc-editor.org/info/rfc7797/) is used. |
| [GeneralJWSInput](interfaces/GeneralJWSInput.md) | General JWS verification input. |
| [GeneralVerifyResult](interfaces/GeneralVerifyResult.md) | General JWS JSON Serialization verification result. |
| [GetKeyFunction](interfaces/GetKeyFunction.md) | Dynamic key resolver for consuming operations. |
| [JoseHeaderParameters](interfaces/JoseHeaderParameters.md) | Header Parameters common to JWE and JWS. |
| [JSONWebKeySet](interfaces/JSONWebKeySet.md) | JSON Web Key Set. |
| [JWEHeaderParameters](interfaces/JWEHeaderParameters.md) | Recognized JWE Header Parameters; additional members may also be present. |
| [JWEKeyManagementHeaderParameters](interfaces/JWEKeyManagementHeaderParameters.md) | Recognized JWE Key Management-related Header Parameters. |
| [JWK\_AKP\_Private](interfaces/JWK_AKP_Private.md) | Convenience interface for private AKP JSON Web Keys. |
| [JWK\_AKP\_Public](interfaces/JWK_AKP_Public.md) | Convenience interface for public AKP JSON Web Keys. |
| [JWK\_EC\_Private](interfaces/JWK_EC_Private.md) | Convenience interface for private EC JSON Web Keys. |
| [JWK\_EC\_Public](interfaces/JWK_EC_Public.md) | Convenience interface for public EC JSON Web Keys. |
| [JWK\_oct](interfaces/JWK_oct.md) | Convenience interface for "oct" JSON Web Keys. |
| [JWK\_OKP\_Private](interfaces/JWK_OKP_Private.md) | Convenience interface for private OKP JSON Web Keys. |
| [JWK\_OKP\_Public](interfaces/JWK_OKP_Public.md) | Convenience interface for public OKP JSON Web Keys. |
| [JWK\_RSA\_Private](interfaces/JWK_RSA_Private.md) | Convenience interface for private RSA JSON Web Keys. |
| [JWK\_RSA\_Public](interfaces/JWK_RSA_Public.md) | Convenience interface for public RSA JSON Web Keys. |
| [JWSHeaderParameters](interfaces/JWSHeaderParameters.md) | Recognized JWS Header Parameters; additional members may also be present. |
| [JWTClaimVerificationOptions](interfaces/JWTClaimVerificationOptions.md) | JWT Claims Set verification options. |
| [JWTDecryptResult](interfaces/JWTDecryptResult.md) | Encrypted JSON Web Token (JWT) decryption result. |
| [JWTHeaderParameters](interfaces/JWTHeaderParameters.md) | Recognized signed JWT Header Parameters; additional members may also be present. |
| [JWTPayload](interfaces/JWTPayload.md) | Recognized JWT Claims Set members; additional members may also be present. |
| [JWTVerifyResult](interfaces/JWTVerifyResult.md) | Signed JSON Web Token (JWT) verification result. |
| [KeyObject](interfaces/KeyObject.md) | Node.js [KeyObject](https://nodejs.org/api/crypto.html#class-keyobject) representation accepted as key input. |
| [ProduceJWT](interfaces/ProduceJWT.md) | Shared fluent API for JWT-producing classes. |
| [ResolvedKey](interfaces/ResolvedKey.md) | Key resolver result metadata. |
| [SignOptions](interfaces/SignOptions.md) | JWS Signing options. |
| [VerifyOptions](interfaces/VerifyOptions.md) | JWS Verification options. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [AnyJWK](type-aliases/AnyJWK.md) | Discriminated union of supported JSON Web Key shapes, narrowed by the "kty" (Key Type) Parameter. |
| [CryptoKey](type-aliases/CryptoKey.md) | The runtime's Web Crypto [CryptoKey](https://developer.mozilla.org/docs/Web/API/CryptoKey) representation accepted as key input. |
| [JWK](type-aliases/JWK.md) | JSON Web Key ([JWK](https://www.rfc-editor.org/info/rfc7517/)). "RSA", "EC", "OKP", "AKP", and "oct" key types are supported. |
| [JWKParameters](type-aliases/JWKParameters.md) | Generic JSON Web Key Parameters. |
| [KeyInput](type-aliases/KeyInput.md) | Key or secret input accepted by all sign, verify, encrypt, and decrypt operations. |
