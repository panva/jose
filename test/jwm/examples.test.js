const test = require('ava')
const isObject = require('../../lib/help/is_object')
const base64url = require('../../lib/help/base64url')
const { JWM, JWE, JWK, JWK: { generateSync }, errors } = require('../..')

// This test set includes the examples used in the JWM IETF Draft

test('example-encrypted-jwm-single-recipient', t => {
    //Plaintext definition
    const plaintext = {
        id : "urn:uuid:ef5a7369-f0b9-4143-a49d-2b9c7ee51117",
        type : "hello-world-message-type",
        from : "urn:uuid:8abdf5fb-621e-4cf5-a595-071bc2c91d82", 
        expiry : 1516239022,
        time_stamp : 1516269022,
        body : { message: "Hello world!" }
    };

    //Get recipient key

    const recipient_key = JWK.asKey({
        "crv": "P-256",
        "x": "-f6jdHmkzQJXp2owZsPSNKVq-ZxrFrD0N8pXvUXGN2g",
        "y": "Fce3qbxaO-KpplC7t2vufmcDmbaUVB9dT8bZR8MrI6w",
        "kty": "EC",
        "kid": "PGoXzs0NWaR_meKgTZLbEuDoSVTaFuyrbWI7V9dpjCg"
    });

    recipients = [
        {
          'key': recipient_key,
          'header': { kid: recipient_key.kid }
        }
    ]

    options = {
      serialization: "general",
      enc: 'A256GCM',
      //alg: 'ECDH-ES+A256KW'
    }
    
    //Prepare JWM
    const jwm = JWM.encrypt(plaintext, recipients, null, options)

    protected_header = JSON.parse(base64url.decode(jwm.protected))

    t.is(protected_header.type, "JWM")
    t.is(protected_header.enc, "A256GCM")
    //t.is(protected_header.alg, "ECDH-ES+A256KW")

    const decrypted = JWM.decrypt(jwm, recipients[0].key, { complete: true })
  
    t.deepEqual(decrypted.jwm, plaintext)


  })