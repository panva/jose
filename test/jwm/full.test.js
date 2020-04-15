const test = require('ava')
const isObject = require('../../lib/help/is_object')
const base64url = require('../../lib/help/base64url')
const { JWM, JWE, JWK: { generateSync }, errors } = require('../..')

test('JWM round trip', t => {
    const sender = generateSync('EC', "P-256", { kid: 'sender_1' })
    
    const r1 = generateSync('EC', "P-256", { kid: 'kid_1' })
    recipients = [
      {
        'key': r1,
        'header': { kid: r1.kid }
      }
    ]

    options = {
      serialization: "general",
      enc: 'A256GCM',
      alg: 'ECDH-ES+A256KW'
    }
  
    jwm = JWM.encrypt({}, recipients, sender, options)

    protected_header = JSON.parse(base64url.decode(jwm.protected))

    t.is(protected_header.type, "JWM")
    t.is(protected_header.enc, "A256GCM")
    t.is(protected_header.alg, "ECDH-ES+A256KW")
  
    const decrypted = JWM.decrypt(jwm, recipients[0].key, { complete: true })
  
    t.deepEqual(decrypted.jwm, {})
  })