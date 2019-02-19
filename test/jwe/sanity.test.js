const test = require('ava')
const BLNS = require('big-list-of-naughty-strings')

const { JWK: { generateSync }, JWE, errors: { JWEInvalid } } = require('../..')

test('compact parts length check', t => {
  t.throws(() => {
    JWE.decrypt('')
  }, { instanceOf: JWEInvalid, code: 'ERR_JWE_INVALID', message: 'JWE malformed or invalid serialization' })
  t.throws(() => {
    JWE.decrypt('...')
  }, { instanceOf: JWEInvalid, code: 'ERR_JWE_INVALID', message: 'JWE malformed or invalid serialization' })
  t.throws(() => {
    JWE.decrypt('.....')
  }, { instanceOf: JWEInvalid, code: 'ERR_JWE_INVALID', message: 'JWE malformed or invalid serialization' })
})

test('aes_cbc_hmac_sha2 decrypt iv check (missing)', t => {
  const k = generateSync('oct', undefined, { alg: 'A128CBC-HS256' })
  const encrypted = JWE.encrypt.flattened('foo', k, { alg: 'dir', enc: k.alg })
  delete encrypted.iv
  t.throws(() => {
    JWE.decrypt(encrypted, k)
  }, { instanceOf: JWEInvalid, code: 'ERR_JWE_INVALID', message: 'JWE malformed or invalid serialization' })
})

test('aes_cbc_hmac_sha2 decrypt iv check (BLNS)', t => {
  const k = generateSync('oct', undefined, { alg: 'A128CBC-HS256' })
  const encrypted = JWE.encrypt.flattened('foo', k, { alg: 'dir', enc: k.alg })
  BLNS.forEach((naughty) => {
    encrypted.iv = naughty
    const err = t.throws(() => { JWE.decrypt(encrypted, k) })
    t.true(['ERR_JWE_INVALID', 'ERR_JWE_DECRYPTION_FAILED'].includes(err.code))
  })
})

test('aes_cbc_hmac_sha2 decrypt iv check (invalid length)', t => {
  const k = generateSync('oct', undefined, { alg: 'A128CBC-HS256' })
  const encrypted = JWE.encrypt.flattened('foo', k, { alg: 'dir', enc: k.alg })
  encrypted.iv = encrypted.iv.substr(0, 15)
  t.throws(() => {
    JWE.decrypt(encrypted, k)
  }, { instanceOf: JWEInvalid, code: 'ERR_JWE_INVALID', message: 'invalid iv' })
})

test('aes_cbc_hmac_sha2 decrypt tag check (missing)', t => {
  const k = generateSync('oct', undefined, { alg: 'A128CBC-HS256' })
  const encrypted = JWE.encrypt.flattened('foo', k, { alg: 'dir', enc: k.alg })
  delete encrypted.tag
  t.throws(() => {
    JWE.decrypt(encrypted, k)
  }, { instanceOf: JWEInvalid, code: 'ERR_JWE_INVALID', message: 'JWE malformed or invalid serialization' })
})

test('aes_cbc_hmac_sha2 decrypt tag check (BLNS)', t => {
  const k = generateSync('oct', undefined, { alg: 'A128CBC-HS256' })
  const encrypted = JWE.encrypt.flattened('foo', k, { alg: 'dir', enc: k.alg })
  BLNS.forEach((naughty) => {
    encrypted.tag = naughty
    const err = t.throws(() => { JWE.decrypt(encrypted, k) })
    t.true(['ERR_JWE_INVALID', 'ERR_JWE_DECRYPTION_FAILED'].includes(err.code))
  })
})

test('aes_cbc_hmac_sha2 decrypt tag check (invalid length)', t => {
  const k = generateSync('oct', undefined, { alg: 'A128CBC-HS256' })
  const encrypted = JWE.encrypt.flattened('foo', k, { alg: 'dir', enc: k.alg })
  encrypted.tag = encrypted.tag.substr(0, 15)
  t.throws(() => {
    JWE.decrypt(encrypted, k)
  }, { instanceOf: JWEInvalid, code: 'ERR_JWE_INVALID', message: 'invalid tag' })
})

test('aes_gcm decrypt iv check (missing)', t => {
  const k = generateSync('oct', 128, { alg: 'A128GCM' })
  const encrypted = JWE.encrypt.flattened('foo', k, { alg: 'dir', enc: k.alg })
  delete encrypted.iv
  t.throws(() => {
    JWE.decrypt(encrypted, k)
  }, { instanceOf: JWEInvalid, code: 'ERR_JWE_INVALID', message: 'JWE malformed or invalid serialization' })
})

test('aes_gcm decrypt iv check (BLNS)', t => {
  const k = generateSync('oct', 128, { alg: 'A128GCM' })
  const encrypted = JWE.encrypt.flattened('foo', k, { alg: 'dir', enc: k.alg })
  BLNS.forEach((naughty) => {
    encrypted.iv = naughty
    const err = t.throws(() => { JWE.decrypt(encrypted, k) })
    t.true(['ERR_JWE_INVALID', 'ERR_JWE_DECRYPTION_FAILED'].includes(err.code))
  })
})

test('aes_gcm decrypt iv check (invalid length)', t => {
  const k = generateSync('oct', 128, { alg: 'A128GCM' })
  const encrypted = JWE.encrypt.flattened('foo', k, { alg: 'dir', enc: k.alg })
  encrypted.iv = encrypted.iv.substr(0, 15)
  t.throws(() => {
    JWE.decrypt(encrypted, k)
  }, { instanceOf: JWEInvalid, code: 'ERR_JWE_INVALID', message: 'invalid iv' })
})

test('aes_gcm decrypt tag check (missing)', t => {
  const k = generateSync('oct', 128, { alg: 'A128GCM' })
  const encrypted = JWE.encrypt.flattened('foo', k, { alg: 'dir', enc: k.alg })
  delete encrypted.tag
  t.throws(() => {
    JWE.decrypt(encrypted, k)
  }, { instanceOf: JWEInvalid, code: 'ERR_JWE_INVALID', message: 'JWE malformed or invalid serialization' })
})

test('aes_gcm decrypt tag check (BLNS)', t => {
  const k = generateSync('oct', 128, { alg: 'A128GCM' })
  const encrypted = JWE.encrypt.flattened('foo', k, { alg: 'dir', enc: k.alg })
  BLNS.forEach((naughty) => {
    encrypted.tag = naughty
    const err = t.throws(() => { JWE.decrypt(encrypted, k) })
    t.true(['ERR_JWE_INVALID', 'ERR_JWE_DECRYPTION_FAILED'].includes(err.code))
  })
})

test('aes_gcm decrypt tag check (invalid length)', t => {
  const k = generateSync('oct', 128, { alg: 'A128GCM' })
  const encrypted = JWE.encrypt.flattened('foo', k, { alg: 'dir', enc: k.alg })
  encrypted.tag = encrypted.tag.substr(0, 15)
  t.throws(() => {
    JWE.decrypt(encrypted, k)
  }, { instanceOf: JWEInvalid, code: 'ERR_JWE_INVALID', message: 'invalid tag' })
})
