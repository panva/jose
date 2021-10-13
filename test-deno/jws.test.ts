import {
  assert,
  assertThrowsAsync,
  unreachable,
} from 'https://deno.land/std@0.109.0/testing/asserts.ts';

import generateKeyPair from '../dist/deno/util/generate_key_pair.ts';
import generateSecret from '../dist/deno/util/generate_secret.ts';
import FlattenedSign from '../dist/deno/jws/flattened/sign.ts';
import verifyFlattened from '../dist/deno/jws/flattened/verify.ts';
import decodeProtectedHeader from '../dist/deno/util/decode_protected_header.ts';

async function test(
  generate: () => ReturnType<typeof generateKeyPair> | ReturnType<typeof generateSecret>,
  alg: string,
) {
  const generated = await generate();
  let privateKey;
  let publicKey;
  if ('type' in generated) {
    publicKey = privateKey = generated;
  } else if (generated instanceof Uint8Array) {
    unreachable();
  } else {
    ({ publicKey, privateKey } = generated);
  }

  const jws = await new FlattenedSign(crypto.getRandomValues(new Uint8Array(32)))
    .setProtectedHeader({ alg })
    .sign(privateKey);

  assert(decodeProtectedHeader(jws));
  await verifyFlattened({ ...jws }, publicKey);
}

async function failing(
  generate: () => ReturnType<typeof generateKeyPair> | ReturnType<typeof generateSecret>,
  alg: string,
) {
  return assertThrowsAsync(() => test(generate, alg));
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
