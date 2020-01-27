const { pbkdf2Sync: pbkdf2, randomBytes } = require('crypto')

const { KEYOBJECT } = require('../help/consts')
const base64url = require('../help/base64url')

const SALT_LENGTH = 16
const NULL_BUFFER = Buffer.alloc(1, 0)

const concatSalt = (alg, p2s) => {
  return Buffer.concat([
    Buffer.from(alg, 'utf8'),
    NULL_BUFFER,
    p2s
  ])
}

const wrapKey = (keylen, sha, concat, wrap, { [KEYOBJECT]: keyObject }, payload) => {
  // Note that if password-based encryption is used for multiple
  // recipients, it is expected that each recipient use different values
  // for the PBES2 parameters "p2s" and "p2c".
  // here we generate p2c between 2048 and 4096 and random p2s
  const p2c = Math.floor((Math.random() * 2049) + 2048)
  const p2s = randomBytes(SALT_LENGTH)
  const salt = concat(p2s)

  const derivedKey = pbkdf2(keyObject.export(), salt, p2c, keylen, sha)

  const result = wrap({ [KEYOBJECT]: derivedKey }, payload)
  result.header = result.header || {}
  Object.assign(result.header, { p2c, p2s: base64url.encodeBuffer(p2s) })

  return result
}

const unwrapKey = (keylen, sha, concat, unwrap, { [KEYOBJECT]: keyObject }, payload, header) => {
  const { p2s, p2c } = header
  const salt = concat(p2s)
  const derivedKey = pbkdf2(keyObject.export(), salt, p2c, keylen, sha)
  return unwrap({ [KEYOBJECT]: derivedKey }, payload, header)
}

module.exports = (JWA, JWK) => {
  ['PBES2-HS256+A128KW', 'PBES2-HS384+A192KW', 'PBES2-HS512+A256KW'].forEach((jwaAlg) => {
    const kw = jwaAlg.substr(-6)
    const kwWrap = JWA.keyManagementEncrypt.get(kw)
    const kwUnwrap = JWA.keyManagementDecrypt.get(kw)
    const keylen = parseInt(jwaAlg.substr(13, 3), 10) / 8
    const sha = `sha${jwaAlg.substr(8, 3)}`

    if (kwWrap && kwUnwrap) {
      JWA.keyManagementEncrypt.set(jwaAlg, wrapKey.bind(undefined, keylen, sha, concatSalt.bind(undefined, jwaAlg), kwWrap))
      JWA.keyManagementDecrypt.set(jwaAlg, unwrapKey.bind(undefined, keylen, sha, concatSalt.bind(undefined, jwaAlg), kwUnwrap))
      JWK.oct.deriveKey[jwaAlg] = key => key.use === 'enc' || key.use === undefined
    }
  })
}
