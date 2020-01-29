const test = require('ava')

const { errors } = require('../..')
const JWA = require('../../lib/jwa')
const JWK = require('../../lib/jwk')

;['sign', 'verify', 'keyManagementEncrypt', 'keyManagementDecrypt', 'encrypt', 'decrypt'].forEach((op) => {
  let label
  if (op.startsWith('keyManagement')) {
    label = `key management (${op.substr(13).toLowerCase()}ion)`
  }
  test(`JWA.${op} will not accept an "unimplemented" algorithm`, t => {
    t.throws(() => {
      JWA[op]('foo', JWK.generateSync('oct'))
    }, { instanceOf: errors.JOSENotSupported, code: 'ERR_JOSE_NOT_SUPPORTED', message: `unsupported ${label || op} alg: foo` })
  })
})
