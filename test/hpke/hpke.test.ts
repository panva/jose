import test from 'ava'

import * as HPKE from '../../src/lib/hpke.js'

function hexToUint8Array(hex: string): Uint8Array {
  return new Uint8Array(Buffer.from(hex, 'hex'))
}

function uint8tob64u(buf: Uint8Array): string {
  return Buffer.from(buf).toString('base64url')
}

type Vector = {
  info: Uint8Array
  pkRm: Uint8Array
  skRm: Uint8Array
  enc: Uint8Array
  pt: Uint8Array
  ct: Uint8Array
  aad: Uint8Array
  psk_id?: Uint8Array
  psk?: Uint8Array
}

const algs = {
  'HPKE-0': {
    suite: HPKE.getSuite('HPKE-0'),
    vectors: [] as Vector[],
  },
  'HPKE-1': {
    suite: HPKE.getSuite('HPKE-1'),
    vectors: [] as Vector[],
  },
  'HPKE-2': {
    suite: HPKE.getSuite('HPKE-2'),
    vectors: [] as Vector[],
  },
  'HPKE-3': {
    suite: HPKE.getSuite('HPKE-3'),
    vectors: [] as Vector[],
  },
  'HPKE-4': {
    suite: HPKE.getSuite('HPKE-4'),
    vectors: [] as Vector[],
  },
  'HPKE-7': {
    suite: HPKE.getSuite('HPKE-7'),
    vectors: [] as Vector[],
  },
}

async function getRecipientPrivateKey(vector: Vector, suite: HPKE.Suite) {
  const d = uint8tob64u(hexToUint8Array(vector.skRm))
  const pk = hexToUint8Array(vector.pkRm)
  let kty: string
  let crv: string
  let x: string
  let y: string
  let name: string
  let namedCurve: string
  switch (suite.KEM.Nsk) {
    case 32:
      name = pk.byteLength !== 32 ? 'ECDH' : 'X25519'
      if (pk.byteLength !== 32) namedCurve = 'P-256'
      if (namedCurve!) {
        crv = namedCurve
        x = uint8tob64u(pk.subarray(1, 33))
        y = uint8tob64u(pk.subarray(33))
      } else {
        crv = name
        x = uint8tob64u(pk)
      }
      break
    case 48:
      name = 'ECDH'
      namedCurve = crv = 'P-384'
      x = uint8tob64u(pk.subarray(1, 49))
      y = uint8tob64u(pk.subarray(49))
      break
    case 56:
      name = crv = 'X448'
      x = uint8tob64u(pk)
      break
    case 66:
      name = 'ECDH'
      namedCurve = crv = 'P-521'
      x = uint8tob64u(pk.subarray(1, 67))
      y = uint8tob64u(pk.subarray(67))
      break
    default:
      throw new Error('not implemented')
  }
  kty = name === 'ECDH' ? 'EC' : 'OKP'

  return await crypto.subtle.importKey(
    'jwk',
    {
      kty,
      crv,
      x,
      y: y!,
      d,
    },
    { name, namedCurve: namedCurve! },
    true,
    ['deriveBits'],
  )
}

test.before('collect vectors', async () => {
  const rawVectors = [
    ...(await fetch(
      'https://raw.githubusercontent.com/hpkewg/hpke-pq/refs/heads/main/test-vectors.json',
    ).then((r) => r.json())),
    ...(await fetch(
      'https://raw.githubusercontent.com/cfrg/draft-irtf-cfrg-hpke/refs/heads/master/test-vectors.json',
    ).then((r) => r.json())),
  ]

  for (const vector of rawVectors) {
    if (vector.mode !== 0x00 && vector.mode !== 0x01) {
      continue
    }
    const { kem_id, kdf_id, aead_id } = vector
    for (const { suite, vectors } of Object.values(algs)) {
      if (kem_id === suite.KEM.id && kdf_id === suite.KDF.id && aead_id === suite.AEAD.id) {
        vectors.push({
          info: hexToUint8Array(vector.info),
          skRm: hexToUint8Array(vector.skRm),
          pkRm: hexToUint8Array(vector.pkRm),
          enc: hexToUint8Array(vector.enc),
          aad: hexToUint8Array(vector.encryptions[0].aad),
          ct: hexToUint8Array(vector.encryptions[0].ct),
          pt: hexToUint8Array(vector.encryptions[0].pt),
          psk: vector.psk ? hexToUint8Array(vector.psk) : undefined,
          psk_id: vector.psk_id ? hexToUint8Array(vector.psk_id) : undefined,
        })
        break
      }
    }
  }
})

for (const [alg, { suite, vectors }] of Object.entries(algs)) {
  test(`${alg} vectors`, async (t) => {
    if (suite.AEAD.id === 0x0003 && !SubtleCrypto.supports?.('importKey', 'ChaCha20-Poly1305')) {
      t.plan(0)
      t.log(`${alg} is not supported in this runtime`)
      return
    }
    t.plan(vectors.length)
    if (!vectors.length) {
      t.log(`${alg} has no vectors`)
    }

    for (const vector of vectors) {
      const skR = await getRecipientPrivateKey(vector, suite)
      t.deepEqual(
        await HPKE.Open(
          alg,
          vector.enc,
          skR,
          vector.info,
          vector.aad,
          vector.ct,
          vector.psk,
          vector.psk_id,
        ),
        vector.pt,
      )
    }
  })
}

// RFC 5869 HKDF Test Vectors
// https://datatracker.ietf.org/doc/html/rfc5869#appendix-A

test('RFC 5869 Test Case 1: Basic test case with SHA-256', async (t) => {
  const hkdf = HPKE.getSuite('HPKE-0').KDF // SHA-256 HKDF

  const IKM = hexToUint8Array('0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b')
  const salt = hexToUint8Array('000102030405060708090a0b0c')
  const info = hexToUint8Array('f0f1f2f3f4f5f6f7f8f9')
  const L = 42

  const expectedPRK = hexToUint8Array(
    '077709362c2e32df0ddc3f0dc47bba6390b6c73bb50f9c3122ec844ad7c2b3e5',
  )
  const expectedOKM = hexToUint8Array(
    '3cb25f25faacd57a90434f64d0362f2a2d2d0a90cf1a5a4c5db02d56ecc4c5bf34007208d5b887185865',
  )

  const PRK = await hkdf.Extract(salt, IKM)
  t.deepEqual(PRK, expectedPRK, 'Extract output matches expected PRK')

  const OKM = await hkdf.Expand(PRK, info, L)
  t.deepEqual(OKM, expectedOKM, 'Expand output matches expected OKM')
})

test('RFC 5869 Test Case 2: Test with SHA-256 and longer inputs/outputs', async (t) => {
  const hkdf = HPKE.getSuite('HPKE-0').KDF // SHA-256 HKDF

  const IKM = hexToUint8Array(
    '000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f404142434445464748494a4b4c4d4e4f',
  )
  const salt = hexToUint8Array(
    '606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9fa0a1a2a3a4a5a6a7a8a9aaabacadaeaf',
  )
  const info = hexToUint8Array(
    'b0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdcecfd0d1d2d3d4d5d6d7d8d9dadbdcdddedfe0e1e2e3e4e5e6e7e8e9eaebecedeeeff0f1f2f3f4f5f6f7f8f9fafbfcfdfeff',
  )
  const L = 82

  const expectedPRK = hexToUint8Array(
    '06a6b88c5853361a06104c9ceb35b45cef760014904671014a193f40c15fc244',
  )
  const expectedOKM = hexToUint8Array(
    'b11e398dc80327a1c8e7f78c596a49344f012eda2d4efad8a050cc4c19afa97c59045a99cac7827271cb41c65e590e09da3275600c2f09b8367793a9aca3db71cc30c58179ec3e87c14c01d5c1f3434f1d87',
  )

  const PRK = await hkdf.Extract(salt, IKM)
  t.deepEqual(PRK, expectedPRK, 'Extract output matches expected PRK')

  const OKM = await hkdf.Expand(PRK, info, L)
  t.deepEqual(OKM, expectedOKM, 'Expand output matches expected OKM')
})

test('RFC 5869 Test Case 3: Test with SHA-256 and zero-length salt/info', async (t) => {
  const hkdf = HPKE.getSuite('HPKE-0').KDF // SHA-256 HKDF

  const IKM = hexToUint8Array('0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b')
  const salt = new Uint8Array()
  const info = new Uint8Array()
  const L = 42

  const expectedPRK = hexToUint8Array(
    '19ef24a32c717b167f33a91d6f648bdf96596776afdb6377ac434c1c293ccb04',
  )
  const expectedOKM = hexToUint8Array(
    '8da4e775a563c18f715f802a063c5a31b8a11f5c5ee1879ec3454e5f3c738d2d9d201395faa4b61a96c8',
  )

  const PRK = await hkdf.Extract(salt, IKM)
  t.deepEqual(PRK, expectedPRK, 'Extract output matches expected PRK')

  const OKM = await hkdf.Expand(PRK, info, L)
  t.deepEqual(OKM, expectedOKM, 'Expand output matches expected OKM')
})

test('HKDF Expand validation: PRK length must be at least HashLen', async (t) => {
  const hkdf = HPKE.getSuite('HPKE-0').KDF // SHA-256 HKDF

  const shortPRK = new Uint8Array(31)
  const info = new Uint8Array()
  const L = 42

  await t.throwsAsync(async () => await hkdf.Expand(shortPRK, info, L), {
    message: 'prk.byteLength at least Nh',
  })
})

test('HKDF Expand validation: L must be <= 255*HashLen', async (t) => {
  const hkdf = HPKE.getSuite('HPKE-0').KDF // SHA-256 HKDF

  const PRK = new Uint8Array(32)
  const info = new Uint8Array()
  const L = 256 * 32

  await t.throwsAsync(async () => await hkdf.Expand(PRK, info, L), {
    message: 'L must be <= 255*Nh',
  })
})
