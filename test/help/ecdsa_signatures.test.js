// TODO: include license from https://github.com/Brightspace/node-ecdsa-sig-formatter

const test = require('ava')

const { decodeToBuffer } = require('../../lib/help/base64url')
const { derToJose, joseToDer } = require('../../lib/help/ecdsa_signatures')

const CLASS_UNIVERSAL = 0
const PRIMITIVE_BIT = 0x20
const TAG_SEQ = (0x10 | PRIMITIVE_BIT) | (CLASS_UNIVERSAL << 6)
const TAG_INT = 0x02 | (CLASS_UNIVERSAL << 6)

test('.derToJose no signature', t => {
  t.throws(() => derToJose(), { instanceOf: TypeError, message: 'ECDSA signature must be a Buffer' })
})

test('.derToJose non buffer or base64 signature', t => {
  t.throws(() => derToJose(123), { instanceOf: TypeError, message: 'ECDSA signature must be a Buffer' })
})

test('.derToJose unknown algorithm', t => {
  t.throws(() => derToJose(decodeToBuffer('Zm9vLmJhci5iYXo'), 'foobar'), { instanceOf: Error, message: 'Unknown algorithm "foobar"' })
})

Object.entries({
  ES256: 32,
  ES384: 48,
  ES512: 66
}).forEach(([alg, len]) => {
  test(`.derToJose no seq (${alg})`, t => {
    const input = Buffer.alloc(10)
    input[0] = TAG_SEQ + 1 // not seq

    t.throws(() => {
      derToJose(input, alg)
    }, { instanceOf: Error, message: /expected "seq"/ })
  })

  test(`.derToJose seq length exceeding input (${alg})`, t => {
    const input = Buffer.alloc(10)
    input[0] = TAG_SEQ
    input[1] = 10

    t.throws(() => {
      derToJose(input, alg)
    }, { instanceOf: Error, message: /length/ })
  })

  test(`.derToJose r is not marked as int (${alg})`, t => {
    const input = Buffer.alloc(10)
    input[0] = TAG_SEQ
    input[1] = 8
    input[2] = TAG_INT + 1 // not int

    t.throws(() => {
      derToJose(input, alg)
    }, { instanceOf: Error, message: /expected "int".+"r"/ })
  })

  test(`.derToJose r length exceeds available input (${alg})`, t => {
    const input = Buffer.alloc(10)
    input[0] = TAG_SEQ
    input[1] = 8
    input[2] = TAG_INT
    input[3] = 5

    t.throws(() => {
      derToJose(input, alg)
    }, { instanceOf: Error, message: /"r".+length/ })
  })

  test(`.derToJose r length exceeds sensical param length (${alg})`, t => {
    const input = Buffer.alloc(len + 2 + 6)
    input[0] = TAG_SEQ
    input[1] = len + 2 + 4
    input[2] = TAG_INT
    input[3] = len + 2

    t.throws(() => {
      derToJose(input, alg)
    }, { instanceOf: Error, message: /"r".+length.+acceptable/ })
  })

  test(`.derToJose s is not marked as int (${alg})`, t => {
    const input = Buffer.alloc(10)
    input[0] = TAG_SEQ
    input[1] = 8
    input[2] = TAG_INT
    input[3] = 2
    input[4] = 0
    input[5] = 0
    input[6] = TAG_INT + 1 // not int

    t.throws(() => {
      derToJose(input, alg)
    }, { instanceOf: Error, message: /expected "int".+"s"/ })
  })

  test(`.derToJose s length exceeds available input (${alg})`, t => {
    const input = Buffer.alloc(10)
    input[0] = TAG_SEQ
    input[1] = 8
    input[2] = TAG_INT
    input[3] = 2
    input[4] = 0
    input[5] = 0
    input[6] = TAG_INT
    input[7] = 3

    t.throws(() => {
      derToJose(input, alg)
    }, { instanceOf: Error, message: /"s".+length/ })
  })

  test(`.derToJose s length does not consume available input (${alg})`, t => {
    const input = Buffer.alloc(10)
    input[0] = TAG_SEQ
    input[1] = 8
    input[2] = TAG_INT
    input[3] = 2
    input[4] = 0
    input[5] = 0
    input[6] = TAG_INT
    input[7] = 1

    t.throws(() => {
      derToJose(input, alg)
    }, { instanceOf: Error, message: /"s".+length/ })
  })

  test(`.derToJose s length exceeds sensical param length (${alg})`, t => {
    const input = Buffer.alloc(len + 2 + 8)
    input[0] = TAG_SEQ
    input[1] = len + 2 + 6
    input[2] = TAG_INT
    input[3] = 2
    input[4] = 0
    input[5] = 0
    input[6] = TAG_INT
    input[7] = len + 2

    t.throws(() => {
      derToJose(input, alg)
    }, { instanceOf: Error, message: /"s".+length.+acceptable/ })
  })
})

test('.joseToDer no signature', t => {
  t.throws(() => joseToDer(), { instanceOf: TypeError, message: 'ECDSA signature must be a Buffer' })
})

test('.joseToDer non buffer or base64 signature', t => {
  t.throws(() => joseToDer(123), { instanceOf: TypeError, message: 'ECDSA signature must be a Buffer' })
})

test('.joseToDer unknown algorithm', t => {
  t.throws(() => joseToDer(decodeToBuffer('Zm9vLmJhci5iYXo='), 'foobar'), { instanceOf: Error, message: /"foobar"/ })
})

test('.joseToDer incorrect signature length (ES256)', t => {
  t.throws(() => joseToDer(decodeToBuffer('Zm9vLmJhci5iYXo'), 'ES256'), { instanceOf: Error, message: /"64"/ })
})

test('.joseToDer incorrect signature length (ES384)', t => {
  t.throws(() => joseToDer(decodeToBuffer('Zm9vLmJhci5iYXo'), 'ES384'), { instanceOf: Error, message: /"96"/ })
})

test('.joseToDer incorrect signature length (ES512)', t => {
  t.throws(() => joseToDer(decodeToBuffer('Zm9vLmJhci5iYXo'), 'ES512'), { instanceOf: Error, message: '"ES512" signatures must be "132" bytes, saw "11"' })
})

test('ES256 should jose -> der -> jose', t => {
  const expected = decodeToBuffer('yA4WNemRpUreSh9qgMh_ePGqhgn328ghJ_HG7WOBKQV98eFNm3FIvweoiSzHvl49Z6YTdV4Up7NDD7UcZ-52cw')
  const der = joseToDer(expected, 'ES256')
  const actual = derToJose(der, 'ES256')

  t.deepEqual(actual, expected)
})

test('ES256 should der -> jose -> der', t => {
  const expected = decodeToBuffer('MEUCIQD0nDQE4uBS6JuklnyACfPQRB/LMEh5Stq6sAfp38k6ewIgHvhX59iuruBiFpVkg3dQKJ3+Wk29lJmXfxp6ciRdj+Q=')
  const jose = derToJose(expected, 'ES256')
  const actual = joseToDer(jose, 'ES256')

  t.deepEqual(actual, expected)
})

test('ES384 should jose -> der -> jose', t => {
  const expected = decodeToBuffer('TsS1fXqgq5S2lpjO-Tz5w6ZAKqNFuQ6PufvXRN2NRY2DEsQ3iUXdEcAzcMXNqVehkZ-NwUxdIvDqwKTGLYQYVhjBxkdnwm1T5VKG2v1BYFeDQ91sgBlVhHFzvFty5wCI')
  const der = joseToDer(expected, 'ES384')
  const actual = derToJose(der, 'ES384')

  t.deepEqual(actual, expected)
})

test('ES384 should der -> jose -> der', t => {
  const expected = decodeToBuffer('MGUCMADcY5icKo+sLF0YCh5eVzju55Elt3Dfu4geMMDnUlLNaEO8NiCFzCHeqMx7mW5GMwIxAI6sp8ihHjRJ0sn/WV6mZCxN6/5lEg1QZJ5eiUHYv2kBgmiJ/Yv1pnqqFY3gVDBp/g==')
  const jose = derToJose(expected, 'ES384')
  const actual = joseToDer(jose, 'ES384')

  t.deepEqual(actual, expected)
})

test('ES512 should jose -> der -> jose', t => {
  const expected = decodeToBuffer('AFKapY_5gq60n8NZ_C2iOQFov7sXgcMyDzCrnGsbvE7OlSBKbgj95aZ7GtdSdbw6joK2jjWJio8IgKNB9o11GdMTADfLUsv9oAJvmIApsmsPBAIe1vH8oeHYiDMBEz9OQcwS5eL-r1iO2v7oxzl9zZb1rA5kzBqS93ARCPKbjgcr602r')
  const der = joseToDer(expected, 'ES512')
  const actual = derToJose(der, 'ES512')

  t.deepEqual(actual, expected)
})

test('ES512 should der -> jose -> der', t => {
  const expected = decodeToBuffer('MIGHAkFgiYpVsYxx6XiQp2OXscRW/PrbEcoime/FftP+B7x4QVa+M3KZzXlfP66zKqjo7O3nwK2s8GbTftW8H4HwojzimwJCAYQNsozTpCo5nwIkBgelcfIQ0y/U/60TbNH1+rlKpFDCFs6Q1ro7R1tjtXoAUb9aPIOVyXGiSQX/+fcmmWs1rkJU')
  const jose = derToJose(expected, 'ES512')
  const actual = joseToDer(jose, 'ES512')

  t.deepEqual(actual, expected)
})
