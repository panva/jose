import { JOSENotSupported } from '../util/errors.js'
import type { GenerateKeyPairOptions, GenerateKeyPairResult } from '../key/generate_key_pair.js'
import type { KeyDescriptor } from './key_descriptor.js'
import { validateExtractableOption } from './type_checks.js'

const algArgument = '"alg" (Algorithm)'

function unsupportedAlg(): never {
  throw new JOSENotSupported(`Invalid or unsupported ${algArgument} value`)
}

function getModulusLengthOption(options?: GenerateKeyPairOptions) {
  const modulusLength = options?.modulusLength ?? 2048
  if (
    typeof modulusLength !== 'number' ||
    !Number.isInteger(modulusLength) ||
    modulusLength < 2048
  ) {
    throw new JOSENotSupported(
      'Invalid or unsupported modulusLength option provided, 2048 bits or larger keys must be used',
    )
  }
  return modulusLength
}

export async function generateKeyPairWithResolver(
  alg: string,
  resolve: (alg: unknown, source?: string) => KeyDescriptor,
  options?: GenerateKeyPairOptions,
): Promise<GenerateKeyPairResult> {
  const extractable = validateExtractableOption(options?.extractable)
  const entry = resolve(alg, algArgument)

  if (entry.secret) {
    unsupportedAlg()
  }

  let algorithm: RsaHashedKeyGenParams | EcKeyGenParams | KeyAlgorithm

  if (entry.resolve) {
    // ECDH-ES takes its curve from the option rather than from the identifier.
    const crv = options?.crv ?? 'P-256'
    switch (crv) {
      case 'P-256':
      case 'P-384':
      case 'P-521':
        algorithm = { name: 'ECDH', namedCurve: crv }
        break
      case 'X25519':
        algorithm = { name: 'X25519' }
        break
      default:
        throw new JOSENotSupported(
          'Invalid or unsupported crv option provided, supported values are P-256, P-384, P-521, and X25519',
        )
    }
  } else {
    if (entry.crv !== undefined && options?.crv !== undefined && options.crv !== entry.crv) {
      throw new JOSENotSupported(
        `Invalid or unsupported crv option provided, the only supported value for ${alg} is ${entry.crv}`,
      )
    }

    algorithm =
      entry.kty[0] === 'RSA'
        ? {
            ...(entry.subtle as RsaHashedKeyGenParams),
            publicExponent: Uint8Array.of(0x01, 0x00, 0x01),
            modulusLength: getModulusLengthOption(options),
          }
        : entry.subtle
  }

  return crypto.subtle.generateKey(algorithm, extractable ?? false, [
    ...entry.usages[1],
    ...entry.usages[0],
  ]) as Promise<GenerateKeyPairResult>
}
