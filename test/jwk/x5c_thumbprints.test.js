const test = require('ava')

const { keyObjectSupported } = require('../../lib/help/node_support')

if (!keyObjectSupported) return

const errors = require('../../lib/errors')

const { JWK: { asKey } } = require('../..')

const jwk = {
  kty: 'RSA',
  use: 'sig',
  kid: '1b94c',
  n: 'vrjOfz9Ccdgx5nQudyhdoR17V-IubWMeOZCwX_jj0hgAsz2J_pqYW08PLbK_PdiVGKPrqzmDIsLI7sA25VEnHU1uCLNwBuUiCO11_-7dYbsr4iJmG0Qu2j8DsVyT1azpJC_NG84Ty5KKthuCaPod7iI7w0LK9orSMhBEwwZDCxTWq4aYWAchc8t-emd9qOvWtVMDC2BXksRngh6X5bUYLy6AyHKvj-nUy1wgzjYQDwHMTplCoLtU-o-8SNnZ1tmRoGE9uJkBLdh5gFENabWnU5m1ZqZPdwS-qo-meMvVfJb6jJVWRpl2SUtCnYG2C32qvbWbjZ_jBPD5eunqsIo1vQ',
  e: 'AQAB',
  x5c: [
    'MIIDQjCCAiqgAwIBAgIGATz/FuLiMA0GCSqGSIb3DQEBBQUAMGIxCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJDTzEPMA0GA1UEBxMGRGVudmVyMRwwGgYDVQQKExNQaW5nIElkZW50aXR5IENvcnAuMRcwFQYDVQQDEw5CcmlhbiBDYW1wYmVsbDAeFw0xMzAyMjEyMzI5MTVaFw0xODA4MTQyMjI5MTVaMGIxCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJDTzEPMA0GA1UEBxMGRGVudmVyMRwwGgYDVQQKExNQaW5nIElkZW50aXR5IENvcnAuMRcwFQYDVQQDEw5CcmlhbiBDYW1wYmVsbDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAL64zn8/QnHYMeZ0LncoXaEde1fiLm1jHjmQsF/449IYALM9if6amFtPDy2yvz3YlRij66s5gyLCyO7ANuVRJx1NbgizcAblIgjtdf/u3WG7K+IiZhtELto/A7Fck9Ws6SQvzRvOE8uSirYbgmj6He4iO8NCyvaK0jIQRMMGQwsU1quGmFgHIXPLfnpnfajr1rVTAwtgV5LEZ4Iel+W1GC8ugMhyr4/p1MtcIM42EA8BzE6ZQqC7VPqPvEjZ2dbZkaBhPbiZAS3YeYBRDWm1p1OZtWamT3cEvqqPpnjL1XyW+oyVVkaZdklLQp2Btgt9qr21m42f4wTw+Xrp6rCKNb0CAwEAATANBgkqhkiG9w0BAQUFAAOCAQEAh8zGlfSlcI0o3rYDPBB07aXNswb4ECNIKG0CETTUxmXl9KUL+9gGlqCz5iWLOgWsnrcKcY0vXPG9J1r9AqBNTqNgHq2G03X09266X5CpOe1zFo+Owb1zxtp3PehFdfQJ610CDLEaS9V9Rqp17hCyybEpOGVwe8fnk+fbEL2Bo3UPGrpsHzUoaGpDftmWssZkhpBJKVMJyf/RuP2SmmaIzmnw9JiSlYhzo4tpzd5rFXhjRbg4zW9C+2qok+2+qDM1iJ684gPHMIY8aLWrdgQTxkumGmTqgawR+N5MDtdPTEQ0XfIBc2cJEUyMTY5MPvACWpkA6SdS4xSvdXK3IVfOWA=='
  ]
}

test('x5c can be imported and have their X.509 cert thumbprints calculated', t => {
  let key
  t.notThrows(() => { key = asKey(jwk) })
  t.deepEqual(key.x5c, jwk.x5c)
  const asJWK = key.toJWK()
  t.deepEqual(asJWK.x5c, jwk.x5c)
  ;[key.x5t, asJWK.x5t, key['x5t#S256'], asJWK['x5t#S256']].forEach((prop) => {
    t.truthy(prop)
    t.is(typeof prop, 'string')
  })
})

test('checks that x5c is an array of valid PKIX certificates', t => {
  ;[[], {}, false, 1].forEach((value) => {
    t.throws(() => {
      asKey({
        ...jwk,
        x5c: value
      })
    }, { instanceOf: TypeError, message: '`x5c` must be an array of one or more PKIX certificates when provided' })
    t.throws(() => {
      asKey({
        ...jwk,
        x5c: [value]
      })
    }, { instanceOf: TypeError, message: '`x5c` must be an array of one or more PKIX certificates when provided' })
  })
})

test('checks that first x5c member must represent the key', t => {
  t.throws(() => {
    asKey({
      ...jwk,
      x5c: [
        'MIIC/zCCAeegAwIBAgIJYdZUZz2rikftMA0GCSqGSIb3DQEBCwUAMB0xGzAZBgNVBAMTEnBhbnZhLmV1LmF1dGgwLmNvbTAeFw0xNzEwMTgxNTExMjBaFw0zMTA2MjcxNTExMjBaMB0xGzAZBgNVBAMTEnBhbnZhLmV1LmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKROvB+A+ZlFV1AXl75tVegjaCuBE7CiXHNstVZ/F6fKl6OvIRhAW3YKnJEglzVvHw0q46Nw48yBdbbKjdwGo1jbrI15D2+MYPy8xlMfDzEqNWBjOsgnA1nhFFDXD7wITwFRMtlRKVvKMa19QCmMFrpQ2qcloMne/DzSvxlEnVA6DG1SYqHR/gdK5hoRATJkwHXQ5F/nUxD3BOAyyjsU5RsGJAeVVS4Yf532xmziIbda3iV4LMUiHUb1v8Oy2sDncYF+imq/sbHGgE7dyv5R5AsYHGANgvIPMHJ1QTFSQVU0lxPy+EWnLk9abVOZYzD6O5YRdJ29UWVtQ1q5UcyrF18CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUSUcoPFHi/vm7dw1rt/IRmxvLMyowDgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQBcBXXBcbqliVOHkTgxocSYNUajcgIKjgeqG9RKFkbHfPuK/Hn80vQhd6mBKJTIyM7fY7DPh1/PjRsAyDQEwouHWItcM6iJBSdAkPq2DPfCkpUOi7MHrhXSouU1X4IOBvAl94k9Z8oj5k12KWVH8jZn5G03lwkWUgSfkLJ0Dh86+4sF2W4Dz2qZUXZuQbUL5eJcWRpfEZowff+T8xsiRjcIEpgfLz4nWonijtvEWESEa3bYpI9pI5OXLImgVJLGxVaUktsGIexQ6eM1AoxBYE7E+nbN/rwo30XWGbTkYecisySSYuzVn2c0xnC/8ZvW+gJ4SkzRDjlOAbm3R0r5j7b1'
      ]
    })
  }, { instanceOf: errors.JWKInvalid, code: 'ERR_JWK_INVALID', message: 'The key in the first `x5c` certificate MUST match the public key represented by the JWK' })
  t.throws(() => {
    asKey({
      ...jwk,
      x5c: [
        jwk.x5c[0],
        'MIIC/zCCAeegAwIBAgIJYdZUZz2rikftMA0GCSqGSIb3DQEBCwUAMB0xGzAZBgNVBAMTEnBhbnZhLmV1LmF1dGgwLmNvbTAeFw0xNzEwMTgxNTExMjBaFw0zMTA2MjcxNTExMjBaMB0xGzAZBgNVBAMTEnBhbnZhLmV1LmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKROvB+A+ZlFV1AXl75tVegjaCuBE7CiXHNstVZ/F6fKl6OvIRhAW3YKnJEglzVvHw0q46Nw48yBdbbKjdwGo1jbrI15D2+MYPy8xlMfDzEqNWBjOsgnA1nhFFDXD7wITwFRMtlRKVvKMa19QCmMFrpQ2qcloMne/DzSvxlEnVA6DG1SYqHR/gdK5hoRATJkwHXQ5F/nUxD3BOAyyjsU5RsGJAeVVS4Yf532xmziIbda3iV4LMUiHUb1v8Oy2sDncYF+imq/sbHGgE7dyv5R5AsYHGANgvIPMHJ1QTFSQVU0lxPy+EWnLk9abVOZYzD6O5YRdJ29UWVtQ1q5UcyrF18CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUSUcoPFHi/vm7dw1rt/IRmxvLMyowDgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQBcBXXBcbqliVOHkTgxocSYNUajcgIKjgeqG9RKFkbHfPuK/Hn80vQhd6mBKJTIyM7fY7DPh1/PjRsAyDQEwouHWItcM6iJBSdAkPq2DPfCkpUOi7MHrhXSouU1X4IOBvAl94k9Z8oj5k12KWVH8jZn5G03lwkWUgSfkLJ0Dh86+4sF2W4Dz2qZUXZuQbUL5eJcWRpfEZowff+T8xsiRjcIEpgfLz4nWonijtvEWESEa3bYpI9pI5OXLImgVJLGxVaUktsGIexQ6eM1AoxBYE7E+nbN/rwo30XWGbTkYecisySSYuzVn2c0xnC/8ZvW+gJ4SkzRDjlOAbm3R0r5j7b1f'
      ]
    })
  }, { instanceOf: errors.JWKInvalid, code: 'ERR_JWK_INVALID', message: '`x5c` member at index 1 is not a valid base64-encoded DER PKIX certificate' })
})
