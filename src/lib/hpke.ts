import type * as types from '../types.d.ts'
import { JWEInvalid } from '../util/errors.js'
import { concat, encode } from './buffer_utils.js'
import { checkEncCryptoKey } from './crypto_key.js'
import { decode as b64u } from '../util/base64url.js'

export interface Suite {
  KEM: KEM
  KDF: KDF
  AEAD: AEAD
}

const MODES = {
  base: 0x00,
  psk: 0x01,
}

interface CombinedSecrets {
  key: Uint8Array
  base_nonce: Uint8Array
}

// function xor(a: Uint8Array, b: Uint8Array): Uint8Array {
//   if (a.byteLength !== b.byteLength) {
//     throw new Error('byteLength mismatch')
//   }
//   const buf = new Uint8Array(a.byteLength)
//   for (let i = 0; i < a.byteLength; i++) {
//     buf[i] = a[i]! ^ b[i]!
//   }
//   return buf
// }

// function lengthPrefixed(x: Uint8Array) {
//   return concat(I2OSP(x.byteLength, 2), x)
// }

// async function LabeledDerive(
//   this: KDF,
//   suite_id: Uint8Array,
//   ikm: Uint8Array,
//   label: Uint8Array,
//   context: Uint8Array,
//   L: number,
// ): Promise<Uint8Array> {
//   const labeled_ikm = concat(
//     ikm,
//     encode('HPKE-v1'),
//     suite_id,
//     lengthPrefixed(label),
//     I2OSP(L, 2),
//     context,
//   )
//   return this.Derive(labeled_ikm, L)
// }

// const CombineSecretsOneStage: KDF['CombineSecrets'] = async function CombineSecretsOneStage(
//   suite_id,
//   mode,
//   shared_secret,
//   info,
//   psk,
//   psk_id,
//   Nk,
//   Nn,
// ) {
//   const secrets = concat(lengthPrefixed(psk), lengthPrefixed(shared_secret))

//   const context = concat(I2OSP(mode, 1), lengthPrefixed(psk_id), lengthPrefixed(info))

//   const secret = await LabeledDerive.call(
//     this,
//     suite_id,
//     secrets,
//     encode('secret'),
//     context,
//     Nk + Nn + this.Nh,
//   )

//   const key = secret.slice(0, Nk)
//   const base_nonce = secret.slice(Nk, Nk + Nn)

//   return { key, base_nonce }
// }

const CombineSecretsTwoStage: KDF['CombineSecrets'] = async function CombineSecretsTwoStage(
  suite_id,
  mode,
  shared_secret,
  info,
  psk,
  psk_id,
  Nk,
  Nn,
) {
  const [psk_id_hash, info_hash] = await Promise.all([
    LabeledExtract.call(this, suite_id, new Uint8Array(), encode('psk_id_hash'), psk_id),
    LabeledExtract.call(this, suite_id, new Uint8Array(), encode('info_hash'), info),
  ])
  const key_schedule_context = concat(I2OSP(mode, 1), psk_id_hash, info_hash)
  const secret = await LabeledExtract.call(this, suite_id, shared_secret, encode('secret'), psk)

  const [key, base_nonce] = await Promise.all([
    LabeledExpand.call(this, suite_id, secret, encode('key'), key_schedule_context, Nk),
    LabeledExpand.call(this, suite_id, secret, encode('base_nonce'), key_schedule_context, Nn),
  ])

  return { key, base_nonce }
}

interface KDF {
  id: number
  // type: 'KDF'
  // name: string
  Nh: number
  Extract(this: KDF, salt: Uint8Array, ikm: Uint8Array): Promise<Uint8Array>
  Expand(this: KDF, prk: Uint8Array, info: Uint8Array, L: number): Promise<Uint8Array>
  // Derive(this: KDF, labeled_ikm: Uint8Array, L: number): Promise<Uint8Array>
  CombineSecrets(
    this: KDF,
    suite_id: Uint8Array,
    mode: number,
    shared_secret: Uint8Array,
    info: Uint8Array,
    psk: Uint8Array,
    psk_id: Uint8Array,
    Nk: number,
    Nn: number,
  ): Promise<CombinedSecrets>
}

interface HKDF extends KDF {
  hash: string
}

type KDF_BASE = Pick<KDF, 'Expand' | 'Extract' | 'CombineSecrets' /*| 'Derive'*/>

const HKDF_SHARED: KDF_BASE = {
  // Derive() {
  //   throw new Error('n/a')
  // },
  async Extract(this: HKDF, salt: Uint8Array<ArrayBuffer>, ikm: Uint8Array<ArrayBuffer>) {
    if (salt.byteLength === 0) {
      salt = new Uint8Array(this.Nh)
    }
    return new Uint8Array(
      await crypto.subtle.sign(
        'HMAC',
        await crypto.subtle.importKey('raw', salt, { name: 'HMAC', hash: this.hash }, false, [
          'sign',
        ]),
        ikm,
      ),
    )
  },
  async Expand(this: HKDF, prk: Uint8Array<ArrayBuffer>, info, L) {
    if (prk.byteLength < this.Nh) {
      throw new Error('prk.byteLength at least Nh')
    }
    if (L > 255 * this.Nh) {
      throw new Error('L must be <= 255*Nh')
    }
    const N = Math.ceil(L / this.Nh)
    const key = await crypto.subtle.importKey(
      'raw',
      prk,
      { name: 'HMAC', hash: this.hash },
      false,
      ['sign'],
    )

    const T = new Uint8Array(N * this.Nh)
    let T_prev = new Uint8Array()

    for (let i = 0; i < N; i++) {
      const input = new Uint8Array(T_prev.byteLength + info.byteLength + 1)
      input.set(T_prev)
      input.set(info, T_prev.byteLength)
      input[T_prev.byteLength + info.byteLength] = i + 1

      const T_i = new Uint8Array(await crypto.subtle.sign('HMAC', key, input))

      T.set(T_i, i * this.Nh)
      T_prev = T_i
    }

    return T.slice(0, L)
  },
  CombineSecrets: CombineSecretsTwoStage,
}

const KDF_HKDF_SHA256: HKDF = {
  id: 0x0001,
  // type: 'KDF',
  // name: 'HKDF-SHA256',
  Nh: 32,
  hash: 'SHA-256',
  ...HKDF_SHARED,
}

const KDF_HKDF_SHA384: HKDF = {
  id: 0x0002,
  // type: 'KDF',
  // name: 'HKDF-SHA384',
  Nh: 48,
  hash: 'SHA-384',
  ...HKDF_SHARED,
}

const KDF_HKDF_SHA512: HKDF = {
  id: 0x0003,
  // type: 'KDF',
  // name: 'HKDF-SHA512',
  Nh: 64,
  hash: 'SHA-512',
  ...HKDF_SHARED,
}

// interface SHAKE extends KDF {
//   algorithm: string
// }

// const SHAKE_SHARED: KDF_BASE = {
//   async Derive(this: SHAKE, labeled_ikm: Uint8Array, L: number) {
//     return new Uint8Array(
//       await crypto.subtle.digest(
//         {
//           name: this.algorithm,
//           // @ts-expect-error
//           length: L << 3,
//         },
//         labeled_ikm,
//       ),
//     )
//   },
//   Extract() {
//     throw new Error('n/a')
//   },
//   Expand() {
//     throw new Error('n/a')
//   },
//   CombineSecrets: CombineSecretsOneStage,
// }

// const KDF_SHAKE128: SHAKE = {
//   id: 0x0010,
//   // type: 'KDF',
//   // name: 'SHAKE128',
//   Nh: 32,
//   algorithm: 'cSHAKE128',
//   ...SHAKE_SHARED,
// }

// const KDF_SHAKE256: SHAKE = {
//   id: 0x0011,
//   // type: 'KDF',
//   // name: 'SHAKE256',
//   Nh: 64,
//   algorithm: 'cSHAKE256',
//   ...SHAKE_SHARED,
// }

async function LabeledExtract(
  this: KDF,
  suite_id: Uint8Array,
  salt: Uint8Array,
  label: Uint8Array,
  ikm: Uint8Array,
): Promise<Uint8Array> {
  const labeled_ikm = concat(encode('HPKE-v1'), suite_id, label, ikm)
  return this.Extract(salt, labeled_ikm)
}

async function LabeledExpand(
  this: KDF,
  suite_id: Uint8Array,
  prk: Uint8Array,
  label: Uint8Array,
  info: Uint8Array,
  L: number,
): Promise<Uint8Array> {
  const labeled_info = concat(I2OSP(L, 2), encode('HPKE-v1'), suite_id, label, info)
  return this.Expand(prk, labeled_info, L)
}

interface KEM {
  id: number
  // type: 'KEM'
  // name: string
  Nsecret: number
  Nenc: number
  Npk: number
  Nsk: number
  GenerateKeyPair(this: KEM, extractable?: boolean): Promise<CryptoKeyPair>
  SerializePublicKey(this: KEM, key: types.CryptoKey): Promise<Uint8Array>
  DeserializePublicKey(this: KEM, key: Uint8Array): Promise<types.CryptoKey>
  Encap(this: KEM, pkR: types.CryptoKey): Promise<{ shared_secret: Uint8Array; enc: Uint8Array }>
  Decap(this: KEM, enc: Uint8Array, skR: types.CryptoKey): Promise<Uint8Array>
}

type KEM_BASE = Pick<
  KEM,
  'GenerateKeyPair' | 'SerializePublicKey' | 'DeserializePublicKey' | 'Encap' | 'Decap'
>

interface DHKEM extends KEM {
  Ndh: number
  kdf: HKDF
  algorithm: KeyAlgorithm | EcKeyAlgorithm
}

const DHKEM_SHARED: KEM_BASE = {
  async GenerateKeyPair(this: DHKEM, extractable = false) {
    return (await crypto.subtle.generateKey(this.algorithm, extractable, [
      'deriveBits',
    ])) as CryptoKeyPair
  },
  async SerializePublicKey(key) {
    if (key.type === 'private') {
      if (key.extractable) {
        const { kty, x, y } = await crypto.subtle.exportKey('jwk', key)
        if (kty === 'EC') {
          return concat(Uint8Array.of(0x04), b64u(x!), b64u(y!))
        }

        return b64u(x!)
      }

      // @ts-expect-error
      key = (await crypto.subtle.getPublicKey(key, [])) as types.CryptoKey
    }

    return new Uint8Array(await crypto.subtle.exportKey('raw', key))
  },
  async DeserializePublicKey(this: DHKEM, key: Uint8Array<ArrayBuffer>) {
    if (key.byteLength !== this.Npk) {
      throw new Error('key.byteLength and Npk mismatch')
    }

    return await crypto.subtle.importKey('raw', key, this.algorithm, true, [])
  },
  async Encap(this: DHKEM, pkR) {
    const ekp = await this.GenerateKeyPair()
    const skE = ekp.privateKey
    const pkE = ekp.publicKey

    // DH all-zero/point at infinity checks are performed
    // by WebCrypto's underlying implementations
    const dh = new Uint8Array(
      await crypto.subtle.deriveBits(
        {
          name: skE.algorithm.name,
          public: pkR,
        },
        skE,
        this.Ndh << 3,
      ),
    )

    const enc = await this.SerializePublicKey(pkE)
    const pkRm = await this.SerializePublicKey(pkR)
    const kem_context = concat(enc, pkRm)
    const suite_id = concat(encode('KEM'), I2OSP(this.id, 2))
    const eae_prk = await LabeledExtract.call(
      this.kdf,
      suite_id,
      new Uint8Array(),
      encode('eae_prk'),
      dh,
    )
    const shared_secret = await LabeledExpand.call(
      this.kdf,
      suite_id,
      eae_prk,
      encode('shared_secret'),
      kem_context,
      this.Nsecret,
    )
    return {
      shared_secret,
      enc,
    }
  },
  async Decap(this: DHKEM, enc, skR) {
    if (enc.byteLength !== this.Nenc) {
      throw new JWEInvalid('Invalid encapsulated key length')
    }

    const pkE = await this.DeserializePublicKey(enc)

    // DH all-zero/point at infinity checks are performed
    // by WebCrypto's underlying implementations
    const dh = new Uint8Array(
      await crypto.subtle.deriveBits(
        {
          name: skR.algorithm.name,
          public: pkE,
        },
        skR,
        this.Ndh << 3,
      ),
    )

    const pkRm = await this.SerializePublicKey(skR)
    const kem_context = concat(enc, pkRm)
    const suite_id = concat(encode('KEM'), I2OSP(this.id, 2))
    const eae_prk = await LabeledExtract.call(
      this.kdf,
      suite_id,
      new Uint8Array(),
      encode('eae_prk'),
      dh,
    )
    const shared_secret = await LabeledExpand.call(
      this.kdf,
      suite_id,
      eae_prk,
      encode('shared_secret'),
      kem_context,
      this.Nsecret,
    )
    return shared_secret
  },
}

const KEM_DHKEM_P256_HKDF_SHA256: DHKEM = {
  id: 0x0010,
  // type: 'KEM',
  // name: 'DHKEM(P-256, HKDF-SHA256)',
  kdf: KDF_HKDF_SHA256,
  Nsecret: 32,
  Nenc: 65,
  Npk: 65,
  Nsk: 32,
  Ndh: 32,
  algorithm: { name: 'ECDH', namedCurve: 'P-256' },
  ...DHKEM_SHARED,
}

const KEM_DHKEM_P384_HKDF_SHA384: DHKEM = {
  id: 0x0011,
  // type: 'KEM',
  // name: 'DHKEM(P-384, HKDF-SHA384)',
  kdf: KDF_HKDF_SHA384,
  Nsecret: 48,
  Nenc: 97,
  Npk: 97,
  Nsk: 48,
  Ndh: 48,
  algorithm: { name: 'ECDH', namedCurve: 'P-384' },
  ...DHKEM_SHARED,
}

const KEM_DHKEM_P521_HKDF_SHA512: DHKEM = {
  id: 0x0012,
  // type: 'KEM',
  // name: 'DHKEM(P-521, HKDF-SHA512)',
  kdf: KDF_HKDF_SHA512,
  Nsecret: 64,
  Nenc: 133,
  Npk: 133,
  Nsk: 66,
  Ndh: 66,
  algorithm: { name: 'ECDH', namedCurve: 'P-521' },
  ...DHKEM_SHARED,
}

const KEM_DHKEM_X25519_HKDF_SHA256: DHKEM = {
  id: 0x0020,
  // type: 'KEM',
  // name: 'DHKEM(X25519, HKDF-SHA256)',
  kdf: KDF_HKDF_SHA256,
  Nsecret: 32,
  Nenc: 32,
  Npk: 32,
  Nsk: 32,
  Ndh: 32,
  algorithm: { name: 'X25519' },
  ...DHKEM_SHARED,
}

// const KEM_DHKEM_X448_HKDF_SHA512: DHKEM = {
//   id: 0x0021,
//   // type: 'KEM',
//   // name: 'DHKEM(X448, HKDF-SHA512)',
//   kdf: KDF_HKDF_SHA512,
//   Nsecret: 64,
//   Nenc: 56,
//   Npk: 56,
//   Nsk: 56,
//   Ndh: 56,
//   algorithm: { name: 'X448' },
//   ...DHKEM_SHARED,
// }

// interface MLKEM extends KEM {
//   algorithm: string
// }

// const MLKEM_SHARED: KEM_BASE = {
//   async GenerateKeyPair(this: MLKEM, extractable = false) {
//     return (await crypto.subtle.generateKey(this.algorithm, extractable, [
//       // @ts-expect-error
//       'encapsulateBits',
//       // @ts-expect-error
//       'decapsulateBits',
//     ])) as CryptoKeyPair
//   },
//   async SerializePublicKey(key: types.CryptoKey) {
//     if (key.type === 'private') {
//       // @ts-expect-error
//       key = (await crypto.subtle.getPublicKey(key, [])) as types.CryptoKey
//     }

//     // @ts-expect-error
//     return new Uint8Array(await crypto.subtle.exportKey('raw-public', key))
//   },
//   DeserializePublicKey() {
//     throw new Error('n/a')
//   },
//   async Encap(this: MLKEM, pkR) {
//     // @ts-expect-error
//     const { sharedKey, ciphertext } = await crypto.subtle.encapsulateBits(this.algorithm, pkR)

//     return { shared_secret: new Uint8Array(sharedKey), enc: new Uint8Array(ciphertext) }
//   },
//   async Decap(this: MLKEM, enc, skR) {
//     // @ts-expect-error
//     return new Uint8Array(await crypto.subtle.decapsulateBits(this.algorithm, skR, enc))
//   },
// }

// const KEM_ML_KEM_512: MLKEM = {
//   id: 0x0040,
//   // type: 'KEM',
//   // name: 'ML-KEM-512',
//   Nsecret: 32,
//   Nenc: 768,
//   Npk: 800,
//   Nsk: 64,
//   algorithm: 'ML-KEM-512',
//   ...MLKEM_SHARED,
// }

// const KEM_ML_KEM_768: MLKEM = {
//   id: 0x0041,
//   // type: 'KEM',
//   // name: 'ML-KEM-768',
//   Nsecret: 32,
//   Nenc: 1088,
//   Npk: 1184,
//   Nsk: 64,
//   algorithm: 'ML-KEM-768',
//   ...MLKEM_SHARED,
// }

// const KEM_ML_KEM_1024: MLKEM = {
//   id: 0x0042,
//   // type: 'KEM',
//   // name: 'ML-KEM-1024',
//   Nsecret: 32,
//   Nenc: 1568,
//   Npk: 1568,
//   Nsk: 64,
//   algorithm: 'ML-KEM-1024',
//   ...MLKEM_SHARED,
// }

interface AEAD {
  id: number
  // type: 'AEAD'
  // name: string
  Nk: number
  Nn: number
  Nt: number
  Seal(
    this: AEAD,
    key: Uint8Array,
    nonce: Uint8Array,
    aad: Uint8Array,
    pt: Uint8Array,
  ): Promise<Uint8Array>
  Open(
    this: AEAD,
    key: Uint8Array,
    nonce: Uint8Array,
    aad: Uint8Array,
    ct: Uint8Array,
  ): Promise<Uint8Array>
}

interface WebCryptoAEAD extends AEAD {
  algorithm: string
  keyFormat: string
}

type AEAD_BASE = Pick<AEAD, 'Seal' | 'Open'>

const AEAD_SHARED: AEAD_BASE = {
  async Seal(
    this: WebCryptoAEAD,
    key: Uint8Array<ArrayBuffer>,
    nonce: Uint8Array<ArrayBuffer>,
    aad: Uint8Array<ArrayBuffer>,
    pt: Uint8Array<ArrayBuffer>,
  ) {
    return new Uint8Array(
      await crypto.subtle.encrypt(
        {
          name: this.algorithm,
          iv: nonce,
          additionalData: aad,
        },
        await crypto.subtle.importKey(this.keyFormat as 'raw', key, this.algorithm, false, [
          'encrypt',
        ]),
        pt,
      ),
    )
  },
  async Open(
    this: WebCryptoAEAD,
    key: Uint8Array<ArrayBuffer>,
    nonce: Uint8Array<ArrayBuffer>,
    aad: Uint8Array<ArrayBuffer>,
    ct: Uint8Array<ArrayBuffer>,
  ) {
    return new Uint8Array(
      await crypto.subtle.decrypt(
        {
          name: this.algorithm,
          iv: nonce,
          additionalData: aad,
        },
        await crypto.subtle.importKey(this.keyFormat as 'raw', key, this.algorithm, false, [
          'decrypt',
        ]),
        ct,
      ),
    )
  },
}

const AEAD_AES_128_GCM: WebCryptoAEAD = {
  id: 0x0001,
  // type: 'AEAD',
  // name: 'AES-128-GCM',
  Nk: 16,
  Nn: 12,
  Nt: 16,
  algorithm: 'AES-GCM',
  keyFormat: 'raw',
  ...AEAD_SHARED,
}

const AEAD_AES_256_GCM: WebCryptoAEAD = {
  id: 0x0002,
  // type: 'AEAD',
  // name: 'AES-256-GCM',
  Nk: 32,
  Nn: 12,
  Nt: 16,
  algorithm: 'AES-GCM',
  keyFormat: 'raw',
  ...AEAD_SHARED,
}

const AEAD_ChaCha20Poly1305: WebCryptoAEAD = {
  id: 0x0003,
  // type: 'AEAD',
  // name: 'ChaCha20Poly1305',
  Nk: 32,
  Nn: 12,
  Nt: 16,
  algorithm: 'ChaCha20-Poly1305',
  keyFormat: 'raw-secret',
  ...AEAD_SHARED,
}

function I2OSP(n: number, w: number): Uint8Array {
  if (w <= 0) {
    throw new Error('w(length) <= 0')
  }
  if (n >= Math.pow(256, w)) {
    throw new Error('n too large')
  }
  const ret = new Uint8Array(w)
  for (let i = 0; i < w && n; i++) {
    ret[w - (i + 1)] = n % 256
    n = n >> 8
  }
  return ret
}

async function KeySchedule(
  suite: Suite,
  mode: number,
  shared_secret: Uint8Array,
  info: Uint8Array,
  psk?: Uint8Array,
  psk_id?: Uint8Array,
): Promise<CombinedSecrets> {
  // Implementations SHOULD set such a limit to be no less than maximum
  // Nsk size for a KEM supported by the implementation.  For an
  // implementation that supports all of the KEMs in this document, the
  // limit would be 66 bytes, which is the Nsk value for DHKEM(P-521,
  // HKDF-SHA512).

  // Practical limit considering the added Recipient_structure but still
  // well below spec maximum
  const INPUT_LIMIT = 128
  if (
    info.byteLength > INPUT_LIMIT ||
    (psk && psk.byteLength > INPUT_LIMIT) ||
    (psk_id && psk_id.byteLength > INPUT_LIMIT)
  ) {
    throw new JWEInvalid('HPKE input parameters exceed maximum length')
  }

  const suite_id = concat(
    encode('HPKE'),
    I2OSP(suite.KEM.id, 2),
    I2OSP(suite.KDF.id, 2),
    I2OSP(suite.AEAD.id, 2),
  )
  psk ??= new Uint8Array()
  psk_id ??= new Uint8Array()
  return suite.KDF.CombineSecrets(
    suite_id,
    mode,
    shared_secret,
    info,
    psk,
    psk_id,
    suite.AEAD.Nk,
    suite.AEAD.Nn,
  )
}

function VerifyPSKInputs(psk?: Uint8Array, psk_id?: Uint8Array) {
  if (psk?.byteLength && psk_id?.byteLength) return true
  if (!psk?.byteLength && !psk_id?.byteLength) return false
  throw new JWEInvalid('Inconsistent HPKE PSK inputs')
}

interface SealResult {
  enc: Uint8Array
  ct: Uint8Array
}

export async function Seal(
  alg: string,
  pkR: types.CryptoKey,
  info: Uint8Array,
  aad: Uint8Array,
  pt: Uint8Array,
  psk?: Uint8Array,
  psk_id?: Uint8Array,
): Promise<SealResult> {
  checkEncCryptoKey(pkR, alg)
  const suite = getSuite(alg)
  const got_psk = VerifyPSKInputs(psk, psk_id)

  const { shared_secret, enc } = await suite.KEM.Encap(pkR)
  const { key, base_nonce } = await KeySchedule(
    suite,
    got_psk ? MODES.psk : MODES.base,
    shared_secret,
    info,
    psk,
    psk_id,
  )

  // not needed in one-shot where nonce(seq=0) === base_nonce
  // const seq = I2OSP(0, suite.AEAD.Nn)
  // const nonce = xor(base_nonce, seq)

  const ct = await suite.AEAD.Seal(key, base_nonce, aad, pt)

  return { enc, ct }
}

export async function Open(
  alg: string,
  enc: Uint8Array,
  skR: types.CryptoKey,
  info: Uint8Array,
  aad: Uint8Array,
  ct: Uint8Array,
  psk?: Uint8Array,
  psk_id?: Uint8Array,
): Promise<Uint8Array> {
  checkEncCryptoKey(skR, alg, 'deriveBits')
  const suite = getSuite(alg)
  const got_psk = VerifyPSKInputs(psk, psk_id)

  const shared_secret = await suite.KEM.Decap(enc, skR)
  const { key, base_nonce } = await KeySchedule(
    suite,
    got_psk ? MODES.psk : MODES.base,
    shared_secret,
    info,
    psk,
    psk_id,
  )

  // not needed in one-shot where nonce(seq=0) === base_nonce
  // const seq = I2OSP(0, suite.AEAD.Nn)
  // const nonce = xor(base_nonce, seq)

  const pt = await suite.AEAD.Open(key, base_nonce, aad, ct)

  return pt
}

export function getSuite(alg: string): Suite {
  switch (alg) {
    case 'HPKE-0':
    case 'HPKE-0-KE':
      return {
        KEM: KEM_DHKEM_P256_HKDF_SHA256,
        KDF: KDF_HKDF_SHA256,
        AEAD: AEAD_AES_128_GCM,
      }
    case 'HPKE-1':
    case 'HPKE-1-KE':
      return {
        KEM: KEM_DHKEM_P384_HKDF_SHA384,
        KDF: KDF_HKDF_SHA384,
        AEAD: AEAD_AES_256_GCM,
      }
    case 'HPKE-2':
    case 'HPKE-2-KE':
      return {
        KEM: KEM_DHKEM_P521_HKDF_SHA512,
        KDF: KDF_HKDF_SHA512,
        AEAD: AEAD_AES_256_GCM,
      }
    case 'HPKE-3':
    case 'HPKE-3-KE':
      return {
        KEM: KEM_DHKEM_X25519_HKDF_SHA256,
        KDF: KDF_HKDF_SHA256,
        AEAD: AEAD_AES_128_GCM,
      }
    case 'HPKE-4':
    case 'HPKE-4-KE':
      return {
        KEM: KEM_DHKEM_X25519_HKDF_SHA256,
        KDF: KDF_HKDF_SHA256,
        AEAD: AEAD_ChaCha20Poly1305,
      }
    case 'HPKE-7':
    case 'HPKE-7-KE':
      return {
        KEM: KEM_DHKEM_P256_HKDF_SHA256,
        KDF: KDF_HKDF_SHA256,
        AEAD: AEAD_AES_256_GCM,
      }
    default:
      throw new Error('unreachable')
  }
}

export function isIntegratedEncryption(alg: string) {
  switch (alg) {
    case 'HPKE-0':
    case 'HPKE-1':
    case 'HPKE-2':
    case 'HPKE-3':
    case 'HPKE-4':
    case 'HPKE-7':
      return true
    default:
      return false
  }
}

export function info(enc?: string, recipientExtraInfo?: Uint8Array) {
  recipientExtraInfo ??= new Uint8Array()
  if (enc) {
    // Recipient_structure
    const separator = Uint8Array.of(0xff)
    return concat(encode('JOSE-HPKE rcpt'), separator, encode(enc), separator, recipientExtraInfo)
  }

  return recipientExtraInfo
}
