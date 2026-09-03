# Type Alias: ComposedDecryptOptions\<Factories\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

• **ComposedDecryptOptions**\<`Factories`\> = [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`DecryptOptions`](../../../../types/interfaces/DecryptOptions.md), `"keyManagementAlgorithms"` \| `"contentEncryptionAlgorithms"`\>

JWE decrypt options with IntelliSense for the algorithms supplied to a composer.

## Type Declaration

### contentEncryptionAlgorithms?

• `optional` **contentEncryptionAlgorithms?**: readonly `string`[]

### keyManagementAlgorithms?

• `optional` **keyManagementAlgorithms?**: readonly `string`[]

## Type Parameters

| Type Parameter |
| ------ |
| `Factories` *extends* [`JWEAlgorithmSelection`](../../../../algorithms/jwe/type-aliases/JWEAlgorithmSelection.md) |
