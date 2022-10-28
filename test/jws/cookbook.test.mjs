import test from 'ava'
import { root, keyRoot } from '../dist.mjs'
import vectors from '../../cookbook/jws.mjs'

const { FlattenedSign, flattenedVerify, CompactSign, compactVerify } = await import(root)
const { importJWK } = await import(keyRoot)

const flattened = {
  Sign: FlattenedSign,
  verify: flattenedVerify,
}
const compact = {
  Sign: CompactSign,
  verify: compactVerify,
}

const encode = TextEncoder.prototype.encode.bind(new TextEncoder())

const pubjwk = ({ d, p, q, dp, dq, qi, ...jwk }) => jwk

async function testCookbook(t, vector) {
  const reproducible = !!vector.reproducible

  if (reproducible) {
    // sign and compare results are the same
    const runs = [[flattened, vector.output.json_flat]]
    if (
      !vector.signing.protected ||
      !('b64' in vector.signing.protected) ||
      vector.signing.protected.b64 === true
    ) {
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

      const privateKey = await importJWK(vector.input.key, vector.input.alg)

      const result = await sign.sign(privateKey)

      if (typeof result === 'object') {
        Object.entries(expectedResult).forEach(([prop, expected]) => {
          if (
            prop === 'payload' &&
            vector.signing.protected &&
            vector.signing.protected.b64 === false
          )
            return
          t.is(JSON.stringify(result[prop]), JSON.stringify(expected))
        })
      } else {
        t.is(result, expectedResult)
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

    const privateKey = await importJWK(vector.input.key, vector.input.alg)
    const publicKey = await importJWK(pubjwk(vector.input.key), vector.input.alg)

    const result = await sign.sign(privateKey)
    await t.notThrowsAsync(flattened.verify(result, publicKey))
  }

  const publicKey = await importJWK(pubjwk(vector.input.key), vector.input.alg)

  if (vector.output.json_flat) {
    await t.notThrowsAsync(flattened.verify(vector.output.json_flat, publicKey))
  }
  if (vector.output.compact) {
    await t.notThrowsAsync(compact.verify(vector.output.compact, publicKey))
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
  run(testCookbook, vector)
}
