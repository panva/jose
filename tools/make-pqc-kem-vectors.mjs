import { createMlKem1024, createMlKem512, createMlKem768 } from 'mlkem'
import {
  FlattenedEncrypt,
  flattenedDecrypt,
  base64url,
} from '../dist/webapi/index.js'

const encoder = new TextEncoder()
const plaintext = encoder.encode('pqc kem test payload')
const aad = encoder.encode('external-aad')
const kemSeed = sequence(32, 0xa0)
const iv = sequence(12, 0xb0)

const vectors = [
  ['ML-KEM-512', 'A128GCM', createMlKem512],
  ['ML-KEM-768', 'A192GCM', createMlKem768],
  ['ML-KEM-1024', 'A256GCM', createMlKem1024],
  ['ML-KEM-512+A128KW', 'A128GCM', createMlKem512],
  ['ML-KEM-768+A192KW', 'A192GCM', createMlKem768],
  ['ML-KEM-1024+A256KW', 'A256GCM', createMlKem1024],
]

function sequence(length, start) {
  const out = new Uint8Array(length)
  for (let i = 0; i < out.length; i++) out[i] = (start + i) & 0xff
  return out
}

function cek(enc) {
  switch (enc) {
    case 'A128GCM':
      return sequence(16, 0xc0)
    case 'A192GCM':
      return sequence(24, 0xc0)
    case 'A256GCM':
      return sequence(32, 0xc0)
    default:
      throw new Error(`unsupported enc ${enc}`)
  }
}

function keyAlg(alg) {
  return alg.split('+')[0]
}

function wrap(text, width = 68) {
  const lines = []
  for (let i = 0; i < text.length; i += width) {
    lines.push(text.slice(i, i + width))
  }
  return lines.join('\\\n')
}

function json(obj) {
  return JSON.stringify(obj, null, 2)
}

async function makeVector(alg, enc, createKem) {
  const privateSeed = sequence(64, alg.includes('1024') ? 0x30 : alg.includes('768') ? 0x20 : 0x10)
  const kem = await createKem()
  const [pub] = kem.deriveKeyPair(privateSeed)
  const publicJwk = {
    kty: 'AKP',
    alg: keyAlg(alg),
    pub: base64url.encode(pub),
  }
  const privateJwk = {
    ...publicJwk,
    priv: base64url.encode(privateSeed),
  }

  let builder = new FlattenedEncrypt(plaintext)
    .setProtectedHeader({ alg, enc })
    .setAdditionalAuthenticatedData(aad)
    .setInitializationVector(iv)
    .setKeyManagementParameters({ kemSeed })

  if (alg.includes('+')) {
    builder = builder.setContentEncryptionKey(cek(enc))
  }

  const jwe = await builder.encrypt(publicJwk)
  const decrypted = await flattenedDecrypt(jwe, privateJwk, {
    keyManagementAlgorithms: [alg],
    contentEncryptionAlgorithms: [enc],
  })
  if (new TextDecoder().decode(decrypted.plaintext) !== 'pqc kem test payload') {
    throw new Error(`failed to decrypt ${alg}`)
  }

  return { alg, enc, publicJwk, privateJwk, jwe }
}

const generated = []
for (const vector of vectors) {
  generated.push(await makeVector(...vector))
}

console.log(`# Test Vectors
{: numbered="false"}

The following test vectors are non-normative. They are generated with the
experimental JOSE implementation used during development of this draft.

The vectors use the following common inputs:

* Plaintext: "pqc kem test payload"
* AAD: "external-aad"
* KEM encapsulation seed (hex):

~~~
${Buffer.from(kemSeed).toString('hex')}
~~~

* JWE initialization vector (hex):

~~~
${Buffer.from(iv).toString('hex')}
~~~

For the key-wrap examples, the CEK is the leftmost bytes of:

~~~
${Buffer.from(sequence(32, 0xc0)).toString('hex')}
~~~

The AKP private key parameter \`priv\` is the 64-octet ML-KEM seed \`d || z\`.
The first 32 octets are \`d\`; the last 32 octets are \`z\`. The public key and
expanded private key are derived from this seed using \`ML-KEM.KeyGen_internal(d,
z)\`, as specified in FIPS 203.

=============== NOTE: '\\' line wrapping per RFC 8792 ================
`)

for (const { alg, publicJwk, privateJwk, jwe } of generated) {
  console.log(`## ${alg}
{: numbered="false"}

Public JWK:

~~~ json
${json(publicJwk)}
~~~

Private JWK:

~~~ json
${json(privateJwk)}
~~~

Flattened JWE JSON Serialization:

~~~ json
${json({
  protected: wrap(jwe.protected),
  encrypted_key: jwe.encrypted_key ? wrap(jwe.encrypted_key) : undefined,
  aad: jwe.aad,
  iv: jwe.iv,
  ciphertext: jwe.ciphertext,
  tag: jwe.tag,
}).replace(/,\n  "encrypted_key": undefined/, '')}
~~~
`)
}
