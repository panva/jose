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
    }

    const recipient_key = generateSync("EC", "X25519")

    recipients = [
        {
          'key': recipient_key,
          'header': { kid: recipient_key.kid }
        }
    ]

    options = {
      serialization: "general",
      enc: 'A256GCM',
      alg: 'ECDH-ES+A256KW'
    }
    
    //Prepare JWM
    const jwm = JWM.encrypt(plaintext, recipients, null, options)

    protected_header = JSON.parse(base64url.decode(jwm.protected))

    t.is(protected_header.type, "JWM")
    t.is(protected_header.enc, "A256GCM")
    t.is(protected_header.alg, "ECDH-ES+A256KW")

    const decrypted = JWM.decrypt(jwm, recipients[0].key, { complete: true })
  
    t.deepEqual(decrypted.jwm, plaintext)


  })

  test('example-encrypted-jwm-single-recipient-sender', t => {
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

    const recipient_key = generateSync("EC", "X25519");
    const sender_key = generateSync("EC", "X25519");

    recipients = [
        {
          'key': recipient_key,
          'header': { kid: recipient_key.kid }
        }
    ]

    options = {
      serialization: "general",
      enc: 'A256GCM',
      alg: 'ECDH-ES+A256KW' //ECDH-1PU when supported
    }
    
    //Prepare JWM
    const jwm = JWM.encrypt(plaintext, recipients, sender_key, options)

    protected_header = JSON.parse(base64url.decode(jwm.protected))

    t.is(protected_header.type, "JWM")
    t.is(protected_header.enc, "A256GCM")
    t.is(protected_header.alg, "ECDH-ES+A256KW")

    const decrypted = JWM.decrypt(jwm, recipients[0].key, { complete: true })
  
    t.deepEqual(decrypted.jwm, plaintext)


  })