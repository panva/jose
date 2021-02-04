const bogusWebCrypto: [HmacImportParams, boolean, KeyUsage[]] = [
  { hash: { name: 'SHA-256' }, name: 'HMAC' },
  true,
  ['sign'],
]

export default bogusWebCrypto
