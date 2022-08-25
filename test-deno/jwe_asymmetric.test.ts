import { assert, assertThrowsAsync } from 'https://deno.land/std@0.109.0/testing/asserts.ts'

import {
  generateKeyPair,
  FlattenedEncrypt,
  flattenedDecrypt,
  decodeProtectedHeader,
} from '../dist/deno/index.ts'

async function test(generate: () => ReturnType<typeof generateKeyPair>, alg: string) {
  const { publicKey, privateKey } = await generate()

  const jwe = await new FlattenedEncrypt(crypto.getRandomValues(new Uint8Array(32)))
    .setProtectedHeader({ alg, enc: 'A192CBC-HS384' })
    .setAdditionalAuthenticatedData(crypto.getRandomValues(new Uint8Array(32)))
    .encrypt(publicKey)

  assert(decodeProtectedHeader(jwe))
  await flattenedDecrypt(jwe, privateKey)
}

async function failing(generate: () => ReturnType<typeof generateKeyPair>, alg: string) {
  return assertThrowsAsync(() => test(generate, alg))
}

Deno.test(
  'Encrypt/Decrypt ECDH-ES crv: P-256',
  test.bind(undefined, generateKeyPair.bind(undefined, 'ECDH-ES', { crv: 'P-256' }), 'ECDH-ES'),
)
Deno.test(
  'Encrypt/Decrypt ECDH-ES crv: P-384',
  test.bind(undefined, generateKeyPair.bind(undefined, 'ECDH-ES', { crv: 'P-384' }), 'ECDH-ES'),
)
Deno.test(
  '(expecting failure) Encrypt/Decrypt ECDH-ES crv: P-521',
  failing.bind(undefined, generateKeyPair.bind(undefined, 'ECDH-ES', { crv: 'P-521' }), 'ECDH-ES'),
)
Deno.test(
  'Encrypt/Decrypt RSA-OAEP-256',
  test.bind(undefined, generateKeyPair.bind(undefined, 'RSA-OAEP-256'), 'RSA-OAEP-256'),
)
Deno.test(
  'Encrypt/Decrypt RSA-OAEP-384',
  test.bind(undefined, generateKeyPair.bind(undefined, 'RSA-OAEP-384'), 'RSA-OAEP-384'),
)
Deno.test(
  'Encrypt/Decrypt RSA-OAEP-512',
  test.bind(undefined, generateKeyPair.bind(undefined, 'RSA-OAEP-512'), 'RSA-OAEP-512'),
)
Deno.test(
  'Encrypt/Decrypt RSA-OAEP',
  test.bind(undefined, generateKeyPair.bind(undefined, 'RSA-OAEP'), 'RSA-OAEP'),
)
