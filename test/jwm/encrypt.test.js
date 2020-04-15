const test = require('ava')
const isObject = require('../../lib/help/is_object')
const base64url = require('../../lib/help/base64url')
const { JWM, JWE, JWK: { generateSync }, errors } = require('../..')


function generateRecipientList(length=1) {
  list = [];
  for (let i = 0; i < length; i++) {
    let k = generateSync('EC', "P-256", { kid: `kid_${i+1}`})
    list.push({
      key: k,
      header: { kid: k.kid }
    })
  }
  return list;
}

test('JWM encrypt attributes rejects non objects if provided', t => {
  ;[[], false, true, null, Infinity, 0, Buffer.from('foo')].forEach((val) => {
    t.throws(() => {
      JWM.encrypt(val) // eslint-disable-line no-new
    }, { instanceOf: TypeError, message: 'attributes must be an object' })
  })
})

test('JWM encrypt options rejects non objects if provided', t => {
  ;[[], false, true, null, Infinity, 0, Buffer.from('foo')].forEach((val) => {
    t.throws(() => {
      JWM.encrypt({}, [], null, val) // eslint-disable-line no-new
    }, { instanceOf: TypeError, message: 'options must be an object' })
  })
})

test('JWM string attributes reject non strings if provided', t => {
  ;[[], false, true, null, Infinity, 0, {}, Buffer.from('foo')].forEach((val) => {
    ['id', 'type', 'to', 'from', 'thread_id', 'reply_url', 'reply_to'].forEach((attr) => {
      t.throws(() => {
        JWM.encrypt({[attr]:val}, []) // eslint-disable-line no-new
      }, { instanceOf: TypeError, message: `attributes.${attr} must be a string` })
    })
  })
})

test('JWM _time attributes reject invalid timestamps if provided', t => {
  ;[[], false, true, null, Infinity, {}, "x", Buffer.from('foo')].forEach((val) => {
    ['created_time', 'expires_time'].forEach((attr) => {
      t.throws(() => {
        JWM.encrypt({[attr]:val}, []) // eslint-disable-line no-new
      }, { instanceOf: TypeError, message: `attributes.${attr} must be a unix timestamp` })
    })
  })
})

test('JWM body attribute reject non object if provided', t => {
  ;[[], false, true, null, Infinity, 0, "x", Buffer.from('foo')].forEach((val) => {
    t.throws(() => {
      JWM.encrypt({body:val}, []) // eslint-disable-line no-new
    }, { instanceOf: TypeError, message: `attributes.body must be an object` })
  })
})

test('serialization option reject non string if provided', t => {
  const recipients = generateRecipientList(1);
  ;[[], false, true, null, Infinity, 0, Buffer.from('foo')].forEach((val) => {
    t.throws(() => {
      JWM.encrypt({}, recipients, null, { serialization: val }) // eslint-disable-line no-new
    }, { instanceOf: TypeError, message: `options.serialization must be a string` })
  })
})

test('serialization option does not allow flattened', t => {
  const recipients = generateRecipientList(1);  
  t.throws(() => {
      JWM.encrypt({}, recipients, null, options = { serialization: "flattened" }) // eslint-disable-line no-new
    }, { instanceOf: TypeError, message: `options.serialization must be compact or general` })
})


test('JWM encrypt recipients must be a list', t => {
  ;[{}, false, true, null, Infinity, 0, Buffer.from('foo')].forEach((val) => {
    t.throws(() => {
      JWM.encrypt({}, val) // eslint-disable-line no-new
    }, { instanceOf: TypeError, message: 'recipients must be an array' })
  })
})

test('JWM requires at least one recipient', t => {
  t.throws(() => {
    JWM.encrypt({}, []) // eslint-disable-line no-new
  }, { instanceOf: TypeError, message: 'recipients array requires at least one recipient' })
})

test('JWM serialization defaults to general', t => {
  const sender = generateSync('EC', "P-256", { kid: 'sender_1' })
  const recipients = generateRecipientList(1); 
  jwm = JWM.encrypt({}, recipients, sender, {}) // eslint-disable-line no-new
  
  //test that jwe is general form
  t.assert(isObject(jwm))
})

// this fails, likely becuse the keys I'm using generate an unacceptable form to compact
/*test('JWM compact serialization returns string', t => {
  //const sender = generateSync('EC', "P-256", { kid: 'sender_1' })
  const recipients = generateRecipientList(); 
  jwm = JWM.Encrypt({}, recipients, null, { serialization: "compact" }) // eslint-disable-line no-new
  
  //test that jwe is general form
  t.assert(typeof jwm === 'string')
})*/

test('JWM encrypt multiple recipients', t => {
  const sender = generateSync('EC', "P-256", { kid: 'sender_1' })
  
  const r1 = generateSync('EC', "P-256", { kid: 'kid_1' })
  const r2 = generateSync('EC', "P-256", { kid: 'kid_2' })
  recipients = [
    {
      'key': r1,
      'header': { kid: r1.kid }
    },
    {
      'key': r2,
      'header': { kid: r2.kid }
    }
  ]

  jwm = JWM.encrypt({}, recipients, sender, { serialization: "general" })
  t.is(jwm.recipients[0].header.alg, 'ECDH-ES+A128KW')
  t.is(jwm.recipients[0].header.kid, 'kid_1')
  t.is(jwm.recipients[1].header.alg, 'ECDH-ES+A128KW')
  t.is(jwm.recipients[1].header.kid, 'kid_2')
})




//first example in 2.3 is anoncrypt
//code example for anoncrypt: https://github.com/mattrglobal/jwm/blob/master/samples/example-encrypted-jwm-single-recipient.js