const test = require('ava')

const { JWT, JWK } = require('../..')

const key = JWK.generateSync('oct')

const string = (t, option) => {
  ;['', false, [], {}, Buffer, Buffer.from('foo'), 0, Infinity].forEach((val) => {
    t.throws(() => {
      JWT.sign({}, key, { [option]: val })
    }, { instanceOf: TypeError, message: `options.${option} must be a string` })
  })
}

test('options must be an object', t => {
  ;['', false, [], Buffer, Buffer.from('foo'), 0, Infinity].forEach((val) => {
    t.throws(() => {
      JWT.sign({}, key, val)
    }, { instanceOf: TypeError, message: 'options must be an object' })
  })
})

test('options.algorithm must be string', string, 'algorithm')
test('options.expiresIn must be string', string, 'expiresIn')
test('options.issuer must be string', string, 'issuer')
test('options.jti must be string', string, 'jti')
test('options.nonce must be string', string, 'nonce')
test('options.notBefore must be string', string, 'notBefore')
test('options.subject must be string', string, 'subject')

const boolean = (t, option) => {
  ;['', 'foo', [], {}, Buffer, Buffer.from('foo'), 0, Infinity].forEach((val) => {
    t.throws(() => {
      JWT.sign({}, key, { [option]: val })
    }, { instanceOf: TypeError, message: `options.${option} must be a boolean` })
  })
}
test('options.iat must be boolean', boolean, 'iat')
test('options.kid must be boolean', boolean, 'kid')

test('options.audience must be string or array of strings', t => {
  ;['', false, [], Buffer, Buffer.from('foo'), 0, Infinity].forEach((val) => {
    t.throws(() => {
      JWT.sign({}, key, { audience: val })
    }, { instanceOf: TypeError, message: 'options.audience must be a string or an array of strings' })
    t.throws(() => {
      JWT.sign({}, key, { audience: [val] })
    }, { instanceOf: TypeError, message: 'options.audience must be a string or an array of strings' })
  })
})

test('options.header must be an object', t => {
  ;['', 'foo', [], Buffer, Buffer.from('foo'), 0, Infinity, new Date('foo')].forEach((val) => {
    t.throws(() => {
      JWT.sign({}, key, { header: val })
    }, { instanceOf: TypeError, message: 'options.header must be an object' })
  })
})

test('options.now must be a valid date', t => {
  ;['', 'foo', [], {}, Buffer, Buffer.from('foo'), 0, Infinity, new Date('foo')].forEach((val) => {
    t.throws(() => {
      JWT.sign({}, key, { now: val })
    }, { instanceOf: TypeError, message: 'options.now must be a valid Date object' })
  })
})

test('payload must be an object', t => {
  ;['', 'foo', [], Buffer, Buffer.from('foo'), 0, Infinity, new Date('foo')].forEach((val) => {
    t.throws(() => {
      JWT.sign(val, key)
    }, { instanceOf: TypeError, message: 'payload must be an object' })
  })
})

test('payload is used', t => {
  const { iat, ...payload } = JWT.decode(JWT.sign({ 'urn:example.com': false }, key))
  t.deepEqual(payload, { 'urn:example.com': false })
})

test('options.header is used', t => {
  const { header: { alg, kid, ...header } } = JWT.decode(JWT.sign({}, key, { header: { typ: 'JWT' } }), { complete: true })
  t.is(kid, key.kid)
  t.is(alg, 'HS256')
  t.deepEqual(header, { typ: 'JWT' })
})

test('options.kid', t => {
  const { header: { kid } } = JWT.decode(JWT.sign({}, key, { kid: false }), { complete: true })
  t.is(kid, undefined)
})

test('options.subject', t => {
  const subject = 'foo'
  const { sub } = JWT.decode(JWT.sign({}, key, { subject }))
  t.is(sub, subject)
})

test('options.issuer', t => {
  const issuer = 'foo'
  const { iss } = JWT.decode(JWT.sign({}, key, { issuer }))
  t.is(iss, issuer)
})

test('options.jti', t => {
  const jti = 'foo'
  const decoded = JWT.decode(JWT.sign({}, key, { jti }))
  t.is(decoded.jti, jti)
})

test('options.iat false', t => {
  const iat = false
  t.deepEqual(JWT.decode(JWT.sign({}, key, { iat })), {})
})

test('options.iat', t => {
  t.true(Object.keys(JWT.decode(JWT.sign({}, key))).includes('iat'))
})

test('options.nonce', t => {
  const nonce = 'foo'
  const { nonce: pNonce } = JWT.decode(JWT.sign({}, key, { nonce }))
  t.is(pNonce, nonce)
})

test('options.audience', t => {
  const audience = 'foo'
  const { aud } = JWT.decode(JWT.sign({}, key, { audience }))
  t.deepEqual(aud, audience)
})

test('options.audience (array)', t => {
  const audience = ['foo']
  const { aud } = JWT.decode(JWT.sign({}, key, { audience }))
  t.deepEqual(aud, audience)
})

const epoch = 1265328501
const now = new Date(epoch * 1000)

test('options.now', t => {
  const { iat } = JWT.decode(JWT.sign({}, key, { now }))
  t.deepEqual(iat, epoch)
})

test('options.expiresIn', t => {
  const { exp } = JWT.decode(JWT.sign({}, key, { now, expiresIn: '20s' }))
  t.deepEqual(exp, epoch + 20)
})

test('options.notBefore', t => {
  const { nbf } = JWT.decode(JWT.sign({}, key, { now, notBefore: '20m' }))
  t.deepEqual(nbf, epoch + 20 * 60)
})

test('when options arent in effect', t => {
  const payload = {
    sub: 0,
    aud: 1,
    iss: 2,
    iat: 'iat',
    nonce: 3,
    exp: 'exp',
    nbf: 'nbf'
  }
  t.deepEqual(payload, JWT.decode(JWT.sign(payload, key, { iat: false })))
})
