const test = require('ava')

const { sign } = require('../../lib/jwt')

const { compactJwt } = require('../macros')
const fixtures = require('../fixtures')

const oct = Buffer.from('foo')

test('uses HS256 for oct keys', compactJwt, () => sign({}, oct, { noTimestamp: true }), { alg: 'HS256' }, {})
test('uses RS256 for RSA keys', compactJwt, () => sign({}, fixtures.PEM.RSA.private, { noTimestamp: true }), { alg: 'RS256' }, {})
test('uses ES256 for P-256 keys', compactJwt, () => sign({}, fixtures.PEM['P-256'].private, { noTimestamp: true }), { alg: 'ES256' }, {})
test('uses ES384 for P-384 keys', compactJwt, () => sign({}, fixtures.PEM['P-384'].private, { noTimestamp: true }), { alg: 'ES384' }, {})
test('uses ES512 for P-521 keys', compactJwt, () => sign({}, fixtures.PEM['P-521'].private, { noTimestamp: true }), { alg: 'ES512' }, {})

;(() => {
  // header alg
  test('header alg can be specified via options.alg', compactJwt, () => sign({}, oct, { alg: 'HS384', noTimestamp: true }), { alg: 'HS384' }, {})
  test('header alg can be specified via options.algorithm', compactJwt, () => sign({}, oct, { algorithm: 'HS384', noTimestamp: true }), { alg: 'HS384' }, {})
  test('header alg can be specified via options.header.alg', compactJwt, () => sign({}, oct, { header: { alg: 'HS384' }, noTimestamp: true }), { alg: 'HS384' }, {})

  test.todo('header alg throws if provided alg is not available on key')
  test.todo('header alg throws if no algorithm is available on key')
})()

;(() => {
  // payload aud
  test('payload aud can be specified via options.audience', compactJwt, () => sign({}, oct, { audience: 'client', noTimestamp: true }), { alg: 'HS256' }, { aud: 'client' })
  test('payload aud can be specified via payload.aud', compactJwt, () => sign({ aud: 'client' }, oct, { noTimestamp: true }), { alg: 'HS256' }, { aud: 'client' })
  test('payload aud prefers payload.aud', compactJwt, () => sign({ aud: 'client' }, oct, { audience: 'client2', noTimestamp: true }), { alg: 'HS256' }, { aud: 'client' })
})()

;(() => {
  // payload iss
  test('payload iss can be specified via options.issuer', compactJwt, () => sign({}, oct, { issuer: 'issuer', noTimestamp: true }), { alg: 'HS256' }, { iss: 'issuer' })
  test('payload iss can be specified via payload.iss', compactJwt, () => sign({ iss: 'issuer' }, oct, { noTimestamp: true }), { alg: 'HS256' }, { iss: 'issuer' })
  test('payload iss prefers payload.iss', compactJwt, () => sign({ iss: 'issuer' }, oct, { issuer: 'issuer option', noTimestamp: true }), { alg: 'HS256' }, { iss: 'issuer' })
})()

;(() => {
  // payload sub
  test('payload sub can be specified via options.subject', compactJwt, () => sign({}, oct, { subject: 'sub', noTimestamp: true }), { alg: 'HS256' }, { sub: 'sub' })
  test('payload sub can be specified via payload.sub', compactJwt, () => sign({ sub: 'sub' }, oct, { noTimestamp: true }), { alg: 'HS256' }, { sub: 'sub' })
  test('payload sub prefers payload.sub', compactJwt, () => sign({ sub: 'sub' }, oct, { sub: 'sub option', noTimestamp: true }), { alg: 'HS256' }, { sub: 'sub' })
})()

;(() => {
  // payload jti
  test('payload jti can be specified via options.jti', compactJwt, () => sign({}, oct, { jti: 'jti', noTimestamp: true }), { alg: 'HS256' }, { jti: 'jti' })
  test('payload jti can be specified via options.jwtid', compactJwt, () => sign({}, oct, { jwtid: 'jti', noTimestamp: true }), { alg: 'HS256' }, { jti: 'jti' })
  test('payload jti can be specified via payload.jti', compactJwt, () => sign({ jti: 'jti' }, oct, { noTimestamp: true }), { alg: 'HS256' }, { jti: 'jti' })
  test('payload jti prefers payload.jti', compactJwt, () => sign({ jti: 'jti' }, oct, { jti: 'jti option', jwtid: 'jwtid option', noTimestamp: true }), { alg: 'HS256' }, { jti: 'jti' })
})()

;(() => {
  // header kid
  test('header kid can be specified via options.kid', compactJwt, () => sign({}, oct, { kid: 'kid', noTimestamp: true }), { alg: 'HS256', kid: 'kid' }, {})
  test('header kid can be specified via options.keyid', compactJwt, () => sign({}, oct, { keyid: 'kid', noTimestamp: true }), { alg: 'HS256', kid: 'kid' }, {})
  test('header kid can be specified via options.header.kid', compactJwt, () => sign({}, oct, { noTimestamp: true, header: { kid: 'kid' } }), { alg: 'HS256', kid: 'kid' }, {})
  test('header kid prefers header.kid', compactJwt, () => sign({}, oct, { kid: 'kid option', keyid: 'keyid option', noTimestamp: true, header: { kid: 'kid' } }), { alg: 'HS256', kid: 'kid' }, {})
})()
