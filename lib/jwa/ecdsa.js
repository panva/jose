const { sign: signOneShot, verify: verifyOneShot, createSign, createVerify, getCurves } = require('crypto')

const { derToJose, joseToDer } = require('../help/ecdsa_signatures')
const { KEYOBJECT } = require('../help/consts')
const resolveNodeAlg = require('../help/node_alg')
const { asInput } = require('../help/key_object')
const { dsaEncodingSupported } = require('../help/runtime_support')
const { name: secp256k1 } = require('../jwk/key/secp256k1_crv')

let sign, verify

if (dsaEncodingSupported) {
  sign = (jwaAlg, nodeAlg, { [KEYOBJECT]: keyObject }, payload) => {
    if (typeof payload === 'string') {
      payload = Buffer.from(payload)
    }
    return signOneShot(nodeAlg, payload, { key: asInput(keyObject, false), dsaEncoding: 'ieee-p1363' })
  }
  verify = (jwaAlg, nodeAlg, { [KEYOBJECT]: keyObject }, payload, signature) => {
    try {
      return verifyOneShot(nodeAlg, payload, { key: asInput(keyObject, true), dsaEncoding: 'ieee-p1363' }, signature)
    } catch (err) {
      return false
    }
  }
} else {
  sign = (jwaAlg, nodeAlg, { [KEYOBJECT]: keyObject }, payload) => {
    return derToJose(createSign(nodeAlg).update(payload).sign(asInput(keyObject, false)), jwaAlg)
  }
  verify = (jwaAlg, nodeAlg, { [KEYOBJECT]: keyObject }, payload, signature) => {
    try {
      return createVerify(nodeAlg).update(payload).verify(asInput(keyObject, true), joseToDer(signature, jwaAlg))
    } catch (err) {
      return false
    }
  }
}

const crvToAlg = (crv) => {
  switch (crv) {
    case 'P-256':
      return 'ES256'
    case secp256k1:
      return 'ES256K'
    case 'P-384':
      return 'ES384'
    case 'P-521':
      return 'ES512'
  }
}

module.exports = (JWA, JWK) => {
  const algs = []

  if (getCurves().includes('prime256v1')) {
    algs.push('ES256')
  }

  if (getCurves().includes('secp256k1')) {
    algs.push('ES256K')
  }

  if (getCurves().includes('secp384r1')) {
    algs.push('ES384')
  }

  if (getCurves().includes('secp521r1')) {
    algs.push('ES512')
  }

  algs.forEach((jwaAlg) => {
    const nodeAlg = resolveNodeAlg(jwaAlg)
    JWA.sign.set(jwaAlg, sign.bind(undefined, jwaAlg, nodeAlg))
    JWA.verify.set(jwaAlg, verify.bind(undefined, jwaAlg, nodeAlg))
    JWK.EC.sign[jwaAlg] = key => key.private && JWK.EC.verify[jwaAlg](key)
    JWK.EC.verify[jwaAlg] = key => (key.use === 'sig' || key.use === undefined) && crvToAlg(key.crv) === jwaAlg
  })
}
