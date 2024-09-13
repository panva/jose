import test from 'ava'

const types = 'KeyObject, CryptoKey, Uint8Array, or JSON Web Key'
const asymmetricTypes = 'KeyObject, CryptoKey, or JSON Web Key'

const { checkKeyTypeWithJwk } = await import('#dist/lib/check_key_type')

for (const runtime of [await import('#dist'), await import('#dist/webapi').catch(() => {})]) {
  test[runtime ? 'serial' : 'skip'](
    `lib/check_key_type.ts with JWK in ${runtime?.cryptoRuntime}`,
    async (t) => {
      const type = runtime.cryptoRuntime === 'WebCryptoAPI' ? 'CryptoKey' : 'KeyObject'

      const expected = {
        instanceOf: TypeError,
        message: new RegExp(`^Key for the .+ algorithm must be (?:one )?of type ${types}\\.`),
      }

      t.throws(() => checkKeyTypeWithJwk('HS256'), expected)
      t.throws(() => checkKeyTypeWithJwk('HS256', undefined), expected)
      t.throws(() => checkKeyTypeWithJwk('HS256', null), expected)
      t.throws(() => checkKeyTypeWithJwk('HS256', 1), expected)
      t.throws(() => checkKeyTypeWithJwk('HS256', 0), expected)
      t.throws(() => checkKeyTypeWithJwk('HS256', true), expected)
      t.throws(() => checkKeyTypeWithJwk('HS256', Boolean), expected)
      t.throws(() => checkKeyTypeWithJwk('HS256', []), expected)
      t.throws(() => checkKeyTypeWithJwk('HS256', ''), expected)
      t.throws(() => checkKeyTypeWithJwk('HS256', 'foo'), expected)

      t.throws(() => checkKeyTypeWithJwk('PS256', new Uint8Array()), {
        ...expected,
        message: new RegExp(
          `^Key for the .+ algorithm must be (?:one )?of type ${asymmetricTypes}\\.`,
        ),
      })

      t.notThrows(() => checkKeyTypeWithJwk('HS256', { kty: 'oct', k: '' }))
      t.notThrows(() => checkKeyTypeWithJwk('HS256', { kty: 'oct', k: '', use: 'sig' }))
      t.notThrows(() =>
        checkKeyTypeWithJwk('HS256', { kty: 'oct', k: '', key_ops: ['sign'] }, 'sign'),
      )
      t.notThrows(() => checkKeyTypeWithJwk('HS256', { kty: 'oct', k: '', alg: 'HS256' }))

      t.throws(() => checkKeyTypeWithJwk('HS256', { kty: 'oct', k: '', use: 'enc' }), {
        ...expected,
        message: 'Invalid key for this operation, when present its use must be sig',
      })

      t.throws(() => checkKeyTypeWithJwk('HS256', { kty: 'oct', k: '', alg: 'HS384' }), {
        ...expected,
        message: 'Invalid key for this operation, when present its alg must be HS256',
      })

      t.throws(
        () => checkKeyTypeWithJwk('HS256', { kty: 'oct', k: '', key_ops: ['sign'] }, 'verify'),
        {
          ...expected,
          message: 'Invalid key for this operation, when present its key_ops must include verify',
        },
      )

      t.throws(() => checkKeyTypeWithJwk('HS256', { kty: 'RSA' }), {
        ...expected,
        message:
          'JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present',
      })

      t.notThrows(() => checkKeyTypeWithJwk('PS256', { kty: 'RSA' }, 'verify'))
      t.throws(() => checkKeyTypeWithJwk('PS256', { kty: 'RSA', d: '' }, 'verify'), {
        ...expected,
        message: 'JSON Web Key for this operation be a public JWK',
      })

      t.notThrows(() => checkKeyTypeWithJwk('PS256', { kty: 'RSA', d: '' }, 'sign'))
      t.throws(() => checkKeyTypeWithJwk('PS256', { kty: 'RSA' }, 'sign'), {
        ...expected,
        message: 'JSON Web Key for this operation be a private JWK',
      })
    },
  )
}
