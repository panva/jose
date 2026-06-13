import type QUnit from 'qunit'
import * as env from './env.js'
import type * as jose from '../src/index.js'

// @ts-ignore
import jwsVectors from '../cookbook/jws.mjs'
// @ts-ignore
import jweVectors from '../cookbook/jwe.mjs'

export default (
  QUnit: QUnit,
  lib: typeof jose,
  keys: Pick<typeof jose, 'exportJWK' | 'generateKeyPair' | 'generateSecret' | 'importJWK'>,
) => {
  const { module, test } = QUnit

  const encode = TextEncoder.prototype.encode.bind(new TextEncoder())

  const pubjwk = (jwk: jose.JWK) => {
    const { d, p, q, dp, dq, qi, priv, ...publicJwk } = jwk
    return publicJwk
  }

  {
    module('jws cookbook')

    const flattened = {
      Sign: lib.FlattenedSign,
      verify: lib.flattenedVerify,
    }
    const compact = {
      Sign: lib.CompactSign,
      verify: lib.compactVerify,
    }

    function supported(vector: any) {
      return env.supported(vector.input.alg)
    }

    const execute = (vector: any) => async (t: typeof QUnit.assert) => {
      const privateKey = await keys.importJWK(vector.input.key, vector.input.alg)
      const publicKey = await keys.importJWK(pubjwk(vector.input.key), vector.input.alg)

      if (vector.deterministic) {
        // sign and compare results are the same
        const runs = [[flattened, vector.output.json_flat]]
        if (vector.signing.protected?.b64 !== undefined) {
          runs.push([compact, vector.output.compact])
        }
        for (const [serialization, expectedResult] of runs) {
          if (!expectedResult) {
            continue
          }
          const sign = new serialization.Sign(encode(vector.input.payload))

          if (vector.signing.protected) {
            sign.setProtectedHeader(vector.signing.protected)
          }

          if (vector.signing.unprotected) {
            sign.setUnprotectedHeader(vector.signing.unprotected)
          }

          const result = await sign.sign(privateKey)

          if (vector.signing.protected?.b64 === false) {
            await serialization.verify(
              { ...result, payload: encode(vector.input.payload) },
              publicKey,
            )
          } else {
            await serialization.verify(result, publicKey)
          }

          if (typeof result === 'object') {
            Object.entries(expectedResult).forEach(([prop, expected]) => {
              if (prop === 'payload' && vector.signing.protected?.b64 === false) {
                return
              }
              t.equal(JSON.stringify(result[prop]), JSON.stringify(expected))
            })
          } else {
            t.equal(result, expectedResult)
          }
        }
      } else {
        const sign = new flattened.Sign(encode(vector.input.payload))

        if (vector.signing.protected) {
          sign.setProtectedHeader(vector.signing.protected)
        }

        if (vector.signing.unprotected) {
          sign.setUnprotectedHeader(vector.signing.unprotected)
        }

        const result = await sign.sign(privateKey)
        await flattened.verify(result, publicKey)
      }

      if (vector.output.json_flat) {
        await flattened.verify(vector.output.json_flat, publicKey)
      }
      if (vector.output.compact) {
        await compact.verify(vector.output.compact, publicKey)
      }

      t.ok(1)
    }

    for (const vector of jwsVectors) {
      if (supported(vector)) {
        test(vector.title, execute(vector))
      } else {
        test(`[not supported] ${vector.title}`, async (t) => {
          await t.rejects(execute(vector)(t))
        })
      }
    }
  }

  {
    module('jwe cookbook')

    const flattened = {
      Encrypt: lib.FlattenedEncrypt,
      decrypt: lib.flattenedDecrypt,
    }
    const compact = {
      Encrypt: lib.CompactEncrypt,
      decrypt: lib.compactDecrypt,
    }

    function supported(vector: any) {
      if (vector.input.zip && typeof globalThis.CompressionStream === 'undefined') {
        return false
      }
      if (vector.input.enc === undefined) {
        return env.supported(vector.input.alg)
      }
      return env.supported(vector.input.alg) && env.supported(vector.input.enc)
    }

    function isRuntimeUnsupported(error: unknown) {
      return (
        (typeof DOMException !== 'undefined' &&
          error instanceof DOMException &&
          error.name === 'NotSupportedError') ||
        (error as { code?: string })?.code === 'ERR_JOSE_NOT_SUPPORTED' ||
        (error as { code?: string })?.code === 'ERR_CRYPTO_INVALID_JWK' ||
        ((error as { code?: string; message?: string })?.code === 'ERR_INVALID_ARG_VALUE' &&
          (error as { message?: string })?.message?.includes("property 'key.alg'"))
      )
    }

    function getPublicKeyAvailable() {
      return typeof (crypto.subtle as { getPublicKey?: unknown }).getPublicKey === 'function'
    }

    function keyImportOptions(alg: string) {
      switch (alg) {
        case 'HPKE-0':
        case 'HPKE-1':
        case 'HPKE-3':
        case 'HPKE-4':
        case 'HPKE-7':
          return getPublicKeyAvailable() ? undefined : { extractable: true }
        default:
          return undefined
      }
    }

    const toJWK = (input: string | jose.JWK) => {
      if (typeof input === 'string') {
        return {
          kty: 'oct',
          k: lib.base64url.encode(encode(input)),
        }
      }
      return input
    }

    const execute = (vector: any) => async (t: typeof QUnit.assert) => {
      const dir = vector.input.alg === 'dir'
      const integrated = vector.input.enc === undefined
      const keyManagementAlgorithms = [vector.input.alg]
      const contentEncryptionAlgorithms = integrated ? undefined : [vector.input.enc]
      const decryptOptions = contentEncryptionAlgorithms
        ? { keyManagementAlgorithms, contentEncryptionAlgorithms }
        : { keyManagementAlgorithms }

      if (vector.deterministic) {
        // encrypt and compare results are the same
        for (const [serialization, expectedResult] of [
          [flattened, vector.output.json_flat],
          [compact, vector.output.compact],
        ]) {
          if (!expectedResult) {
            continue
          }
          const encrypt = new serialization.Encrypt(encode(vector.input.plaintext))

          if (vector.encrypting_content.protected) {
            encrypt.setProtectedHeader(vector.encrypting_content.protected)
          }

          if (vector.encrypting_content.unprotected) {
            encrypt.setSharedUnprotectedHeader(vector.encrypting_content.unprotected)
          }

          const { cek, iv } = vector.generated

          if (cek) {
            encrypt.setContentEncryptionKey(lib.base64url.decode(cek))
          }

          if (iv) {
            encrypt.setInitializationVector(lib.base64url.decode(iv))
          }

          if (vector.input.aad) {
            encrypt.setAdditionalAuthenticatedData(encode(vector.input.aad))
          }

          const keyManagementParameters: jose.JWEKeyManagementHeaderParameters = {}

          if (vector.encrypting_key && vector.encrypting_key.iv) {
            keyManagementParameters.iv = lib.base64url.decode(vector.encrypting_key.iv)
          }

          if (vector.encrypting_key && vector.encrypting_key.iteration_count) {
            keyManagementParameters.p2c = vector.encrypting_key.iteration_count
          }

          if (vector.encrypting_key && vector.encrypting_key.salt) {
            keyManagementParameters.p2s = lib.base64url.decode(vector.encrypting_key.salt)
          }

          if (vector.encrypting_key && vector.encrypting_key.epk) {
            keyManagementParameters.epk = (await keys.importJWK(
              vector.encrypting_key.epk,
              vector.input.alg,
            )) as jose.KeyLike
          }

          if (Object.keys(keyManagementParameters).length !== 0) {
            encrypt.setKeyManagementParameters(keyManagementParameters)
          }

          const publicKey = await keys.importJWK(
            pubjwk(toJWK(vector.input.pwd || vector.input.key)),
            dir ? vector.input.enc : vector.input.alg,
          )

          const result = await encrypt.encrypt(publicKey)

          if (typeof result === 'object') {
            Object.entries(expectedResult).forEach(([prop, expected]) => {
              t.equal(JSON.stringify(result[prop]), JSON.stringify(expected))
            })
          } else {
            t.equal(result, expectedResult)
          }
        }
      } else {
        const encrypt = new flattened.Encrypt(encode(vector.input.plaintext))

        if (vector.encrypting_content.protected) {
          encrypt.setProtectedHeader(vector.encrypting_content.protected)
        }

        if (vector.encrypting_content.unprotected) {
          encrypt.setUnprotectedHeader(vector.encrypting_content.unprotected)
        }

        if (vector.input.aad) {
          encrypt.setAdditionalAuthenticatedData(encode(vector.input.aad))
        }

        const privateKey = (await keys.importJWK(
          toJWK(vector.input.pwd || vector.input.key),
          dir ? vector.input.enc : vector.input.alg,
          integrated ? keyImportOptions(vector.input.alg) : undefined,
        )) as jose.KeyLike
        let publicKey
        if (privateKey.type === 'secret') {
          publicKey = privateKey
        } else {
          publicKey = await keys.importJWK(
            pubjwk(toJWK(vector.input.pwd || vector.input.key)),
            dir ? vector.input.enc : vector.input.alg,
          )
        }

        const result = await encrypt.encrypt(publicKey)
        await flattened.decrypt(result, privateKey, decryptOptions)
      }

      const privateKey = await keys.importJWK(
        toJWK(vector.input.pwd || vector.input.key),
        dir ? vector.input.enc : vector.input.alg,
        integrated ? keyImportOptions(vector.input.alg) : undefined,
      )
      if (vector.output.json_flat) {
        const result = await flattened.decrypt(vector.output.json_flat, privateKey, decryptOptions)
        if (integrated) {
          t.deepEqual(result.plaintext, encode(vector.input.plaintext))
          t.deepEqual(result.additionalAuthenticatedData, encode(vector.input.aad))
        }
      }
      if (vector.output.compact) {
        const result = await compact.decrypt(vector.output.compact, privateKey, decryptOptions)
        if (integrated) {
          t.deepEqual(result.plaintext, encode(vector.input.plaintext))
        }
      }
      t.ok(1)
    }

    for (const vector of jweVectors) {
      if (supported(vector)) {
        test(vector.title, async (t) => {
          try {
            await execute(vector)(t)
          } catch (error) {
            if (vector.input.enc === undefined && isRuntimeUnsupported(error)) {
              t.ok(1)
              return
            }

            throw error
          }
        })
      } else {
        test(`[not supported] ${vector.title}`, async (t) => {
          await t.rejects(execute(vector)(t))
        })
      }
    }
  }
}
