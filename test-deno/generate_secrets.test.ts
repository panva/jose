import { assertStrictEquals } from 'https://deno.land/std@0.104.0/testing/asserts.ts';

import generateSecret from '../dist/deno/util/generate_secret.ts';

Deno.test('Generate HS256 secret', async () => {
  await generateSecret('HS256');
});

Deno.test('extractable', async () => {
  let secret = await generateSecret('HS256');
  assertStrictEquals(secret.extractable, false);
  secret = await generateSecret('HS256', { extractable: true });
  assertStrictEquals(secret.extractable, true);
});

Deno.test('Generate HS384 secret', async () => {
  await generateSecret('HS384');
});

Deno.test('Generate HS512 secret', async () => {
  await generateSecret('HS512');
});

Deno.test('Generate A128CBC-HS256 secret', async () => {
  await generateSecret('A128CBC-HS256');
});

Deno.test('Generate A192CBC-HS384 secret', async () => {
  await generateSecret('A192CBC-HS384');
});

Deno.test('Generate A256CBC-HS512 secret', async () => {
  await generateSecret('A256CBC-HS512');
});

Deno.test('Generate A128KW secret', async () => {
  await generateSecret('A128KW');
});

Deno.test('Generate A192KW secret', async () => {
  await generateSecret('A192KW');
});

Deno.test('Generate A256KW secret', async () => {
  await generateSecret('A256KW');
});

Deno.test('Generate A128GCMKW secret', async () => {
  await generateSecret('A128GCMKW');
});

Deno.test('Generate A192GCMKW secret', async () => {
  await generateSecret('A192GCMKW');
});

Deno.test('Generate A256GCMKW secret', async () => {
  await generateSecret('A256GCMKW');
});

Deno.test('Generate A128GCM secret', async () => {
  await generateSecret('A128GCM');
});

Deno.test('Generate A192GCM secret', async () => {
  await generateSecret('A192GCM');
});

Deno.test('Generate A256GCM secret', async () => {
  await generateSecret('A256GCM');
});
