/* eslint-disable */
const { strict: assert } = require('assert')
const { readFileSync } = require('fs')
const { createSecretKey } = require('crypto')

const { JWS, JWK: { importKey } } = require('..')

const ecPrivate = importKey(readFileSync('./test/fixtures/P-256.key'))
const secret = importKey(Buffer.from('foo'))

const payload = { sub: '1234567890', name: 'John Doe', iat: 1516239022 }

// compact
;(() => {
  const signed = JWS.sign(payload, secret, { alg: 'HS256' })
  console.log('compact HS256 signed', signed, '\n')
  assert(JWS.verify(signed, secret), 'compact JWS verification failed')
})()

// flattened
;(() => {
  const jws = new JWS.Sign({ sub: 'Filip', name: 'Skokan' }, { typ: 'JWT' })
  jws.recipient(secret, { alg: 'HS256' })
  const signed = jws.sign('flattened')
  console.log('flattened HS256 signed', signed, '\n')
  assert(JWS.verify(signed, secret), 'flattened JWS verification failed')
})();

// general
;(() => {
  const jws = new JWS.Sign({ sub: 'Filip', name: 'Skokan' }, { typ: 'JWT' })
  jws.recipient(secret, { alg: 'HS256' })
  jws.recipient(ecPrivate, { alg: 'ES256' })
  const signed = jws.sign('general')
  console.log('general HS256 and ES256 signed', signed, '\n')
  assert(JWS.verify(signed, secret), 'general JWS verification failed')
  assert(JWS.verify(signed, ecPrivate), 'general JWS verification failed')
})()
