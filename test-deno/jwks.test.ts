import { assertThrowsAsync } from 'https://deno.land/std@0.109.0/testing/asserts.ts'

import { createRemoteJWKSet, errors } from '../dist/deno/index.ts'

const jwksUri = 'https://www.googleapis.com/oauth2/v3/certs'

Deno.test('fetches the JWKSet', async () => {
  const response = await fetch(jwksUri).then((r) => r.json())
  const { alg, kid } = response.keys[0]
  const jwks = createRemoteJWKSet(new URL(jwksUri))
  await assertThrowsAsync(
    () => jwks({ alg: 'RS256' }, <any>null),
    errors.JWKSMultipleMatchingKeys,
    'multiple matching keys found in the JSON Web Key Set',
  )
  await assertThrowsAsync(
    () => jwks({ kid: 'foo', alg: 'RS256' }, <any>null),
    errors.JWKSNoMatchingKey,
    'no applicable key found in the JSON Web Key Set',
  )
  await jwks({ alg, kid }, <any>null)
})

Deno.test('timeout', async () => {
  const server = Deno.listen({ port: 3000 })
  const jwks = createRemoteJWKSet(new URL('http://localhost:3000'), { timeoutDuration: 0 })
  await assertThrowsAsync(
    () => jwks({ alg: 'RS256' }, <any>null),
    errors.JWKSTimeout,
    'request timed out',
  ).finally(async () => {
    const conn = await server.accept()
    conn.close()
    server.close()
  })
})
