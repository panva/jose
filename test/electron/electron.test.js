const test = require('ava')

if ('electron' in process.versions) {
  const crypto = require('crypto')

  const fixtures = require('../fixtures')

  ;['aes128', 'aes192', 'aes256'].forEach((cipher) => {
    test(`${cipher} is not supported`, t => {
      t.false(crypto.getCiphers().includes(cipher))
    })
  })

  test('secp256k1 is not supported', t => {
    t.false(crypto.getCurves().includes('secp256k1'))
  })

  const unsupported = process.versions.electron.startsWith('6') ? ['Ed448', 'X25519', 'X448'] : ['Ed448', 'X448']

  // crypto.generateKeyPair('x25519') crashes the process in 7.0.0, that's why X25519 is not enabled

  unsupported.forEach((okp) => {
    test(`${okp} is not supported`, t => {
      t.throws(() => {
        crypto.createPrivateKey(fixtures.PEM[okp].private)
      }, { instanceOf: Error, code: 'ERR_OSSL_EVP_UNSUPPORTED_ALGORITHM' })
    })
  })
}
