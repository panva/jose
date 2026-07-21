# Interface: SDJWTDisclosure

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Metadata for a Disclosure available to a Holder or processed by a Verifier.

## Properties

### digest

• **digest**: `string`

Base64url-encoded digest of this Disclosure referenced from the Issuer-signed JWT. This is
metadata, not a selector; use [path](#path) when choosing a Disclosure.

***

### path

• **path**: `string`

RFC 6901 JSON Pointer locating this Disclosure's value in the processed payload returned by the
same operation. Credential paths can be passed to `credential.present()`. Selecting a nested
Disclosure also presents its recursively disclosed parents.

Array indices describe the processed payload. They can therefore change in Verifier results
when earlier selectively disclosable elements are not presented. For example, presenting only
the Disclosure at credential path `/items/1` can produce Verifier metadata at `/items/0`.

#### Example

**Inspect and select an available Disclosure**

```js
const street = credential.disclosures.find(({ path }) => path === '/address/street')
if (street) {
  const presentation = await credential.present([street.path])
}
```

***

### value

• **value**: `unknown`

Value at [path](#path) after recursively applying the Disclosures processed by the same
operation. A disclosed container can include revealed descendants and omit unrevealed ones.

***

### key?

• `optional` **key?**: `string`

Object member name for an object-property Disclosure. This is absent for array-element
Disclosures and is not unique; use [path](#path) to locate or select a Disclosure.
