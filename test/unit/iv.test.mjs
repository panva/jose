import test from 'ava'

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto'
Promise.all([import(`${root}/lib/iv`)]).then(
  ([{ default: iv }]) => {
    test('lib/iv.ts', (t) => {
      t.throws(() => iv('foo'), {
        code: 'ERR_JOSE_NOT_SUPPORTED',
        message: 'Unsupported JWE Algorithm: foo',
      })
    })
  },
  (err) => {
    test('failed to import', (t) => {
      console.error(err)
      t.fail()
    })
  },
)
