import test from 'ava'

import * as base64url from '../../src/util/base64url.js'

// RFC 4648 Section 5 defines the Base64URL alphabet as A-Z, a-z, 0-9, "-" and "_". "+" and "/"
// belong to the standard Base64 alphabet of Section 4 and are not part of it.
test('characters outside the Base64URL alphabet are rejected', (t) => {
  for (const input of ['a+b/', 'a+bc', 'ab/c', '+', '/', 'ab!c', 'ab.c']) {
    t.throws(() => base64url.decode(input), {
      instanceOf: TypeError,
      message: 'The input to be decoded is not correctly encoded.',
    })
  }
})

// "-" and "_" alias to "+" and "/" when translated to the standard alphabet, so accepting the
// latter would decode two distinct inputs to the same octets.
test('the Base64URL alphabet does not alias the standard one', (t) => {
  t.deepEqual([...base64url.decode('a-b_')], [107, 230, 255])
  t.throws(() => base64url.decode('a+b/'))
})

test('the Base64URL alphabet is accepted', (t) => {
  t.deepEqual([...base64url.decode('YWJj')], [97, 98, 99])
  t.deepEqual([...base64url.decode('YWJ')], [97, 98])
  t.deepEqual([...base64url.decode('YQ')], [97])
  t.deepEqual([...base64url.decode('YW==')], [97])
  t.deepEqual([...base64url.decode('')], [])
  t.deepEqual([...base64url.decode(new TextEncoder().encode('YWJj'))], [97, 98, 99])
})

test('a round trip preserves the input', (t) => {
  const bytes = crypto.getRandomValues(new Uint8Array(128))
  const encoded = base64url.encode(bytes)
  t.regex(encoded, /^[A-Za-z0-9_-]*$/)
  t.deepEqual([...base64url.decode(encoded)], [...bytes])
})
