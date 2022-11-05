import type QUnit from 'qunit'
import type * as jose from '../src/index.js'

export default (QUnit: QUnit, lib: typeof jose) => {
  const { module, test } = QUnit
  module('jwks.ts')

  const jwksUri = 'https://www.googleapis.com/oauth2/v3/certs'

  test('fetches the JWKSet', async (t: typeof QUnit.assert) => {
    const response = await fetch(jwksUri).then((r) => r.json())
    const { alg, kid } = response.keys[0]
    const jwks = lib.createRemoteJWKSet(new URL(jwksUri))
    await t.rejects(
      (async () => jwks({ alg: 'RS256' }, <any>{}))(),
      'multiple matching keys found in the JSON Web Key Set',
    )
    await t.rejects(
      (async () => jwks({ kid: 'foo', alg: 'RS256' }, <any>{}))(),
      'no applicable key found in the JSON Web Key Set',
    )
    t.ok(await jwks({ alg, kid }, <any>{}))
  })
}
