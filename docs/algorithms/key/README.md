# algorithms/key

Tree-shakeable key import and generation algorithm capability factories.

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [KeyAlgorithmFactory](type-aliases/KeyAlgorithmFactory.md) | A factory for one built-in key handling recipe. |
| [KeyAlgorithmName](type-aliases/KeyAlgorithmName.md) | Built-in JWA identifiers available from the key utility algorithm catalog. |
| [KeyImportAlgorithmFactory](type-aliases/KeyImportAlgorithmFactory.md) | An algorithm factory accepted by composable key import utilities. |
| [KeyImportAlgorithmSelection](type-aliases/KeyImportAlgorithmSelection.md) | A non-empty tuple of algorithm factories accepted by composable key import utilities. |
| [KeyPairAlgorithmFactory](type-aliases/KeyPairAlgorithmFactory.md) | An algorithm factory accepted by composable asymmetric key generation. |
| [KeyPairAlgorithmName](type-aliases/KeyPairAlgorithmName.md) | Built-in asymmetric identifiers available to composable key-pair generation. |
| [KeyPairAlgorithmSelection](type-aliases/KeyPairAlgorithmSelection.md) | A non-empty tuple of algorithm factories accepted by composable asymmetric key generation. |
| [SecretAlgorithmFactory](type-aliases/SecretAlgorithmFactory.md) | An algorithm factory accepted by composable symmetric secret generation. |
| [SecretAlgorithmName](type-aliases/SecretAlgorithmName.md) | Built-in symmetric identifiers available to composable secret generation. |
| [SecretAlgorithmSelection](type-aliases/SecretAlgorithmSelection.md) | A non-empty tuple of algorithm factories accepted by composable symmetric secret generation. |

## Variables

| Variable | Description |
| ------ | ------ |
| [A128CBC\_HS256](variables/A128CBC_HS256.md) | Creates the `A128CBC-HS256` key utility capability. |
| [A128GCM](variables/A128GCM.md) | Creates the `A128GCM` key utility capability. |
| [A128GCMKW](variables/A128GCMKW.md) | Creates the `A128GCMKW` key utility capability. |
| [A128KW](variables/A128KW.md) | Creates the `A128KW` key utility capability. |
| [A192CBC\_HS384](variables/A192CBC_HS384.md) | Creates the `A192CBC-HS384` key utility capability. |
| [A192GCM](variables/A192GCM.md) | Creates the `A192GCM` key utility capability. |
| [A192GCMKW](variables/A192GCMKW.md) | Creates the `A192GCMKW` key utility capability. |
| [A192KW](variables/A192KW.md) | Creates the `A192KW` key utility capability. |
| [A256CBC\_HS512](variables/A256CBC_HS512.md) | Creates the `A256CBC-HS512` key utility capability. |
| [A256GCM](variables/A256GCM.md) | Creates the `A256GCM` key utility capability. |
| [A256GCMKW](variables/A256GCMKW.md) | Creates the `A256GCMKW` key utility capability. |
| [A256KW](variables/A256KW.md) | Creates the `A256KW` key utility capability. |
| [dir](variables/dir.md) | Creates the `dir` key utility capability. |
| [ECDH\_ES](variables/ECDH_ES.md) | Creates the `ECDH-ES` key utility capability. |
| [ECDH\_ES\_A128KW](variables/ECDH_ES_A128KW.md) | Creates the `ECDH-ES+A128KW` key utility capability. |
| [ECDH\_ES\_A192KW](variables/ECDH_ES_A192KW.md) | Creates the `ECDH-ES+A192KW` key utility capability. |
| [ECDH\_ES\_A256KW](variables/ECDH_ES_A256KW.md) | Creates the `ECDH-ES+A256KW` key utility capability. |
| [Ed25519](variables/Ed25519.md) | Creates the `Ed25519` key utility capability. |
| [EdDSA](variables/EdDSA.md) | Creates the `EdDSA` key utility capability. |
| [ES256](variables/ES256.md) | Creates the `ES256` key utility capability. |
| [ES384](variables/ES384.md) | Creates the `ES384` key utility capability. |
| [ES512](variables/ES512.md) | Creates the `ES512` key utility capability. |
| [HS256](variables/HS256.md) | Creates the `HS256` key utility capability. |
| [HS384](variables/HS384.md) | Creates the `HS384` key utility capability. |
| [HS512](variables/HS512.md) | Creates the `HS512` key utility capability. |
| [ML\_DSA\_44](variables/ML_DSA_44.md) | Creates the `ML-DSA-44` key utility capability. |
| [ML\_DSA\_65](variables/ML_DSA_65.md) | Creates the `ML-DSA-65` key utility capability. |
| [ML\_DSA\_87](variables/ML_DSA_87.md) | Creates the `ML-DSA-87` key utility capability. |
| [PBES2\_HS256\_A128KW](variables/PBES2_HS256_A128KW.md) | Creates the `PBES2-HS256+A128KW` key utility capability. |
| [PBES2\_HS384\_A192KW](variables/PBES2_HS384_A192KW.md) | Creates the `PBES2-HS384+A192KW` key utility capability. |
| [PBES2\_HS512\_A256KW](variables/PBES2_HS512_A256KW.md) | Creates the `PBES2-HS512+A256KW` key utility capability. |
| [PS256](variables/PS256.md) | Creates the `PS256` key utility capability. |
| [PS384](variables/PS384.md) | Creates the `PS384` key utility capability. |
| [PS512](variables/PS512.md) | Creates the `PS512` key utility capability. |
| [RS256](variables/RS256.md) | Creates the `RS256` key utility capability. |
| [RS384](variables/RS384.md) | Creates the `RS384` key utility capability. |
| [RS512](variables/RS512.md) | Creates the `RS512` key utility capability. |
| [RSA\_OAEP](variables/RSA_OAEP.md) | Creates the `RSA-OAEP` key utility capability. |
| [RSA\_OAEP\_256](variables/RSA_OAEP_256.md) | Creates the `RSA-OAEP-256` key utility capability. |
| [RSA\_OAEP\_384](variables/RSA_OAEP_384.md) | Creates the `RSA-OAEP-384` key utility capability. |
| [RSA\_OAEP\_512](variables/RSA_OAEP_512.md) | Creates the `RSA-OAEP-512` key utility capability. |
