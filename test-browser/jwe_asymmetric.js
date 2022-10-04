import {
  generateKeyPair,
  FlattenedEncrypt,
  flattenedDecrypt,
  decodeProtectedHeader,
} from '../dist/browser/index.js'

async function test(generate, alg, assert) {
  const { publicKey, privateKey } = await generate()

  const jwe = await new FlattenedEncrypt(crypto.getRandomValues(new Uint8Array(32)))
    .setProtectedHeader({ alg, enc: 'A256GCM' })
    .setAdditionalAuthenticatedData(crypto.getRandomValues(new Uint8Array(32)))
    .encrypt(publicKey)

  assert.ok(decodeProtectedHeader(jwe))
  await flattenedDecrypt(jwe, privateKey)
  assert.ok(1)
}

for (const crv of ['P-256', 'P-384', 'P-521']) {
  QUnit.test(
    `ECDH-ES crv: ${crv}`,
    test.bind(undefined, generateKeyPair.bind(undefined, 'ECDH-ES', { crv }), 'ECDH-ES'),
  )
}

QUnit.test(
  'RSA-OAEP-256',
  test.bind(undefined, generateKeyPair.bind(undefined, 'RSA-OAEP-256'), 'RSA-OAEP-256'),
)
QUnit.test(
  'RSA-OAEP-384',
  test.bind(undefined, generateKeyPair.bind(undefined, 'RSA-OAEP-384'), 'RSA-OAEP-384'),
)
QUnit.test(
  'RSA-OAEP-512',
  test.bind(undefined, generateKeyPair.bind(undefined, 'RSA-OAEP-512'), 'RSA-OAEP-512'),
)
QUnit.test(
  'RSA-OAEP',
  test.bind(undefined, generateKeyPair.bind(undefined, 'RSA-OAEP'), 'RSA-OAEP'),
)
