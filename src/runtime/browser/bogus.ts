const bogusWebCrypto: [HmacImportParams, boolean, KeyUsage[]] = [
  { hash: 'SHA-256', name: 'HMAC' },
  true,
  ['sign'],
]

export default bogusWebCrypto
