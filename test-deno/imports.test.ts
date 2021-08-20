Deno.test('imports CompactEncrypt', async () => {
  await import('../dist/deno/jwe/compact/encrypt.ts');
});

Deno.test('imports FlattenedEncrypt', async () => {
  await import('../dist/deno/jwe/flattened/encrypt.ts');
});

Deno.test('imports CompactSign', async () => {
  await import('../dist/deno/jws/compact/sign.ts');
});

Deno.test('imports FlattenedSign', async () => {
  await import('../dist/deno/jws/flattened/sign.ts');
});

Deno.test('imports GeneralSign', async () => {
  await import('../dist/deno/jws/general/sign.ts');
});

Deno.test('imports EncryptJWT', async () => {
  await import('../dist/deno/jwt/encrypt.ts');
});

Deno.test('imports SignJWT', async () => {
  await import('../dist/deno/jwt/sign.ts');
});

Deno.test('imports UnsecuredJWT', async () => {
  await import('../dist/deno/jwt/unsecured.ts');
});

Deno.test('imports compactDecrypt', async () => {
  await import('../dist/deno/jwe/compact/decrypt.ts');
});

Deno.test('imports flattenedDecrypt', async () => {
  await import('../dist/deno/jwe/flattened/decrypt.ts');
});

Deno.test('imports generalDecrypt', async () => {
  await import('../dist/deno/jwe/general/decrypt.ts');
});

Deno.test('imports EmbeddedJWK', async () => {
  await import('../dist/deno/jwk/embedded.ts');
});

Deno.test('imports fromKeyLike', async () => {
  await import('../dist/deno/jwk/from_key_like.ts');
});

Deno.test('imports parseJwk', async () => {
  await import('../dist/deno/jwk/parse.ts');
});

Deno.test('imports calculateThumbprint', async () => {
  await import('../dist/deno/jwk/thumbprint.ts');
});

Deno.test('imports createRemoteJWKSet', async () => {
  await import('../dist/deno/jwks/remote.ts');
});

Deno.test('imports compactVerify', async () => {
  await import('../dist/deno/jws/compact/verify.ts');
});

Deno.test('imports flattenedVerify', async () => {
  await import('../dist/deno/jws/flattened/verify.ts');
});

Deno.test('imports generalVerify', async () => {
  await import('../dist/deno/jws/general/verify.ts');
});

Deno.test('imports jwtDecrypt', async () => {
  await import('../dist/deno/jwt/decrypt.ts');
});

Deno.test('imports jwtVerify', async () => {
  await import('../dist/deno/jwt/verify.ts');
});

Deno.test('imports decodeProtectedHeader', async () => {
  await import('../dist/deno/util/decode_protected_header.ts');
});

Deno.test('imports generateKeyPair', async () => {
  await import('../dist/deno/util/generate_key_pair.ts');
});

Deno.test('imports generateSecret', async () => {
  await import('../dist/deno/util/generate_secret.ts');
});
