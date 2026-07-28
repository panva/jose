# Type Alias: AnyJWK

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

• **AnyJWK** = [`JWK_EC_Private`](../interfaces/JWK_EC_Private.md) \| [`JWK_EC_Public`](../interfaces/JWK_EC_Public.md) \| [`JWK_RSA_Private`](../interfaces/JWK_RSA_Private.md) \| [`JWK_RSA_Public`](../interfaces/JWK_RSA_Public.md) \| [`JWK_OKP_Private`](../interfaces/JWK_OKP_Private.md) \| [`JWK_OKP_Public`](../interfaces/JWK_OKP_Public.md) \| [`JWK_AKP_Private`](../interfaces/JWK_AKP_Private.md) \| [`JWK_AKP_Public`](../interfaces/JWK_AKP_Public.md) \| [`JWK_oct`](../interfaces/JWK_oct.md)

Discriminated union of the JSON Web Key shapes supported by this module. Unlike [JWK](JWK.md), this
can be narrowed on the "kty" (Key Type) Parameter.

Each member is the convenience interface for one key type with its "kty" (Key Type) Parameter
required and fixed to that key type, rather than optional as the interface alone leaves it.

## Example

```ts
let jwk!: jose.AnyJWK

if (jwk.kty === 'EC') {
  console.log(jwk.crv, jwk.x, jwk.y)
}
```
