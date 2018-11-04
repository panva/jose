const crypto = require('crypto')

Object.entries(crypto.generateKeyPairSync('ec', { namedCurve: 'P-384' }))
  .forEach(
    ([k, v]) => console.log(v.export({ format: 'pem', type: k === 'privateKey' ? 'pkcs8' : 'spki' }))
  )
