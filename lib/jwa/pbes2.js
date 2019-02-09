const { strict: assert } = require('assert')
const { pbkdf2Sync: pbkdf2, randomBytes } = require('crypto')

const base64url = require('../help/base64url')

const SALT_LENGTH = 16
const ITERATIONS = 8192
const NULL_BUFFER = Buffer.alloc(1, 0)

const concatSalt = (alg, ps2) => {
  return Buffer.concat([
    Buffer.from(alg, 'utf8'),
    NULL_BUFFER,
    ps2
  ])
}

// TODO:
// Note that if password-based encryption is used for multiple
// recipients, it is expected that each recipient use different values
// for the PBES2 parameters "p2s" and "p2c".

const wrapKey = (keylen, sha, concat, kw, { keyObject }, payload) => {
  const p2s = randomBytes(SALT_LENGTH)
  const p2c = ITERATIONS
  const salt = concat(p2s)

  const derivedKey = pbkdf2(keyObject.export(), salt, p2c, keylen, sha)

  const result = kw({ keyObject: derivedKey }, payload)
  result.header = { p2c, p2s: base64url.encode(p2s) }

  return result
}

const unwrapKey = (keylen, sha, concat, kw, { keyObject }, payload, { p2c, p2s }) => {
  // TODO: validate p2c, p2s
  const salt = concat(p2s)
  const derivedKey = pbkdf2(keyObject.export(), salt, p2c, keylen, sha)
  return kw({ keyObject: derivedKey }, payload)
}

module.exports = (JWA) => {
  ['PBES2-HS256+A128KW', 'PBES2-HS384+A192KW', 'PBES2-HS512+A256KW'].forEach((jwaAlg) => {
    assert(!JWA.wrapKey.has(jwaAlg), `wrapKey alg ${jwaAlg} already registered`)
    assert(!JWA.unwrapKey.has(jwaAlg), `unwrapKey alg ${jwaAlg} already registered`)

    const kw = jwaAlg.substr(-6)
    const kwWrap = JWA.wrapKey.get(kw)
    const kwUnwrap = JWA.unwrapKey.get(kw)
    const keylen = parseInt(jwaAlg.substr(13, 3), 10) / 8
    const sha = `sha${jwaAlg.substr(8, 3)}`

    JWA.wrapKey.set(jwaAlg, wrapKey.bind(undefined, keylen, sha, concatSalt.bind(undefined, jwaAlg), kwWrap))
    JWA.unwrapKey.set(jwaAlg, unwrapKey.bind(undefined, keylen, sha, concatSalt.bind(undefined, jwaAlg), kwUnwrap))
  })
}
