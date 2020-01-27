const sign = () => Buffer.from('')
const verify = (key, payload, signature) => !signature.length

module.exports = (JWA, JWK) => {
  JWA.sign.set('none', sign)
  JWA.verify.set('none', verify)
}
