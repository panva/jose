# Interface: FlattenedJWSInput

Flattened JWS definition for verify function inputs, allows payload as
Uint8Array for detached signature validation.

## Index

### Properties

* [header](_types_d_.flattenedjwsinput.md#header)
* [payload](_types_d_.flattenedjwsinput.md#payload)
* [protected](_types_d_.flattenedjwsinput.md#protected)
* [signature](_types_d_.flattenedjwsinput.md#signature)

## Properties

### header

• `Optional` **header**: [JWSHeaderParameters](_types_d_.jwsheaderparameters.md)

*Defined in [src/types.d.ts:106](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L106)*

The "header" member MUST be present and contain the value JWS
Unprotected Header when the JWS Unprotected Header value is non-
empty; otherwise, it MUST be absent.  This value is represented as
an unencoded JSON object, rather than as a string.  These Header
Parameter values are not integrity protected.

___

### payload

•  **payload**: string \| Uint8Array

*Defined in [src/types.d.ts:113](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L113)*

The "payload" member MUST be present and contain the value
BASE64URL(JWS Payload). When RFC7797 "b64": false is used
the value passed may also be a Uint8Array.

___

### protected

• `Optional` **protected**: string

*Defined in [src/types.d.ts:121](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L121)*

The "protected" member MUST be present and contain the value
BASE64URL(UTF8(JWS Protected Header)) when the JWS Protected
Header value is non-empty; otherwise, it MUST be absent.  These
Header Parameter values are integrity protected.

___

### signature

•  **signature**: string

*Defined in [src/types.d.ts:127](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L127)*

The "signature" member MUST be present and contain the value
BASE64URL(JWS Signature).
