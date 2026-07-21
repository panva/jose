# Interface: SDJWTHolderKeyResolver()

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Resolves confirmation methods other than `cnf.jwk`.

▸ **SDJWTHolderKeyResolver**(`protectedHeader`, `token`, `confirmation`, `sdJwtPayload`): [`SDJWTHolderVerificationKey`](../type-aliases/SDJWTHolderVerificationKey.md) \| [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`SDJWTHolderVerificationKey`](../type-aliases/SDJWTHolderVerificationKey.md)\>

Resolves confirmation methods other than `cnf.jwk`.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `protectedHeader` | [`JWTHeaderParameters`](../../../types/interfaces/JWTHeaderParameters.md) |
| `token` | [`FlattenedJWSInput`](../../../types/interfaces/FlattenedJWSInput.md) |
| `confirmation` | [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, `unknown`\> |
| `sdJwtPayload` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) |

## Returns

[`SDJWTHolderVerificationKey`](../type-aliases/SDJWTHolderVerificationKey.md) \| [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`SDJWTHolderVerificationKey`](../type-aliases/SDJWTHolderVerificationKey.md)\>
