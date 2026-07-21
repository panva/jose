# Interface: GeneralSDJWTVerifyResult\<PayloadType\>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Result of verifying a General JWS JSON serialized SD-JWT presentation.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `PayloadType` | [`JWTPayload`](../../../types/interfaces/JWTPayload.md) |

## Properties

### disclosures

• **disclosures**: [`SDJWTDisclosure`](../../holder/interfaces/SDJWTDisclosure.md)[]

Metadata for the Disclosures included in the presentation.

***

### payload

• **payload**: `PayloadType` & [`JWTPayload`](../../../types/interfaces/JWTPayload.md)

Processed SD-JWT Payload containing permanently disclosed claims and successfully presented
Disclosures, with `_sd` and `_sd_alg` removed.

***

### keyBinding?

• `optional` **keyBinding?**: [`SDJWTKeyBindingVerifyResult`](SDJWTKeyBindingVerifyResult.md)

Verified Key Binding JWT metadata. Policy-specific verify overloads omit this property when
`keyBinding` is `false` and require it when a Key Binding policy object is passed.

***

### protectedHeader?

• `optional` **protectedHeader?**: [`JWSHeaderParameters`](../../../types/interfaces/JWSHeaderParameters.md)

Protected header of the successfully verified Issuer signature, if present.

***

### unprotectedHeader?

• `optional` **unprotectedHeader?**: [`JWSHeaderParameters`](../../../types/interfaces/JWSHeaderParameters.md)

Unprotected header of the successfully verified Issuer signature, if present. Except for the
RFC 9901 transport parameters whose contents are validated separately, its members are not
integrity protected and must not drive security decisions.
