const test = require('ava')

const { errors } = require('../..')
const JWA = require('../../lib/jwa')

;['sign', 'verify', 'wrapKey', 'unwrapKey', 'encrypt', 'decrypt'].forEach((op) => {
  test(`JWA.${op} will not accept an "unimplemented" algorithm`, t => {
    t.throws(() => {
      JWA[op]('foo')
    }, { instanceOf: errors.JOSENotSupported, code: 'ERR_JOSE_NOT_SUPPORTED', message: `unsupported ${op} alg: foo` })
  })
})
