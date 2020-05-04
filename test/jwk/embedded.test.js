const test = require('ava')

const { errors, JWK, JWS, JWT, JWKS } = require('../..')
const { keyObjectSupported } = require('../../lib/help/runtime_support')

test('JWK.EmbeddedJWK', t => {
  const k = JWK.EmbeddedJWK
  t.truthy(k)
  t.true(JWK.isKey(k))
  t.is(k.kty, undefined)
  for (const prop of ['kid', 'kty', 'thumbprint', 'toJWK', 'toPEM']) {
    k[prop] = 'foo'
    t.is(k[prop], undefined)
  }
  t.deepEqual([...k.algorithms()], [])
  k.type = 'foo'
  t.is(k.type, 'embedded')
  t.throws(() => new JWKS.KeyStore(k), { instanceOf: TypeError })
  const ks = new JWKS.KeyStore()
  t.throws(() => ks.add(k), { instanceOf: TypeError })
})

test('JWK.EmbeddedJWK JWS.verify pass', async t => {
  const key = await JWK.generate('EC', 'P-256')
  const { kid, ...jwk } = key.toJWK()
  const jws = JWS.sign('foo', key, { jwk })
  t.notThrows(() => JWS.verify(jws, JWK.EmbeddedJWK))
  t.throws(
    () => JWS.verify(jws, JWK.EmbeddedJWK, { algorithms: ['EdDSA'] }),
    { instanceOf: errors.JOSEAlgNotWhitelisted, code: 'ERR_JOSE_ALG_NOT_WHITELISTED', message: 'alg not whitelisted' }
  )
  const { key: embedded } = JWS.verify(jws, JWK.EmbeddedJWK, { complete: true })
  t.false(key === embedded)
  t.deepEqual(key.toJWK(), embedded.toJWK())
})

test('JWK.EmbeddedJWK JWT.verify pass', async t => {
  const key = await JWK.generate('EC', 'P-256')
  const { kid, ...jwk } = key.toJWK()
  const jws = JWT.sign({}, key, { header: { jwk } })
  t.notThrows(() => JWT.verify(jws, JWK.EmbeddedJWK))
  t.throws(
    () => JWT.verify(jws, JWK.EmbeddedJWK, { algorithms: ['EdDSA'] }),
    { instanceOf: errors.JOSEAlgNotWhitelisted, code: 'ERR_JOSE_ALG_NOT_WHITELISTED', message: 'alg not whitelisted' }
  )
  const { key: embedded } = JWT.verify(jws, JWK.EmbeddedJWK, { complete: true })
  t.false(key === embedded)
  t.deepEqual(key.toJWK(), embedded.toJWK())
})

test('JWK.EmbeddedJWK key must be a public key', async t => {
  const key = await JWK.generate('EC', 'P-256')
  const { kid, ...jwk } = key.toJWK(true)
  {
    const jws = JWS.sign('foo', key, { jwk })
    t.throws(
      () => JWS.verify(jws, JWK.EmbeddedJWK),
      { instanceOf: errors.JWSInvalid, code: 'ERR_JWS_INVALID', message: 'JWS Header Parameter "jwk" must be a public key' }
    )
  }
  {
    const jws = JWS.sign('foo', key, { jwk: { kty: 'oct', k: 'foo' } })
    t.throws(
      () => JWS.verify(jws, JWK.EmbeddedJWK),
      { instanceOf: errors.JWSInvalid, code: 'ERR_JWS_INVALID', message: 'JWS Header Parameter "jwk" must be a public key' }
    )
  }
  {
    const jws = JWS.sign('foo', key, { jwk: { kty: 'oct' } })
    t.throws(
      () => JWS.verify(jws, JWK.EmbeddedJWK),
      { instanceOf: errors.JWSInvalid, code: 'ERR_JWS_INVALID', message: 'JWS Header Parameter "jwk" must be a public key' }
    )
  }
  {
    const jws = JWS.sign('foo', key, { jwk: { kty: 'foo' } })
    t.throws(
      () => JWS.verify(jws, JWK.EmbeddedJWK),
      { instanceOf: errors.JOSENotSupported, code: 'ERR_JOSE_NOT_SUPPORTED', message: 'unsupported key type: foo' }
    )
  }
  {
    const invalidEc = key.toJWK()
    delete invalidEc.y
    const jws = JWS.sign('foo', key, { jwk: invalidEc })
    t.throws(
      () => JWS.verify(jws, JWK.EmbeddedJWK),
      { instanceOf: errors.JWKImportFailed, code: 'ERR_JWK_IMPORT_FAILED', message: 'key import failed' }
    )
  }
})

test('JWK.EmbeddedJWK key invalid inputs', async t => {
  const key = await JWK.generate('EC', 'P-256')
  for (const jwk of [undefined, '', null, false, true, 1, 3.14, 'pi']) {
    const jws = JWS.sign('foo', key, { jwk })
    t.throws(
      () => JWS.verify(jws, JWK.EmbeddedJWK),
      { instanceOf: errors.JWSInvalid, code: 'ERR_JWS_INVALID', message: 'JWS Header Parameter "jwk" must be a JSON object' }
    )
  }
})

if (keyObjectSupported) {
  test('JWK.EmbeddedX5C', t => {
    const k = JWK.EmbeddedX5C
    t.truthy(k)
    t.true(JWK.isKey(k))
    t.is(k.kty, undefined)
    for (const prop of ['kid', 'kty', 'thumbprint', 'toJWK', 'toPEM']) {
      k[prop] = 'foo'
      t.is(k[prop], undefined)
    }
    t.deepEqual([...k.algorithms()], [])
    k.type = 'foo'
    t.is(k.type, 'embedded')
    t.throws(() => new JWKS.KeyStore(k), { instanceOf: TypeError })
    const ks = new JWKS.KeyStore()
    t.throws(() => ks.add(k), { instanceOf: TypeError })
  })

  const rsa = {
    e: 'AQAB',
    n: 'u4kSwZDMd93b1fvd6CXUfHa-rF0DBd03tCCpWN31giKCskP09c7VigwkyHu34X__1rA7CNMaSrXQn4ChkhulSxzQyojBc3t06AjyKe_Nzpd72zaGFjaLfN-C2U5QmmaXn_2dOiQTH3aTaHDA5I8zd7ZEwrln9G6DD9KtbAcal-RWN_XT-dD-hHUSH4X4iHIvVC1El6lOtu9yjpmQtAvU3mpvxKK6AUGEA9wCWmIEcpfosOCpgHiwVeuPwJwAmuHRFA-h5N4wWw1KQuW66ocgeTzwKZ33DuMWeLap3AEeDVErInAwPPjzLSj3i3DvtveGlGZQH10wAZMAQrcUhHS06Q',
    d: 'e_PUztXbH5snc58fBBMFCCMgUiLEHbsi108DP7atUA9pXVRnc5T7NVxjb5O-bTDCM--VhXaqmRjlRJerszvMnAH2yvdrDd5a3gcTsL5MxLEBb1nxdHsm5SmCfgkyY2tN6rShmE1BynkAY3arOCaieQyjFCWh3UCyJeI1OALWA_AJP1kOrmrM9Cpd3FYNkKN163_D7Nv5g2PuMMO1T6Zx8xdgC1C6OxXfmVpvNtOI4pnkODRcQhTspHJLzGTtp2yYPRHCsBhF7i3XsbQ4D8a8t_vZ3yLt-3ZkJnHnRQeCeyBlALUcnFFo43CA96ohOk6NhjYNbi8uJbZyxWVXllwV5Q',
    p: '5kZFOcFl6jrZ7XQWDoHipOqHyACKRCdk1V-JBi8_iOZYpDXiTWCAdl_XAqMLI8vrcceOi2TLbdFBASVQVWwvOPUkpZ5BvNI6Zpzvv7PRjQlhBBogC06zwCcMi0f1RVZrvtt1_URwMgSuc7OaJFEIcIllVaXKa2KhmBBlQnDVSXc',
    q: '0Hx9Ccd1iaESKbfv6Wsx1emCaKcIBpxYe41jNWbmtGNixaZHyCr0_FFAOwzbfe_W_kuX6Tk5rmDDivG92Rm0QcRas70CvXP8m64R3Z3qV7mKY8QZpwooPFoOaZfjl0--w_HEdtf-epm43kCIXtqgaIj4aUFEEdEe4AVnTyZpjJ8',
    dp: '1zYhiKLpXwn1lukBnDlj2wGeORvYHW473PdWlsMdvBKcEYySngJszTUxO7Opu6DfwQziegCP52jEOg_njo53a-Igh_DqO1C3aCOQJjgmxotXcoAAJtE9SX61SI7N-imUtWFiWnvV58lcSaI3k21wV8zxOiSik84wfHAGUxwlGm0',
    dq: 'Q9_DdWOSSHQ_zYUsffmAB_w1kIyQeFZ-F_s3yTLu-NtCVMaFqA0UJPDu0EqnSqDChZdmpW8T8ElgX-PDwuIzZRXf0ZQ_SB5yptxMxLGckWK-QyycjV0pLDzFZGsmlSRJHtGe_HHlT1Sscu7fdsIGZwHwnZO57XL_cj9QGtyOkFE',
    qi: 'qhNTCBRZi6zC-2nyVuleB5DAfzza_HSqa_FvSZpzbxv_cIgI52FIB2Vn6u6c8M-n0PEVpCOwVOD2VuRqWhidfOJsFbGLyGtEg9ZRE-bQoOPvRIeUqOt5jTe3bqboG84vNcmw5m0zbCw8upUmu2LK0NIFDxrjognJEwIlMoAgALE',
    kty: 'RSA'
  }
  const x5c = ['MIIDmjCCAoKgAwIBAgIJfEZch1k3018JMA0GCSqGSIb3DQEBBQUAMGkxFDASBgNVBAMTC2V4YW1wbGUub3JnMQswCQYDVQQGEwJVUzERMA8GA1UECBMIVmlyZ2luaWExEzARBgNVBAcTCkJsYWNrc2J1cmcxDTALBgNVBAoTBFRlc3QxDTALBgNVBAsTBFRlc3QwHhcNMjAwNTA1MTI0MTQ2WhcNMjEwNTA1MTI0MTQ2WjBpMRQwEgYDVQQDEwtleGFtcGxlLm9yZzELMAkGA1UEBhMCVVMxETAPBgNVBAgTCFZpcmdpbmlhMRMwEQYDVQQHEwpCbGFja3NidXJnMQ0wCwYDVQQKEwRUZXN0MQ0wCwYDVQQLEwRUZXN0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu4kSwZDMd93b1fvd6CXUfHa+rF0DBd03tCCpWN31giKCskP09c7VigwkyHu34X//1rA7CNMaSrXQn4ChkhulSxzQyojBc3t06AjyKe/Nzpd72zaGFjaLfN+C2U5QmmaXn/2dOiQTH3aTaHDA5I8zd7ZEwrln9G6DD9KtbAcal+RWN/XT+dD+hHUSH4X4iHIvVC1El6lOtu9yjpmQtAvU3mpvxKK6AUGEA9wCWmIEcpfosOCpgHiwVeuPwJwAmuHRFA+h5N4wWw1KQuW66ocgeTzwKZ33DuMWeLap3AEeDVErInAwPPjzLSj3i3DvtveGlGZQH10wAZMAQrcUhHS06QIDAQABo0UwQzAMBgNVHRMEBTADAQH/MAsGA1UdDwQEAwIC9DAmBgNVHREEHzAdhhtodHRwOi8vZXhhbXBsZS5vcmcvd2ViaWQjbWUwDQYJKoZIhvcNAQEFBQADggEBAA3oxXuMEXdi/5ndPuoJYe1eK3KHIFRajZOrMxSz65ErlkiIt9K0weoYSywufuIdP71kc+S/x/NUpXzaZ1XvUDK3IvwKxf/dnLgtDJRABCWHBQ+81YvtxJVzDSq9grVdGby7IRzuDaayvEo0YFc5xh0r8Jc/Dlaz4ZUhXLxpKZeyT47aPyk6Ys+d/2vEFDhOwyipqKI+xtfrdPaBi9FXk/QA+Th16DKx9Uxau+sXbAVSG3YZtUUkadi1sP/oKqQcJ6VTSGt+8Yg+DJwY8ZnX+QgVyEtqpTwfJNjt3G4qOtAr8LpNTN+r2BG4XYN3bck9SVfjDky5dXJo3NY2pT9AO58=']

  test('JWK.EmbeddedX5C JWS.verify pass', async t => {
    const key = JWK.asKey({ ...rsa, x5c })
    const jws = JWS.sign('foo', key, { x5c })
    t.notThrows(() => JWS.verify(jws, JWK.EmbeddedX5C))
    t.throws(
      () => JWS.verify(jws, JWK.EmbeddedX5C, { algorithms: ['EdDSA'] }),
      { instanceOf: errors.JOSEAlgNotWhitelisted, code: 'ERR_JOSE_ALG_NOT_WHITELISTED', message: 'alg not whitelisted' }
    )
    const { key: embedded } = JWS.verify(jws, JWK.EmbeddedX5C, { complete: true })
    t.false(key === embedded)
    t.deepEqual(key.toJWK(), embedded.toJWK())
  })

  test('JWK.EmbeddedX5C JWT.verify pass', async t => {
    const key = JWK.asKey({ ...rsa, x5c })
    const jws = JWT.sign({}, key, { header: { x5c } })
    t.notThrows(() => JWT.verify(jws, JWK.EmbeddedX5C))
    t.throws(
      () => JWT.verify(jws, JWK.EmbeddedX5C, { algorithms: ['EdDSA'] }),
      { instanceOf: errors.JOSEAlgNotWhitelisted, code: 'ERR_JOSE_ALG_NOT_WHITELISTED', message: 'alg not whitelisted' }
    )
    const { key: embedded } = JWT.verify(jws, JWK.EmbeddedX5C, { complete: true })
    t.false(key === embedded)
    t.deepEqual(key.toJWK(), embedded.toJWK())
  })

  test('JWK.EmbeddedJWK key must be a properly formatted cert value', async t => {
    const key = JWK.asKey({ ...rsa, x5c })
    const jws = JWS.sign('foo', key, { x5c: [x5c[0].slice(0, 16)] })
    t.throws(
      () => JWS.verify(jws, JWK.EmbeddedX5C),
      { instanceOf: errors.JWKImportFailed, code: 'ERR_JWK_IMPORT_FAILED', message: 'key import failed' }
    )
  })

  test('JWK.EmbeddedX5C key invalid inputs', async t => {
    const key = JWK.asKey({ ...rsa, x5c })
    for (const x5c of [undefined, '', null, false, true, 1, 3.14, []]) {
      {
        const jws = JWS.sign('foo', key, { x5c })
        t.throws(
          () => JWS.verify(jws, JWK.EmbeddedX5C),
          { instanceOf: errors.JWSInvalid, code: 'ERR_JWS_INVALID', message: 'JWS Header Parameter "x5c" must be a JSON array of certificate value strings' }
        )
      }
      {
        const jws = JWS.sign('foo', key, { x5c: [x5c] })
        t.throws(
          () => JWS.verify(jws, JWK.EmbeddedX5C),
          { instanceOf: errors.JWSInvalid, code: 'ERR_JWS_INVALID', message: 'JWS Header Parameter "x5c" must be a JSON array of certificate value strings' }
        )
      }
    }
  })
}
