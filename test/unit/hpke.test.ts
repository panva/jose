import test from 'ava'
import {
  CipherSuite,
  KEM_DHKEM_P256_HKDF_SHA256,
  KEM_DHKEM_X25519_HKDF_SHA256,
  KDF_HKDF_SHA256,
  AEAD_AES_128_GCM,
  AEAD_AES_256_GCM,
  AEAD_ChaCha20Poly1305,
  type KEMFactory,
  type KDFFactory,
  type AEADFactory,
} from 'hpke'
import { Seal, Open } from '../../src/lib/hpke.js'

interface SuiteConfig {
  alg: string
  kem: KEMFactory
  kdf: KDFFactory
  aead: AEADFactory
  algorithm: EcKeyGenParams | KeyAlgorithm
}

const configs: SuiteConfig[] = [
  {
    alg: 'HPKE-0',
    kem: KEM_DHKEM_P256_HKDF_SHA256,
    kdf: KDF_HKDF_SHA256,
    aead: AEAD_AES_128_GCM,
    algorithm: { name: 'ECDH', namedCurve: 'P-256' },
  },
  {
    alg: 'HPKE-7',
    kem: KEM_DHKEM_P256_HKDF_SHA256,
    kdf: KDF_HKDF_SHA256,
    aead: AEAD_AES_256_GCM,
    algorithm: { name: 'ECDH', namedCurve: 'P-256' },
  },
  {
    alg: 'HPKE-4',
    kem: KEM_DHKEM_X25519_HKDF_SHA256,
    kdf: KDF_HKDF_SHA256,
    aead: AEAD_ChaCha20Poly1305,
    algorithm: { name: 'X25519' },
  },
]

async function generateKeyPair(algorithm: EcKeyGenParams | KeyAlgorithm) {
  return (await crypto.subtle.generateKey(algorithm, true, ['deriveBits'])) as CryptoKeyPair
}

for (const { alg, kem, kdf, aead, algorithm } of configs) {
  const isSupported =
    alg !== 'HPKE-4' || SubtleCrypto.supports?.('generateKey', 'ChaCha20-Poly1305')

  const run = isSupported ? test : test.skip

  run(`${alg}: hpke module encrypts, jose decrypts (base mode)`, async (t) => {
    const kp = await generateKeyPair(algorithm)

    const suite = new CipherSuite(kem, kdf, aead)
    const plaintext = crypto.getRandomValues(new Uint8Array(32))
    const aadBytes = crypto.getRandomValues(new Uint8Array(16))
    const info = new Uint8Array()

    const { encapsulatedSecret, ciphertext } = await suite.Seal(kp.publicKey, plaintext, {
      aad: aadBytes,
      info,
    })

    const decrypted = await Open(
      alg,
      new Uint8Array(encapsulatedSecret),
      kp.privateKey,
      info,
      aadBytes,
      new Uint8Array(ciphertext),
    )

    t.deepEqual([...decrypted], [...plaintext])
  })

  run(`${alg}: jose encrypts, hpke module decrypts (base mode)`, async (t) => {
    const kp = await generateKeyPair(algorithm)

    const suite = new CipherSuite(kem, kdf, aead)
    const plaintext = crypto.getRandomValues(new Uint8Array(32))
    const aadBytes = crypto.getRandomValues(new Uint8Array(16))
    const info = new Uint8Array()

    const { enc, ct } = await Seal(alg, kp.publicKey, info, aadBytes, plaintext)

    const decrypted = await suite.Open(kp, enc, ct, {
      aad: aadBytes,
      info,
    })

    t.deepEqual([...decrypted], [...plaintext])
  })

  run(`${alg}: hpke module encrypts, jose decrypts (PSK mode)`, async (t) => {
    const kp = await generateKeyPair(algorithm)

    const suite = new CipherSuite(kem, kdf, aead)
    const plaintext = crypto.getRandomValues(new Uint8Array(32))
    const aadBytes = crypto.getRandomValues(new Uint8Array(16))
    const info = new Uint8Array()
    const psk = crypto.getRandomValues(new Uint8Array(32))
    const pskId = crypto.getRandomValues(new Uint8Array(16))

    const { encapsulatedSecret, ciphertext } = await suite.Seal(kp.publicKey, plaintext, {
      aad: aadBytes,
      info,
      psk,
      pskId,
    })

    const decrypted = await Open(
      alg,
      new Uint8Array(encapsulatedSecret),
      kp.privateKey,
      info,
      aadBytes,
      new Uint8Array(ciphertext),
      psk,
      pskId,
    )

    t.deepEqual([...decrypted], [...plaintext])
  })

  run(`${alg}: jose encrypts, hpke module decrypts (PSK mode)`, async (t) => {
    const kp = await generateKeyPair(algorithm)

    const suite = new CipherSuite(kem, kdf, aead)
    const plaintext = crypto.getRandomValues(new Uint8Array(32))
    const aadBytes = crypto.getRandomValues(new Uint8Array(16))
    const info = new Uint8Array()
    const psk = crypto.getRandomValues(new Uint8Array(32))
    const pskId = crypto.getRandomValues(new Uint8Array(16))

    const { enc, ct } = await Seal(alg, kp.publicKey, info, aadBytes, plaintext, psk, pskId)

    const decrypted = await suite.Open(kp, enc, ct, {
      aad: aadBytes,
      info,
      psk,
      pskId,
    })

    t.deepEqual([...decrypted], [...plaintext])
  })

  run(`${alg}: interop with non-empty info`, async (t) => {
    const kp = await generateKeyPair(algorithm)

    const suite = new CipherSuite(kem, kdf, aead)
    const plaintext = crypto.getRandomValues(new Uint8Array(32))
    const aadBytes = crypto.getRandomValues(new Uint8Array(16))
    const info = new TextEncoder().encode('test application info')

    // hpke module -> jose
    {
      const { encapsulatedSecret, ciphertext } = await suite.Seal(kp.publicKey, plaintext, {
        aad: aadBytes,
        info,
      })

      const decrypted = await Open(
        alg,
        new Uint8Array(encapsulatedSecret),
        kp.privateKey,
        info,
        aadBytes,
        new Uint8Array(ciphertext),
      )

      t.deepEqual([...decrypted], [...plaintext])
    }

    // jose -> hpke module
    {
      const { enc, ct } = await Seal(alg, kp.publicKey, info, aadBytes, plaintext)

      const decrypted = await suite.Open(kp, enc, ct, {
        aad: aadBytes,
        info,
      })

      t.deepEqual([...decrypted], [...plaintext])
    }
  })
}
