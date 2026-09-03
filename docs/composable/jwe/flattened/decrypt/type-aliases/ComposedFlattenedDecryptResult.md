# Type Alias: ComposedFlattenedDecryptResult\<Factories\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

• **ComposedFlattenedDecryptResult**\<`Factories`\> = [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`FlattenedDecryptResult`](../../../../../types/interfaces/FlattenedDecryptResult.md), `"protectedHeader"` \| `"sharedUnprotectedHeader"` \| `"unprotectedHeader"`\>

A Flattened JWE decryption result with header suggestions from the selected algorithms.

## Type Declaration

### protectedHeader?

• `optional` **protectedHeader?**: [`ComposedJWEHeader`](../../encrypt/interfaces/ComposedJWEHeader.md)\<`Factories`\>

### sharedUnprotectedHeader?

• `optional` **sharedUnprotectedHeader?**: [`ComposedJWEHeader`](../../encrypt/interfaces/ComposedJWEHeader.md)\<`Factories`\>

### unprotectedHeader?

• `optional` **unprotectedHeader?**: [`ComposedJWEHeader`](../../encrypt/interfaces/ComposedJWEHeader.md)\<`Factories`\>

## Type Parameters

| Type Parameter |
| ------ |
| `Factories` *extends* [`JWEAlgorithmSelection`](../../../../../algorithms/jwe/type-aliases/JWEAlgorithmSelection.md) |
