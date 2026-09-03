# Type Alias: SecretAlgorithmName

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

• **SecretAlgorithmName** = [`Extract`](https://www.typescriptlang.org/docs/handbook/utility-types.html#extracttype-union)\<[`JWSAlgorithmName`](../../jws/type-aliases/JWSAlgorithmName.md), `` `HS${string}` ``\> \| [`Extract`](https://www.typescriptlang.org/docs/handbook/utility-types.html#extracttype-union)\<[`JWEKeyManagementAlgorithmName`](../../jwe/type-aliases/JWEKeyManagementAlgorithmName.md), `` `A${number}KW` `` \| `` `A${number}GCMKW` ``\> \| [`JWEContentEncryptionAlgorithmName`](../../jwe/enc/type-aliases/JWEContentEncryptionAlgorithmName.md)

Built-in symmetric identifiers available to composable secret generation.
