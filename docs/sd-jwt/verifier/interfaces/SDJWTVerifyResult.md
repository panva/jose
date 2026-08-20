# Interface: SDJWTVerifyResult\<PayloadType\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Result of verifying a Compact serialized SD-JWT presentation.

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) | Type definition of the JWT Claims Set the SD-JWT is expected to carry. |

## Properties

### disclosures

• **disclosures**: [`SDJWTDisclosure`](../../holder/interfaces/SDJWTDisclosure.md)[]

Metadata for the Disclosures included in the presentation.

***

### payload

• **payload**: `PayloadType` & [`JWTPayload`](../../../types/interfaces/JWTPayload.md) & \[`PayloadType`\] *extends* \[`object`\] ? `unknown` : `unknown` *extends* `PayloadType` ? `PayloadType` : `never`

Processed SD-JWT Payload containing permanently disclosed claims and successfully presented
Disclosures, with `_sd` and `_sd_alg` removed.

***

### protectedHeader

• **protectedHeader**: [`JWTHeaderParameters`](../../../types/interfaces/JWTHeaderParameters.md)

Protected header of the successfully verified Issuer signature.

***

### keyBinding?

• `optional` **keyBinding?**: [`SDJWTKeyBindingVerifyResult`](SDJWTKeyBindingVerifyResult.md)

Verified Key Binding JWT metadata. Policy-specific verify overloads omit this property when
`keyBinding` is `false` and require it when a Key Binding policy object is passed.
