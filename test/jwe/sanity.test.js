const test = require('ava')

const { JWK: { generateSync }, JWE, errors: { JWEInvalid } } = require('../..')

test('aes_cbc_hmac_sha2 decrypt iv check (missing)', t => {
  const k = generateSync('oct', undefined, { alg: 'A128CBC-HS256' })
  const encrypted = JWE.encrypt.flattened('foo', k, { alg: 'dir', enc: k.alg })
  delete encrypted.iv
  t.throws(() => {
    JWE.decrypt(encrypted, k)
  }, { instanceOf: JWEInvalid, code: 'ERR_JWE_INVALID', message: 'missing iv' })
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
  }, { instanceOf: JWEInvalid, code: 'ERR_JWE_INVALID', message: 'missing tag' })
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
  }, { instanceOf: JWEInvalid, code: 'ERR_JWE_INVALID', message: 'missing iv' })
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
  }, { instanceOf: JWEInvalid, code: 'ERR_JWE_INVALID', message: 'missing tag' })
})

test('aes_gcm decrypt tag check (invalid length)', t => {
  const k = generateSync('oct', 128, { alg: 'A128GCM' })
  const encrypted = JWE.encrypt.flattened('foo', k, { alg: 'dir', enc: k.alg })
  encrypted.tag = encrypted.tag.substr(0, 15)
  t.throws(() => {
    JWE.decrypt(encrypted, k)
  }, { instanceOf: JWEInvalid, code: 'ERR_JWE_INVALID', message: 'invalid tag' })
})
