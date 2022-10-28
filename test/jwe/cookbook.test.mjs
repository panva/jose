import test from 'ava'
import { root, keyRoot } from '../dist.mjs'
import vectors from '../../cookbook/jwe.mjs'

const { FlattenedEncrypt, flattenedDecrypt, CompactEncrypt, compactDecrypt, base64url } =
  await import(root)
const { importJWK } = await import(keyRoot)

const flattened = {
  Encrypt: FlattenedEncrypt,
  decrypt: flattenedDecrypt,
}
const compact = {
  Encrypt: CompactEncrypt,
  decrypt: compactDecrypt,
}
const encode = TextEncoder.prototype.encode.bind(new TextEncoder())

const toJWK = (input) => {
  if (typeof input === 'string') {
    return {
      kty: 'oct',
      k: base64url.encode(encode(input)),
    }
  }
  return input
}
const pubjwk = ({ d, p, q, dp, dq, qi, ...jwk }) => jwk

async function testCookbook(t, vector) {
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
        encrypt.setContentEncryptionKey(base64url.decode(cek))
      }

      if (iv) {
        encrypt.setInitializationVector(base64url.decode(iv))
      }

      if (vector.input.aad) {
        encrypt.setAdditionalAuthenticatedData(encode(vector.input.aad))
      }

      const keyManagementParameters = {}

      if (vector.encrypting_key && vector.encrypting_key.iv) {
        keyManagementParameters.iv = base64url.decode(vector.encrypting_key.iv)
      }

      if (vector.encrypting_key && vector.encrypting_key.iteration_count) {
        keyManagementParameters.p2c = vector.encrypting_key.iteration_count
      }

      if (vector.encrypting_key && vector.encrypting_key.salt) {
        keyManagementParameters.p2s = base64url.decode(vector.encrypting_key.salt)
      }

      if (vector.encrypting_key && vector.encrypting_key.epk) {
        keyManagementParameters.epk = importJWK(vector.encrypting_key.epk, 'ECDH')
      }

      if (Object.keys(keyManagementParameters).length !== 0) {
        encrypt.setKeyManagementParameters(keyManagementParameters)
      }

      const publicKey = await importJWK(
        pubjwk(toJWK(vector.input.pwd || vector.input.key)),
        dir ? vector.input.enc : vector.input.alg,
      )

      const result = await encrypt.encrypt(publicKey)

      if (typeof result === 'object') {
        Object.entries(expectedResult).forEach(([prop, expected]) => {
          t.is(JSON.stringify(result[prop]), JSON.stringify(expected))
        })
      } else {
        t.is(result, expectedResult)
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

    const privateKey = await importJWK(
      toJWK(vector.input.pwd || vector.input.key),
      dir ? vector.input.enc : vector.input.alg,
    )
    let publicKey
    if (privateKey.type === 'secret') {
      publicKey = privateKey
    } else {
      publicKey = await importJWK(
        pubjwk(toJWK(vector.input.pwd || vector.input.key)),
        dir ? vector.input.enc : vector.input.alg,
      )
    }

    const result = await encrypt.encrypt(publicKey)
    await t.notThrowsAsync(flattened.decrypt(result, privateKey))
  }

  const privateKey = await importJWK(
    toJWK(vector.input.pwd || vector.input.key),
    dir ? vector.input.enc : vector.input.alg,
  )
  if (vector.output.json_flat) {
    await t.notThrowsAsync(flattened.decrypt(vector.output.json_flat, privateKey))
  }
  if (vector.output.compact) {
    await t.notThrowsAsync(compact.decrypt(vector.output.compact, privateKey))
  }
}
testCookbook.title = (title, vector) => `${vector.title}${title ? ` ${title}` : ''}`

for (const vector of vectors) {
  let run = test
  if (
    ('WEBCRYPTO' in process.env || 'CRYPTOKEY' in process.env || 'WEBAPI' in process.env) &&
    vector.webcrypto === false
  ) {
    run = run.failing
  }
  if ('WEBAPI' in process.env && vector.webapi === false) {
    run = run.failing
  }
  if ('electron' in process.versions && vector.electron === false) {
    run = run.failing
  }
  run(testCookbook, vector)
}
