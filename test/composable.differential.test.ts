import test, { type ExecutionContext } from 'ava'

import {
  CompactEncrypt,
  CompactSign,
  FlattenedEncrypt,
  GeneralEncrypt,
  GeneralSign,
  compactDecrypt,
  compactVerify,
  flattenedDecrypt,
  generalDecrypt,
  generalVerify,
} from '../src/index.js'
import { ES256, HS256 } from '../src/algorithms/jws.js'
import { A256KW, PBES2_HS256_A128KW, dir } from '../src/algorithms/jwe.js'
import { A256GCM } from '../src/algorithms/jwe/enc.js'
import { composeCompactVerify } from '../src/composable/jws/compact/verify.js'
import { composeCompactDecrypt } from '../src/composable/jwe/compact/decrypt.js'
import { composeFlattenedDecrypt } from '../src/composable/jwe/flattened/decrypt.js'
import { composeGeneralDecrypt } from '../src/composable/jwe/general/decrypt.js'
import { composeGeneralVerify } from '../src/composable/jws/general/verify.js'

type JoseError = Error & { code: string }

async function failure(operation: Promise<unknown>): Promise<JoseError> {
  try {
    await operation
  } catch (error) {
    return error as JoseError
  }
  throw new Error('operation unexpectedly succeeded')
}

function compareFailure(t: ExecutionContext, actual: JoseError, expected: JoseError): void {
  t.is(actual.code, expected.code)
  t.is(actual.message, expected.message)
}

function tamper(member: string): string {
  return `${member[0] === 'A' ? 'B' : 'A'}${member.slice(1)}`
}

test('root and composed JWS consumers have identical cryptographic failures', async (t) => {
  const pair = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, false, [
    'sign',
    'verify',
  ])
  const wrongPair = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, false, [
    'sign',
    'verify',
  ])
  const jws = await new CompactSign(new TextEncoder().encode('differential JWS'))
    .setProtectedHeader({ alg: 'ES256' })
    .sign(pair.privateKey)
  const composedVerify = composeCompactVerify(ES256)

  const members = jws.split('.')
  members[2] = tamper(members[2])
  const tampered = members.join('.')
  compareFailure(
    t,
    await failure(composedVerify(tampered, pair.publicKey)),
    await failure(compactVerify(tampered, pair.publicKey)),
  )
  compareFailure(
    t,
    await failure(composedVerify(jws, wrongPair.publicKey)),
    await failure(compactVerify(jws, wrongPair.publicKey)),
  )
  const denied = await failure(composedVerify(jws, pair.publicKey, { algorithms: ['PS256'] }))
  t.is(denied.code, 'ERR_JOSE_ALG_NOT_ALLOWED')
  t.is(denied.message, '"alg" (Algorithm) Header Parameter value not allowed')
})

test('root and composed JWE consumers have identical cryptographic failures', async (t) => {
  const secret = crypto.getRandomValues(new Uint8Array(32))
  const wrongSecret = crypto.getRandomValues(new Uint8Array(32))
  const jwe = await new CompactEncrypt(new TextEncoder().encode('differential JWE'))
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .encrypt(secret)
  const composedDecrypt = composeCompactDecrypt(dir, A256GCM)

  const members = jwe.split('.')
  members[4] = tamper(members[4])
  const tampered = members.join('.')
  compareFailure(
    t,
    await failure(composedDecrypt(tampered, secret)),
    await failure(compactDecrypt(tampered, secret)),
  )
  compareFailure(
    t,
    await failure(composedDecrypt(jwe, wrongSecret)),
    await failure(compactDecrypt(jwe, wrongSecret)),
  )
  const denied = await failure(
    composedDecrypt(jwe, secret, { contentEncryptionAlgorithms: ['A128GCM'] }),
  )
  t.is(denied.code, 'ERR_JOSE_ALG_NOT_ALLOWED')
  t.is(denied.message, '"enc" (Encryption Algorithm) Header Parameter value not allowed')
})

test('root and composed consumers reject malformed Compact serializations identically', async (t) => {
  const key = new Uint8Array(32)

  const malformedJws = 'not-a-compact-jws'
  const rootJwsFailure = await failure(compactVerify(malformedJws, key))
  t.is(rootJwsFailure.code, 'ERR_JWS_INVALID')
  t.is(rootJwsFailure.message, 'Invalid Compact JWS')
  compareFailure(
    t,
    await failure(composeCompactVerify(ES256)(malformedJws, key as never)),
    rootJwsFailure,
  )

  const malformedJwe = 'not-a-compact-jwe'
  const rootJweFailure = await failure(compactDecrypt(malformedJwe, key))
  t.is(rootJweFailure.code, 'ERR_JWE_INVALID')
  t.is(rootJweFailure.message, 'Invalid Compact JWE')
  compareFailure(
    t,
    await failure(composeCompactDecrypt(dir, A256GCM)(malformedJwe, key)),
    rootJweFailure,
  )
})

test('root and composed PBES2 consumers preserve limits and failure substitution', async (t) => {
  const password = crypto.getRandomValues(new Uint8Array(32))
  const wrongPassword = crypto.getRandomValues(new Uint8Array(32))
  const jwe = await new FlattenedEncrypt(new TextEncoder().encode('differential PBES2'))
    .setProtectedHeader({ alg: 'PBES2-HS256+A128KW', enc: 'A256GCM' })
    .setKeyManagementParameters({ p2c: 2049 })
    .encrypt(password)
  const composedDecrypt = composeFlattenedDecrypt(PBES2_HS256_A128KW, A256GCM)
  const allowed: ['PBES2-HS256+A128KW'] = ['PBES2-HS256+A128KW']

  const rootLimitFailure = await failure(
    flattenedDecrypt(jwe, password, {
      keyManagementAlgorithms: allowed,
      maxPBES2Count: 2048,
    }),
  )
  t.is(rootLimitFailure.code, 'ERR_JWE_INVALID')
  t.is(rootLimitFailure.message, 'JOSE Header "p2c" (PBES2 Count) out is of acceptable bounds')
  compareFailure(
    t,
    await failure(
      composedDecrypt(jwe, password, {
        keyManagementAlgorithms: allowed,
        maxPBES2Count: 2048,
      }),
    ),
    rootLimitFailure,
  )

  const rootKeyFailure = await failure(
    flattenedDecrypt(jwe, wrongPassword, { keyManagementAlgorithms: allowed }),
  )
  t.is(rootKeyFailure.code, 'ERR_JWE_DECRYPTION_FAILED')
  t.is(rootKeyFailure.message, 'decryption operation failed')
  compareFailure(
    t,
    await failure(composedDecrypt(jwe, wrongPassword, { keyManagementAlgorithms: allowed })),
    rootKeyFailure,
  )
})

test('root and composed General consumers preserve failure collapsing and precedence', async (t) => {
  const payload = new TextEncoder().encode('differential General serialization')
  const secret = crypto.getRandomValues(new Uint8Array(32))
  const jws = await new GeneralSign(payload)
    .addSignature(secret)
    .setProtectedHeader({ alg: 'HS256' })
    .sign()
  const failedJws = {
    ...jws,
    signatures: [{}, { ...jws.signatures[0], signature: tamper(jws.signatures[0].signature) }],
  }
  const rootJwsFailure = await failure(generalVerify(failedJws as never, secret))
  t.is(rootJwsFailure.code, 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED')
  t.is(rootJwsFailure.message, 'signature verification failed')
  compareFailure(
    t,
    await failure(composeGeneralVerify(HS256)(failedJws as never, secret)),
    rootJwsFailure,
  )

  const malformedJws = { ...jws, signatures: [null] }
  const rootJwsPrecedence = await failure(generalVerify(malformedJws as never, secret))
  t.is(rootJwsPrecedence.code, 'ERR_JWS_INVALID')
  t.is(rootJwsPrecedence.message, 'JWS Signatures missing or incorrect type')
  compareFailure(
    t,
    await failure(composeGeneralVerify(HS256)(malformedJws as never, secret)),
    rootJwsPrecedence,
  )

  const wrappingKey = crypto.getRandomValues(new Uint8Array(32))
  const jwe = await new GeneralEncrypt(payload)
    .setProtectedHeader({ enc: 'A256GCM' })
    .addRecipient(wrappingKey)
    .setUnprotectedHeader({ alg: 'A256KW' })
    .encrypt()
  const recipient = jwe.recipients[0]
  const failedJwe = {
    ...jwe,
    recipients: [{}, { ...recipient, encrypted_key: tamper(recipient.encrypted_key as string) }],
  }
  const rootJweFailure = await failure(generalDecrypt(failedJwe, wrappingKey))
  t.is(rootJweFailure.code, 'ERR_JWE_DECRYPTION_FAILED')
  t.is(rootJweFailure.message, 'decryption operation failed')
  compareFailure(
    t,
    await failure(composeGeneralDecrypt(A256KW, A256GCM)(failedJwe, wrappingKey)),
    rootJweFailure,
  )

  const malformedJwe = { ...jwe, recipients: [null] }
  const rootJwePrecedence = await failure(generalDecrypt(malformedJwe as never, wrappingKey))
  t.is(rootJwePrecedence.code, 'ERR_JWE_INVALID')
  t.is(rootJwePrecedence.message, 'JWE Recipients missing or incorrect type')
  compareFailure(
    t,
    await failure(composeGeneralDecrypt(A256KW, A256GCM)(malformedJwe as never, wrappingKey)),
    rootJwePrecedence,
  )
})

test('composed selection failures preserve resolver ordering and exact codes', async (t) => {
  const verify = composeCompactVerify(ES256)
  let resolverCalls = 0
  const resolver = async () => {
    resolverCalls++
    return crypto.getRandomValues(new Uint8Array(32))
  }
  const protectedHeader = Buffer.from(JSON.stringify({ alg: 'HS256' })).toString('base64url')
  const error = await failure(
    verify(`${protectedHeader}.cGF5bG9hZA.c2lnbmF0dXJl`, resolver as never),
  )
  t.is(resolverCalls, 1)
  t.is(error.code, 'ERR_JOSE_NOT_SUPPORTED')
})
