import type QUnit from 'qunit'
import * as env from './env.js'
import type * as jose from '../src/index.js'

// @ts-ignore
import jwsVectors from '../cookbook/jws.mjs'
// @ts-ignore
import jweVectors from '../cookbook/jwe.mjs'

// TODO: raise in issue in WebKit
if (env.isWebKit) {
  // @ts-ignore
  const ed25519 = jwsVectors.find((vector) => vector.title.includes('Ed25519'))
  ed25519.reproducible = false
}

export default (QUnit: QUnit, lib: typeof jose) => {
  const { module, test } = QUnit

  const encode = TextEncoder.prototype.encode.bind(new TextEncoder())

  const pubjwk = (jwk: jose.JWK) => {
    let { d, p, q, dp, dq, qi, ...publicJwk } = jwk
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
      if (vector.input.alg === 'ES512') {
        return !env.isDeno
      }
      if (vector.input.alg === 'EdDSA') {
        return (env.isWebKit && env.isWebKitAbove17) || !env.isBrowser
      }
      return true
    }

    const execute = (vector: any) => async (t: typeof QUnit.assert) => {
      const reproducible = !!vector.reproducible

      const privateKey = await lib.importJWK(vector.input.key, vector.input.alg)
      const publicKey = await lib.importJWK(pubjwk(vector.input.key), vector.input.alg)

      if (reproducible) {
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
      if (vector.webcrypto === false && !(env.isNodeCrypto || env.isElectron)) {
        return false
      }
      if (env.isElectron && vector.electron === false) {
        return false
      }
      if (vector.input.zip && !env.hasZlib) {
        return false
      }
      return true
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

      const reproducible = !!vector.reproducible

      if (reproducible) {
        // sign and compare results are the same
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
            keyManagementParameters.epk = <jose.KeyLike>(
              await lib.importJWK(vector.encrypting_key.epk, vector.input.alg)
            )
          }

          if (Object.keys(keyManagementParameters).length !== 0) {
            encrypt.setKeyManagementParameters(keyManagementParameters)
          }

          const publicKey = await lib.importJWK(
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

        const privateKey = <jose.KeyLike>(
          await lib.importJWK(
            toJWK(vector.input.pwd || vector.input.key),
            dir ? vector.input.enc : vector.input.alg,
            true,
          )
        )
        let publicKey
        if (privateKey.type === 'secret') {
          publicKey = privateKey
        } else {
          publicKey = await lib.importJWK(
            pubjwk(toJWK(vector.input.pwd || vector.input.key)),
            dir ? vector.input.enc : vector.input.alg,
          )
        }

        const result = await encrypt.encrypt(publicKey)
        await flattened.decrypt(result, privateKey)
      }

      const privateKey = await lib.importJWK(
        toJWK(vector.input.pwd || vector.input.key),
        dir ? vector.input.enc : vector.input.alg,
      )
      if (vector.output.json_flat) {
        await flattened.decrypt(vector.output.json_flat, privateKey)
      }
      if (vector.output.compact) {
        await compact.decrypt(vector.output.compact, privateKey)
      }
      t.ok(1)
    }

    for (const vector of jweVectors) {
      if (supported(vector)) {
        test(vector.title, execute(vector))
      } else {
        test(`[not supported] ${vector.title}`, async (t) => {
          await t.rejects(execute(vector)(t))
        })
      }
    }
  }
}
