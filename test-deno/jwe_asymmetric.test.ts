import { assert } from 'https://deno.land/std@0.104.0/testing/asserts.ts';

import generateKeyPair from '../dist/deno/util/generate_key_pair.ts';
import random from '../dist/deno/util/random.ts';
import FlattenedEncrypt from '../dist/deno/jwe/flattened/encrypt.ts';
import decryptFlattened from '../dist/deno/jwe/flattened/decrypt.ts';
import decodeProtectedHeader from '../dist/deno/util/decode_protected_header.ts';

async function test(generate, alg) {
  const { publicKey, privateKey } = await generate();

  const jwe = await new FlattenedEncrypt(random(new Uint8Array(32)))
    .setProtectedHeader({ alg, enc: 'A256GCM' })
    .setAdditionalAuthenticatedData(random(new Uint8Array(32)))
    .encrypt(publicKey);

  assert(decodeProtectedHeader(jwe));
  await decryptFlattened(jwe, privateKey);
}

for (const crv of ['P-256', 'P-384', 'P-521']) {
  Deno.test(
    `Encrypt/Decrypt ECDH-ES crv: ${crv}`,
    test.bind(undefined, generateKeyPair.bind(undefined, 'ECDH-ES', { crv }), 'ECDH-ES'),
  );
}

Deno.test(
  'Encrypt/Decrypt RSA-OAEP-256',
  test.bind(undefined, generateKeyPair.bind(undefined, 'RSA-OAEP-256'), 'RSA-OAEP-256'),
);
Deno.test(
  'Encrypt/Decrypt RSA-OAEP-384',
  test.bind(undefined, generateKeyPair.bind(undefined, 'RSA-OAEP-384'), 'RSA-OAEP-384'),
);
Deno.test(
  'Encrypt/Decrypt RSA-OAEP-512',
  test.bind(undefined, generateKeyPair.bind(undefined, 'RSA-OAEP-512'), 'RSA-OAEP-512'),
);
Deno.test(
  'Encrypt/Decrypt RSA-OAEP',
  test.bind(undefined, generateKeyPair.bind(undefined, 'RSA-OAEP'), 'RSA-OAEP'),
);
