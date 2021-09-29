import { assertThrowsAsync } from 'https://deno.land/std@0.109.0/testing/asserts.ts';

import createRemoteJWKSet from '../dist/deno/jwks/remote.ts';
import { JWKSNoMatchingKey, JWKSMultipleMatchingKeys } from '../dist/deno/util/errors.ts';

const jwksUri = 'https://www.googleapis.com/oauth2/v3/certs';

Deno.test('fetches the JWKSet', async () => {
  const response = await fetch(jwksUri).then((r) => r.json());
  const { alg, kid } = response.keys[0];
  const jwks = createRemoteJWKSet(new URL(jwksUri));
  await assertThrowsAsync(
    () => jwks({ alg: 'RS256' }, <any>null),
    JWKSMultipleMatchingKeys,
    'multiple matching keys found in the JSON Web Key Set',
  );
  await assertThrowsAsync(
    () => jwks({ kid: 'foo', alg: 'RS256' }, <any>null),
    JWKSNoMatchingKey,
    'no applicable key found in the JSON Web Key Set',
  );
  await jwks({ alg, kid }, <any>null);
});
