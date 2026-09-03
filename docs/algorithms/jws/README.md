# algorithms/jws

Tree-shakeable JWS algorithm capability factories.

## Interfaces

| Interface | Description |
| ------ | ------ |
| [SelectedCompactJWSHeaderParameters](interfaces/SelectedCompactJWSHeaderParameters.md) | Compact JWS Header Parameters with selected `alg` identifiers suggested by editors. |
| [SelectedJWSHeaderParameters](interfaces/SelectedJWSHeaderParameters.md) | JWS Header Parameters with selected `alg` identifiers suggested by editors. |
| [SelectedJWTHeaderParameters](interfaces/SelectedJWTHeaderParameters.md) | JWT Header Parameters with selected `alg` identifiers suggested by editors. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [AsymmetricJWSAlgorithmFactory](type-aliases/AsymmetricJWSAlgorithmFactory.md) | A factory for one built-in asymmetric JWS algorithm capability. |
| [AsymmetricJWSAlgorithmName](type-aliases/AsymmetricJWSAlgorithmName.md) | Built-in asymmetric JWS `alg` identifiers available as composable factories. |
| [AsymmetricJWSAlgorithmSelection](type-aliases/AsymmetricJWSAlgorithmSelection.md) | A non-empty tuple of built-in asymmetric JWS algorithm factories. |
| [JWSAlgorithmFactory](type-aliases/JWSAlgorithmFactory.md) | Represents a factory for one built-in JWS algorithm capability. |
| [JWSAlgorithmName](type-aliases/JWSAlgorithmName.md) | Built-in JWS `alg` identifiers available as composable factories. |
| [JWSAlgorithmOf](type-aliases/JWSAlgorithmOf.md) | Extracts selected JWS `alg` identifiers from a factory tuple. |
| [JWSAlgorithmSelection](type-aliases/JWSAlgorithmSelection.md) | Represents a non-empty tuple of built-in JWS algorithm factories. |
| [JWSKeyInput](type-aliases/JWSKeyInput.md) | Direct key inputs accepted by a selected set of JWS algorithms. |
| [JWSResolvedKey](type-aliases/JWSResolvedKey.md) | Normalized keys returned after preparing a selected JWS algorithm's key input. |
| [SelectedJWSVerifyOptions](type-aliases/SelectedJWSVerifyOptions.md) | JWS verification options with selected algorithms suggested by editors. |

## Variables

| Variable | Description |
| ------ | ------ |
| [Ed25519](variables/Ed25519.md) | The `Ed25519` JWS algorithm capability factory. |
| [EdDSA](variables/EdDSA.md) | The `EdDSA` JWS algorithm capability factory. |
| [ES256](variables/ES256.md) | The `ES256` JWS algorithm capability factory. |
| [ES384](variables/ES384.md) | The `ES384` JWS algorithm capability factory. |
| [ES512](variables/ES512.md) | The `ES512` JWS algorithm capability factory. |
| [HS256](variables/HS256.md) | The `HS256` JWS algorithm capability factory. |
| [HS384](variables/HS384.md) | The `HS384` JWS algorithm capability factory. |
| [HS512](variables/HS512.md) | The `HS512` JWS algorithm capability factory. |
| [ML\_DSA\_44](variables/ML_DSA_44.md) | The `ML-DSA-44` JWS algorithm capability factory. |
| [ML\_DSA\_65](variables/ML_DSA_65.md) | The `ML-DSA-65` JWS algorithm capability factory. |
| [ML\_DSA\_87](variables/ML_DSA_87.md) | The `ML-DSA-87` JWS algorithm capability factory. |
| [PS256](variables/PS256.md) | The `PS256` JWS algorithm capability factory. |
| [PS384](variables/PS384.md) | The `PS384` JWS algorithm capability factory. |
| [PS512](variables/PS512.md) | The `PS512` JWS algorithm capability factory. |
| [RS256](variables/RS256.md) | The `RS256` JWS algorithm capability factory. |
| [RS384](variables/RS384.md) | The `RS384` JWS algorithm capability factory. |
| [RS512](variables/RS512.md) | The `RS512` JWS algorithm capability factory. |
