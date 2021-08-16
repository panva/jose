import { assertStrictEquals } from 'https://deno.land/std@0.104.0/testing/asserts.ts';

import generateKeyPair from '../dist/deno/util/generate_key_pair.ts';

Deno.test('Generate PS256 keys', async () => {
  await generateKeyPair('PS256');
});

Deno.test('extractable', async () => {
  let { privateKey, publicKey } = await generateKeyPair('PS256');
  assertStrictEquals(publicKey.extractable, true);
  assertStrictEquals(privateKey.extractable, false);

  ({ privateKey } = await generateKeyPair('PS256', { extractable: true }));
  assertStrictEquals(privateKey.extractable, true);
});

Deno.test('Generate PS384 keys', async () => {
  await generateKeyPair('PS384');
});

Deno.test('Generate PS512 keys', async () => {
  await generateKeyPair('PS512');
});

Deno.test('Generate RS256 keys', async () => {
  await generateKeyPair('RS256');
});

Deno.test('Generate RS384 keys', async () => {
  await generateKeyPair('RS384');
});

Deno.test('Generate RS512 keys', async () => {
  await generateKeyPair('RS512');
});

Deno.test('Generate ES256 keys', async () => {
  await generateKeyPair('ES256');
});

Deno.test('Generate ES384 keys', async () => {
  await generateKeyPair('ES384');
});

Deno.test('Generate ES512 keys', async () => {
  await generateKeyPair('ES512');
});

Deno.test('Generate RSA-OAEP keys', async () => {
  await generateKeyPair('RSA-OAEP');
});

Deno.test('Generate RSA-OAEP-256 keys', async () => {
  await generateKeyPair('RSA-OAEP-256');
});

Deno.test('Generate RSA-OAEP-384 keys', async () => {
  await generateKeyPair('RSA-OAEP-384');
});

Deno.test('Generate RSA-OAEP-512 keys', async () => {
  await generateKeyPair('RSA-OAEP-512');
});

Deno.test('Generate ECDH-ES crv: P-256 keys', async () => {
  await generateKeyPair('ECDH-ES', { crv: 'P-256' });
});

Deno.test('Generate ECDH-ES crv: P-384 keys', async () => {
  await generateKeyPair('ECDH-ES', { crv: 'P-384' });
});

Deno.test('Generate ECDH-ES crv: P-521 keys', async () => {
  await generateKeyPair('ECDH-ES', { crv: 'P-521' });
});
