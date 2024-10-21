import type QUnit from 'qunit'
import type * as jose from '../src/index.js'

export default async (
  QUnit: QUnit,
  lib: typeof jose,
  keys: Pick<typeof jose, 'exportJWK' | 'generateKeyPair' | 'generateSecret' | 'importJWK'>,
) => {
  const { module, test } = QUnit
  module('generate_options.ts')

  const isWebCrypto =
    typeof CryptoKey !== 'undefined' && (await keys.generateSecret('HS256')) instanceof CryptoKey

  if (isWebCrypto) {
    for (const extractable of [undefined, true, false]) {
      test(`secret CryptoKey extractable: ${extractable ?? 'default (false)'}`, async (t) => {
        const expected = extractable ?? false
        const secret = (await keys.generateSecret('HS256', { extractable })) as CryptoKey
        t.equal(secret.extractable, expected)
      })
    }

    for (const extractable of [undefined, true, false]) {
      test(`CryptoKeyPair extractable: ${extractable ?? 'default (false)'}`, async (t) => {
        const expected = extractable ?? false
        const kp = (await keys.generateKeyPair('ES256', { extractable })) as CryptoKeyPair
        t.equal(kp.privateKey.extractable, expected)
        t.equal(kp.publicKey.extractable, true)
      })
    }
  }

  for (const modulusLength of [undefined, 2048, 3072]) {
    test(`RSA modulusLength ${modulusLength ?? 'default (2048)'}`, async (t) => {
      const expected = modulusLength ?? 2048
      const { publicKey } = (await keys.generateKeyPair('RS256', {
        modulusLength,
      })) as CryptoKeyPair

      if (isWebCrypto) {
        t.equal((publicKey.algorithm as RsaHashedKeyAlgorithm).modulusLength, expected)
        // @ts-ignore
      } else if (publicKey.asymmetricKeyDetails) {
        // @ts-ignore
        t.equal(publicKey.asymmetricKeyDetails.modulusLength, expected)
      } else {
        // @ts-ignore
        t.true(parseInt(process.versions.node, 10) < 16)
      }
    })
  }
}
