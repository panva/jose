/* eslint-disable */
const { strict: assert } = require('assert')
const { readFileSync } = require('fs')

const { JWS, JWK: { importKey } } = require('..')

const ecPrivate = importKey(readFileSync('./test/fixtures/P-256.key'))
const rsaPrivate = importKey(readFileSync('./test/fixtures/rsa.key'))
const ecPub = importKey(readFileSync('./test/fixtures/P-256.pem'))
const rsaPub = importKey(readFileSync('./test/fixtures/rsa.pem'))
const payload = { sub: '1234567890', name: 'John Doe', iat: 1516239022 }

// compact ec
;(() => {
  const signed = JWS.sign(payload, ecPrivate, { alg: 'ES256' }, undefined)
  console.log('compact ES256 signed', signed, '\n')
  assert(JWS.verify(signed, ecPrivate), 'compact JWS verification with ecPrivate failed')
  assert(JWS.verify(signed, ecPub), 'compact JWS verification with ecPub failed')
})();

// compact rsa
(() => {
  const signed = JWS.sign(payload, rsaPrivate, { alg: 'RS256' }, undefined)
  console.log('compact RS256 signed', signed, '\n')
  assert(JWS.verify(signed, rsaPrivate), 'compact JWS verification with rsaPrivate failed')
  assert(JWS.verify(signed, rsaPub), 'compact JWS verification with rsaPub failed')
})();

// flattened
(() => {
  const jws = new JWS.Sign({ sub: 'Filip', name: 'Skokan' }, { typ: 'JWT' })
  jws.recipient(ecPrivate, { alg: 'ES256' })
  const signed = jws.sign('flattened')
  console.log('flattened ES256 signed', signed, '\n')
  assert(JWS.verify(signed, ecPrivate), 'flattened JWS verification with ecPrivate failed')
  assert(JWS.verify(signed, ecPub), 'flattened JWS verification with ecPub failed')
})();

// general
(() => {
  const jws = new JWS.Sign({ sub: 'Filip', name: 'Skokan' }, { typ: 'JWT' })
  jws.recipient(ecPrivate, { alg: 'ES256' })
  jws.recipient(rsaPrivate, { alg: 'RS512' })
  const signed = jws.sign('general')
  console.log('general ES256 and RS512 signed', signed, '\n')
  assert(JWS.verify(signed, ecPrivate), 'general JWS verification with ecPrivate failed')
  assert(JWS.verify(signed, ecPub), 'general JWS verification with ecPub failed')
  assert(JWS.verify(signed, rsaPrivate), 'general JWS verification with rsaPrivate failed')
  assert(JWS.verify(signed, rsaPub), 'general JWS verification with rsaPub failed')
})();
