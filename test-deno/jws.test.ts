import { assert, assertThrowsAsync } from 'https://deno.land/std@0.104.0/testing/asserts.ts';

import generateKeyPair from '../dist/deno/util/generate_key_pair.ts';
import generateSecret from '../dist/deno/util/generate_secret.ts';
import random from '../dist/deno/util/random.ts';
import FlattenedSign from '../dist/deno/jws/flattened/sign.ts';
import verifyFlattened from '../dist/deno/jws/flattened/verify.ts';
import decodeProtectedHeader from '../dist/deno/util/decode_protected_header.ts';

async function test(generate: any, alg: string) {
  const generated = await generate();
  let privateKey: CryptoKey;
  let publicKey: CryptoKey;
  if (generated.type === 'secret') {
    publicKey = privateKey = generated;
  } else {
    ({ publicKey, privateKey } = generated);
  }

  const jws = await new FlattenedSign(random(new Uint8Array(32)))
    .setProtectedHeader({ alg })
    .sign(privateKey);

  assert(decodeProtectedHeader(jws));
  await verifyFlattened({ ...jws }, publicKey);
}

async function failing(...args) {
  return assertThrowsAsync(() => test(...args));
}

Deno.test(
  'Sign/Verify HS256',
  test.bind(undefined, () => generateSecret('HS256'), 'HS256'),
);

Deno.test(
  'Sign/Verify HS384',
  test.bind(undefined, () => generateSecret('HS384'), 'HS384'),
);

Deno.test(
  'Sign/Verify HS512',
  test.bind(undefined, () => generateSecret('HS512'), 'HS512'),
);

Deno.test(
  'Sign/Verify ES256',
  test.bind(undefined, () => generateKeyPair('ES256'), 'ES256'),
);

Deno.test(
  'Sign/Verify ES384',
  test.bind(undefined, () => generateKeyPair('ES384'), 'ES384'),
);

Deno.test(
  '(expecting failure) Sign/Verify ES512',
  failing.bind(undefined, () => generateKeyPair('ES512'), 'ES512'),
);

Deno.test(
  'Sign/Verify PS256',
  test.bind(undefined, () => generateKeyPair('PS256'), 'PS256'),
);

Deno.test(
  'Sign/Verify PS384',
  test.bind(undefined, () => generateKeyPair('PS384'), 'PS384'),
);

Deno.test(
  'Sign/Verify PS512',
  test.bind(undefined, () => generateKeyPair('PS512'), 'PS512'),
);

Deno.test(
  'Sign/Verify RS256',
  test.bind(undefined, () => generateKeyPair('RS256'), 'RS256'),
);

Deno.test(
  'Sign/Verify RS384',
  test.bind(undefined, () => generateKeyPair('RS384'), 'RS384'),
);

Deno.test(
  'Sign/Verify RS512',
  test.bind(undefined, () => generateKeyPair('RS512'), 'RS512'),
);
