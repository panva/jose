import test from 'ava'

import { ES256 } from '../src/algorithms/jws.js'
import { dir } from '../src/algorithms/jwe.js'
import { A256GCM } from '../src/algorithms/jwe/enc.js'
import { ES256 as keyES256, A256GCM as keyA256GCM } from '../src/algorithms/key.js'
import { composeCompactSign } from '../src/composable/jws/compact/sign.js'
import { composeCompactVerify } from '../src/composable/jws/compact/verify.js'
import { composeFlattenedSign } from '../src/composable/jws/flattened/sign.js'
import { composeFlattenedVerify } from '../src/composable/jws/flattened/verify.js'
import { composeGeneralSign } from '../src/composable/jws/general/sign.js'
import { composeGeneralVerify } from '../src/composable/jws/general/verify.js'
import { composeCompactEncrypt } from '../src/composable/jwe/compact/encrypt.js'
import { composeCompactDecrypt } from '../src/composable/jwe/compact/decrypt.js'
import { composeFlattenedEncrypt } from '../src/composable/jwe/flattened/encrypt.js'
import { composeFlattenedDecrypt } from '../src/composable/jwe/flattened/decrypt.js'
import { composeGeneralEncrypt } from '../src/composable/jwe/general/encrypt.js'
import { composeGeneralDecrypt } from '../src/composable/jwe/general/decrypt.js'
import { composeSignJWT } from '../src/composable/jwt/sign.js'
import { composeJwtVerify } from '../src/composable/jwt/verify.js'
import { composeEncryptJWT } from '../src/composable/jwt/encrypt.js'
import { composeJwtDecrypt } from '../src/composable/jwt/decrypt.js'
import { composeEmbeddedJWK } from '../src/composable/jwk/embedded.js'
import { composeLocalJWKSet } from '../src/composable/jwks/local.js'
import { composeRemoteJWKSet } from '../src/composable/jwks/remote.js'
import { composeKeyImport } from '../src/composable/key/import.js'
import { composeGenerateKeyPair } from '../src/composable/key/generate/keypair.js'
import { composeGenerateSecret } from '../src/composable/key/generate/secret.js'

test('composed values retain their public names', (t) => {
  const named = [
    [composeCompactSign(ES256), 'CompactSign'],
    [composeCompactVerify(ES256), 'compactVerify'],
    [composeFlattenedSign(ES256), 'FlattenedSign'],
    [composeFlattenedVerify(ES256), 'flattenedVerify'],
    [composeGeneralSign(ES256), 'GeneralSign'],
    [composeGeneralVerify(ES256), 'generalVerify'],
    [composeCompactEncrypt(dir, A256GCM), 'CompactEncrypt'],
    [composeCompactDecrypt(dir, A256GCM), 'compactDecrypt'],
    [composeFlattenedEncrypt(dir, A256GCM), 'FlattenedEncrypt'],
    [composeFlattenedDecrypt(dir, A256GCM), 'flattenedDecrypt'],
    [composeGeneralEncrypt(dir, A256GCM), 'GeneralEncrypt'],
    [composeGeneralDecrypt(dir, A256GCM), 'generalDecrypt'],
    [composeSignJWT(ES256), 'SignJWT'],
    [composeJwtVerify(ES256), 'jwtVerify'],
    [composeEncryptJWT(dir, A256GCM), 'EncryptJWT'],
    [composeJwtDecrypt(dir, A256GCM), 'jwtDecrypt'],
    [composeEmbeddedJWK(ES256), 'EmbeddedJWK'],
    [composeLocalJWKSet(ES256), 'createLocalJWKSet'],
    [composeRemoteJWKSet(ES256), 'createRemoteJWKSet'],
    [composeGenerateKeyPair(keyES256), 'generateKeyPair'],
    [composeGenerateSecret(keyA256GCM), 'generateSecret'],
  ] as const

  for (const [value, name] of named) {
    t.is(value.name, name)
  }

  const keyImport = composeKeyImport(keyES256)
  t.deepEqual(
    Object.values(keyImport).map(({ name }) => name),
    ['importSPKI', 'importX509', 'importPKCS8', 'importJWK'],
  )
})
