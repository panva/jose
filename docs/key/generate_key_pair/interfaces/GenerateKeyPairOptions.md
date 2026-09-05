# Interface: GenerateKeyPairOptions

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Asymmetric key pair generation options.

## Properties

### crv?

• `optional` **crv?**: `string`

EC curve or OKP key subtype. Must be supported by the algorithm and runtime. ECDH-ES defaults
to P-256.

***

### extractable?

• `optional` **extractable?**: `boolean`

Whether the private key is extractable. Defaults to false; the public key is always
extractable.

#### Example

```js
const { publicKey, privateKey } = await jose.generateKeyPair('PS256', {
  extractable: true,
})
console.log(await jose.exportJWK(privateKey))
console.log(await jose.exportPKCS8(privateKey))
```

***

### modulusLength?

• `optional` **modulusLength?**: `number`

RSA modulus length in bits. Must be an integer of at least 2048; defaults to 2048.
