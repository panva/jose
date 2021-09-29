import { assert } from 'https://deno.land/std@0.109.0/testing/asserts.ts';

import generateSecret from '../dist/deno/util/generate_secret.ts';
import random from '../dist/deno/util/random.ts';
import FlattenedEncrypt from '../dist/deno/jwe/flattened/encrypt.ts';
import decryptFlattened from '../dist/deno/jwe/flattened/decrypt.ts';
import decodeProtectedHeader from '../dist/deno/util/decode_protected_header.ts';

async function test(
  generate: () => ReturnType<typeof generateSecret>,
  { alg, enc }: { [key: string]: string },
) {
  const secretKey = await generate();

  const jwe = await new FlattenedEncrypt(random(new Uint8Array(32)))
    .setProtectedHeader({ alg, enc })
    .setAdditionalAuthenticatedData(random(new Uint8Array(32)))
    .encrypt(secretKey);

  assert(decodeProtectedHeader(jwe));
  await decryptFlattened(jwe, secretKey);
}

Deno.test(
  'Encrypt/Decrypt A128CBC-HS256',
  test.bind(undefined, generateSecret.bind(undefined, 'A128CBC-HS256'), {
    alg: 'dir',
    enc: 'A128CBC-HS256',
  }),
);

Deno.test(
  'Encrypt/Decrypt A128GCM',
  test.bind(undefined, generateSecret.bind(undefined, 'A128GCM'), {
    alg: 'dir',
    enc: 'A128GCM',
  }),
);

Deno.test(
  'Encrypt/Decrypt A192CBC-HS384',
  test.bind(undefined, generateSecret.bind(undefined, 'A192CBC-HS384'), {
    alg: 'dir',
    enc: 'A192CBC-HS384',
  }),
);

Deno.test(
  'Encrypt/Decrypt A192GCM',
  test.bind(undefined, generateSecret.bind(undefined, 'A192GCM'), {
    alg: 'dir',
    enc: 'A192GCM',
  }),
);

Deno.test(
  'Encrypt/Decrypt A256CBC-HS512',
  test.bind(undefined, generateSecret.bind(undefined, 'A256CBC-HS512'), {
    alg: 'dir',
    enc: 'A256CBC-HS512',
  }),
);

Deno.test(
  'Encrypt/Decrypt A256GCM',
  test.bind(undefined, generateSecret.bind(undefined, 'A256GCM'), {
    alg: 'dir',
    enc: 'A256GCM',
  }),
);

Deno.test(
  'Encrypt/Decrypt A128GCMKW',
  test.bind(undefined, generateSecret.bind(undefined, 'A128GCMKW'), {
    alg: 'A128GCMKW',
    enc: 'A256GCM',
  }),
);

Deno.test(
  'Encrypt/Decrypt A128KW',
  test.bind(undefined, generateSecret.bind(undefined, 'A128KW'), {
    alg: 'A128KW',
    enc: 'A256GCM',
  }),
);

Deno.test(
  'Encrypt/Decrypt A192GCMKW',
  test.bind(undefined, generateSecret.bind(undefined, 'A192GCMKW'), {
    alg: 'A192GCMKW',
    enc: 'A256GCM',
  }),
);

Deno.test(
  'Encrypt/Decrypt A192KW',
  test.bind(undefined, generateSecret.bind(undefined, 'A192KW'), {
    alg: 'A192KW',
    enc: 'A256GCM',
  }),
);

Deno.test(
  'Encrypt/Decrypt A256GCMKW',
  test.bind(undefined, generateSecret.bind(undefined, 'A256GCMKW'), {
    alg: 'A256GCMKW',
    enc: 'A256GCM',
  }),
);

Deno.test(
  'Encrypt/Decrypt A256KW',
  test.bind(undefined, generateSecret.bind(undefined, 'A256KW'), {
    alg: 'A256KW',
    enc: 'A256GCM',
  }),
);

Deno.test(
  'Encrypt/Decrypt PBES2-HS256+A128KW',
  test.bind(undefined, async () => random(new Uint8Array(10)), {
    alg: 'PBES2-HS256+A128KW',
    enc: 'A256GCM',
  }),
);

Deno.test(
  'Encrypt/Decrypt PBES2-HS384+A192KW',
  test.bind(undefined, async () => random(new Uint8Array(10)), {
    alg: 'PBES2-HS384+A192KW',
    enc: 'A256GCM',
  }),
);

Deno.test(
  'Encrypt/Decrypt PBES2-HS512+A256KW',
  test.bind(undefined, async () => random(new Uint8Array(10)), {
    alg: 'PBES2-HS512+A256KW',
    enc: 'A256GCM',
  }),
);
