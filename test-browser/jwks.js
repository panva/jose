import createRemoteJWKSet from '../dist/browser/jwks/remote';

const jwksUri = 'https://www.googleapis.com/oauth2/v3/certs';

QUnit.test('fetches the JWKSet', async (assert) => {
  const response = await fetch(jwksUri).then((r) => r.json());
  const { alg, kid } = response.keys[0];
  const jwks = createRemoteJWKSet(new URL(jwksUri));
  await assert.rejects(
    jwks({ alg: 'RS256' }),
    'multiple matching keys found in the JSON Web Key Set',
  );
  await assert.rejects(
    jwks({ kid: 'foo', alg: 'RS256' }),
    'no applicable key found in the JSON Web Key Set',
  );
  assert.ok(await jwks({ alg, kid }));
});
