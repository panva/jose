import type * as types from '../types.d.ts'
import { encoder, concat, uint32be } from './buffer_utils.js'
import { checkEncCryptoKey } from './crypto_key.js'
import digest from './digest.js'

function lengthAndInput(input: Uint8Array) {
  return concat(uint32be(input.length), input)
}

/**
 * Concat KDF implementation
 *
 * @param Z - Shared secret from key-agreement scheme
 * @param L - Length of derived keying material in bits
 * @param OtherInfo - Context and application specific data
 */
async function concatKdf(Z: Uint8Array, L: number, OtherInfo: Uint8Array) {
  // dkLen = L (in bits), converted to bytes for output length
  const dkLen = L >> 3
  // Hash output length in bytes (SHA-256 produces 32 bytes)
  const hashLen = 32
  // Number of hash function calls needed
  const reps = Math.ceil(dkLen / hashLen)
  // Initialize output buffer for concatenated hash results
  const dk = new Uint8Array(reps * hashLen)

  // Perform reps iterations of the hash function
  for (let i = 1; i <= reps; i++) {
    // Construct Hash_i input: Counter || Z || OtherInfo
    const hashInput = new Uint8Array(4 + Z.length + OtherInfo.length)
    hashInput.set(uint32be(i), 0) // 32-bit big-endian counter
    hashInput.set(Z, 4) // Shared secret Z
    hashInput.set(OtherInfo, 4 + Z.length) // OtherInfo

    // Hash_i = Hash(Counter || Z || OtherInfo)
    const hashResult = await digest('sha256', hashInput)
    dk.set(hashResult, (i - 1) * hashLen)
  }

  // Return leading L bits of dk (truncate to exact length needed)
  return dk.slice(0, dkLen)
}

/**
 * ECDH-ES Key Agreement with Concat KDF
 *
 * @param publicKey
 * @param privateKey
 * @param algorithm - AlgorithmID: For Direct Key Agreement (ECDH-ES), this is the "enc" value. For
 *   Key Agreement with Key Wrapping, this is the "alg" value
 * @param keyLength - Keydatalen: Number of bits in the desired output key
 * @param apu - PartyUInfo: Agreement PartyUInfo value (information about the producer)
 * @param apv - PartyVInfo: Agreement PartyVInfo value (information about the recipient)
 */
export async function deriveKey(
  publicKey: types.CryptoKey,
  privateKey: types.CryptoKey,
  algorithm: string,
  keyLength: number,
  apu: Uint8Array = new Uint8Array(0),
  apv: Uint8Array = new Uint8Array(0),
) {
  checkEncCryptoKey(publicKey, 'ECDH')
  checkEncCryptoKey(privateKey, 'ECDH', 'deriveBits')

  // Construct OtherInfo
  const algorithmID = lengthAndInput(encoder.encode(algorithm))
  const partyUInfo = lengthAndInput(apu)
  const partyVInfo = lengthAndInput(apv)
  const suppPubInfo = uint32be(keyLength)
  const suppPrivInfo = new Uint8Array(0)

  const otherInfo = concat(algorithmID, partyUInfo, partyVInfo, suppPubInfo, suppPrivInfo)

  // Perform ECDH to get the shared secret Z
  const Z = new Uint8Array(
    await crypto.subtle.deriveBits(
      {
        name: publicKey.algorithm.name,
        public: publicKey,
      },
      privateKey,
      getEcdhBitLength(publicKey),
    ),
  )

  // Apply Concat KDF to derive the final key material
  return concatKdf(Z, keyLength, otherInfo)
}

function getEcdhBitLength(publicKey: CryptoKey) {
  if (publicKey.algorithm.name === 'X25519') {
    return 256
  }

  return (
    Math.ceil(parseInt((publicKey.algorithm as EcKeyAlgorithm).namedCurve.slice(-3), 10) / 8) << 3
  )
}

export function allowed(key: types.CryptoKey) {
  switch ((key.algorithm as EcKeyAlgorithm).namedCurve) {
    case 'P-256':
    case 'P-384':
    case 'P-521':
      return true
    default:
      return key.algorithm.name === 'X25519'
  }
}
