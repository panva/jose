import { ES256 } from '../dist/webapi/algorithms/jws.js'
import { dir } from '../dist/webapi/algorithms/jwe.js'
import { A256GCM } from '../dist/webapi/algorithms/jwe/enc.js'
import { ES256 as keyES256, A256GCM as keyA256GCM } from '../dist/webapi/algorithms/key.js'
import { composeCompactSign } from '../dist/webapi/composable/jws/compact/sign.js'
import { composeCompactVerify } from '../dist/webapi/composable/jws/compact/verify.js'
import { composeFlattenedSign } from '../dist/webapi/composable/jws/flattened/sign.js'
import { composeFlattenedVerify } from '../dist/webapi/composable/jws/flattened/verify.js'
import { composeGeneralSign } from '../dist/webapi/composable/jws/general/sign.js'
import { composeGeneralVerify } from '../dist/webapi/composable/jws/general/verify.js'
import { composeCompactEncrypt } from '../dist/webapi/composable/jwe/compact/encrypt.js'
import { composeCompactDecrypt } from '../dist/webapi/composable/jwe/compact/decrypt.js'
import { composeFlattenedEncrypt } from '../dist/webapi/composable/jwe/flattened/encrypt.js'
import { composeFlattenedDecrypt } from '../dist/webapi/composable/jwe/flattened/decrypt.js'
import { composeGeneralEncrypt } from '../dist/webapi/composable/jwe/general/encrypt.js'
import { composeGeneralDecrypt } from '../dist/webapi/composable/jwe/general/decrypt.js'
import { composeSignJWT } from '../dist/webapi/composable/jwt/sign.js'
import { composeJwtVerify } from '../dist/webapi/composable/jwt/verify.js'
import { composeEncryptJWT } from '../dist/webapi/composable/jwt/encrypt.js'
import { composeJwtDecrypt } from '../dist/webapi/composable/jwt/decrypt.js'
import { composeEmbeddedJWK } from '../dist/webapi/composable/jwk/embedded.js'
import { composeLocalJWKSet } from '../dist/webapi/composable/jwks/local.js'
import { composeRemoteJWKSet } from '../dist/webapi/composable/jwks/remote.js'
import { composeKeyImport } from '../dist/webapi/composable/key/import.js'
import { composeGenerateKeyPair } from '../dist/webapi/composable/key/generate/keypair.js'
import { composeGenerateSecret } from '../dist/webapi/composable/key/generate/secret.js'

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
]

for (const [value, expected] of named) {
  if (value.name !== expected) {
    throw new Error(`composed value is named ${JSON.stringify(value.name)}; expected ${expected}`)
  }
}

const keyImport = composeKeyImport(keyES256)
const keyImportNames = Object.values(keyImport).map(({ name }) => name)
const expectedKeyImportNames = ['importSPKI', 'importX509', 'importPKCS8', 'importJWK']
if (JSON.stringify(keyImportNames) !== JSON.stringify(expectedKeyImportNames)) {
  throw new Error(`composed key import functions are named ${keyImportNames.join(', ')}`)
}

console.log('OK - all 22 composers retain their public value names')
