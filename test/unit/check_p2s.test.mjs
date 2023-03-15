import test from 'ava'

const { default: checkP2s } = await import('#dist/lib/check_p2s')

test('lib/check_p2s.ts', (t) => {
  t.throws(() => checkP2s(null), {
    code: 'ERR_JWE_INVALID',
    message: 'PBES2 Salt Input must be 8 or more octets',
  })
  t.throws(() => checkP2s(new Uint8Array(7)), {
    code: 'ERR_JWE_INVALID',
    message: 'PBES2 Salt Input must be 8 or more octets',
  })
  t.notThrows(() => checkP2s(new Uint8Array(8)))
})
