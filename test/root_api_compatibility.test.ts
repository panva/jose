import test from 'ava'

import * as root from '../src/index.js'
import * as compactDecrypt from '../src/jwe/compact/decrypt.js'
import * as compactEncrypt from '../src/jwe/compact/encrypt.js'
import * as flattenedDecrypt from '../src/jwe/flattened/decrypt.js'
import * as flattenedEncrypt from '../src/jwe/flattened/encrypt.js'
import * as generalDecrypt from '../src/jwe/general/decrypt.js'
import * as generalEncrypt from '../src/jwe/general/encrypt.js'
import * as compactSign from '../src/jws/compact/sign.js'
import * as compactVerify from '../src/jws/compact/verify.js'
import * as flattenedSign from '../src/jws/flattened/sign.js'
import * as flattenedVerify from '../src/jws/flattened/verify.js'
import * as generalSign from '../src/jws/general/sign.js'
import * as generalVerify from '../src/jws/general/verify.js'
import * as jwtDecrypt from '../src/jwt/decrypt.js'
import * as jwtEncrypt from '../src/jwt/encrypt.js'
import * as jwtSign from '../src/jwt/sign.js'
import * as jwtUnsecured from '../src/jwt/unsecured.js'
import * as jwtVerify from '../src/jwt/verify.js'
import * as jwkEmbedded from '../src/jwk/embedded.js'
import * as jwkThumbprint from '../src/jwk/thumbprint.js'
import * as keyExport from '../src/key/export.js'
import * as keyGeneratePair from '../src/key/generate_key_pair.js'
import * as keyGenerateSecret from '../src/key/generate_secret.js'
import * as keyImport from '../src/key/import.js'
import * as jwksLocal from '../src/jwks/local.js'
import * as jwksRemote from '../src/jwks/remote.js'
import * as decodeJwt from '../src/util/decode_jwt.js'
import * as decodeProtectedHeader from '../src/util/decode_protected_header.js'
import * as errors from '../src/util/errors.js'
import * as base64url from '../src/util/base64url.js'

const rootRuntimeExports = [
  'CompactEncrypt',
  'CompactSign',
  'EmbeddedJWK',
  'EncryptJWT',
  'FlattenedEncrypt',
  'FlattenedSign',
  'GeneralEncrypt',
  'GeneralSign',
  'SignJWT',
  'UnsecuredJWT',
  'base64url',
  'calculateJwkThumbprint',
  'calculateJwkThumbprintUri',
  'compactDecrypt',
  'compactVerify',
  'createLocalJWKSet',
  'createRemoteJWKSet',
  'cryptoRuntime',
  'customFetch',
  'decodeJwt',
  'decodeProtectedHeader',
  'errors',
  'exportJWK',
  'exportPKCS8',
  'exportSPKI',
  'flattenedDecrypt',
  'flattenedVerify',
  'generalDecrypt',
  'generalVerify',
  'generateKeyPair',
  'generateSecret',
  'importJWK',
  'importPKCS8',
  'importSPKI',
  'importX509',
  'jwksCache',
  'jwtDecrypt',
  'jwtVerify',
] as const

test('root runtime export keys remain unchanged', (t) => {
  t.deepEqual(Object.keys(root).sort(), rootRuntimeExports)
})

test('root runtime exports retain their deep-import identity', (t) => {
  const bindings = [
    ['CompactEncrypt', compactEncrypt.CompactEncrypt],
    ['CompactSign', compactSign.CompactSign],
    ['EmbeddedJWK', jwkEmbedded.EmbeddedJWK],
    ['EncryptJWT', jwtEncrypt.EncryptJWT],
    ['FlattenedEncrypt', flattenedEncrypt.FlattenedEncrypt],
    ['FlattenedSign', flattenedSign.FlattenedSign],
    ['GeneralEncrypt', generalEncrypt.GeneralEncrypt],
    ['GeneralSign', generalSign.GeneralSign],
    ['SignJWT', jwtSign.SignJWT],
    ['UnsecuredJWT', jwtUnsecured.UnsecuredJWT],
    ['base64url', base64url],
    ['calculateJwkThumbprint', jwkThumbprint.calculateJwkThumbprint],
    ['calculateJwkThumbprintUri', jwkThumbprint.calculateJwkThumbprintUri],
    ['compactDecrypt', compactDecrypt.compactDecrypt],
    ['compactVerify', compactVerify.compactVerify],
    ['createLocalJWKSet', jwksLocal.createLocalJWKSet],
    ['createRemoteJWKSet', jwksRemote.createRemoteJWKSet],
    ['customFetch', jwksRemote.customFetch],
    ['decodeJwt', decodeJwt.decodeJwt],
    ['decodeProtectedHeader', decodeProtectedHeader.decodeProtectedHeader],
    ['errors', errors],
    ['exportJWK', keyExport.exportJWK],
    ['exportPKCS8', keyExport.exportPKCS8],
    ['exportSPKI', keyExport.exportSPKI],
    ['flattenedDecrypt', flattenedDecrypt.flattenedDecrypt],
    ['flattenedVerify', flattenedVerify.flattenedVerify],
    ['generalDecrypt', generalDecrypt.generalDecrypt],
    ['generalVerify', generalVerify.generalVerify],
    ['generateKeyPair', keyGeneratePair.generateKeyPair],
    ['generateSecret', keyGenerateSecret.generateSecret],
    ['importJWK', keyImport.importJWK],
    ['importPKCS8', keyImport.importPKCS8],
    ['importSPKI', keyImport.importSPKI],
    ['importX509', keyImport.importX509],
    ['jwksCache', jwksRemote.jwksCache],
    ['jwtDecrypt', jwtDecrypt.jwtDecrypt],
    ['jwtVerify', jwtVerify.jwtVerify],
  ] as const

  t.deepEqual(
    bindings.map(([name]) => name),
    rootRuntimeExports.filter((name) => name !== 'cryptoRuntime'),
  )
  for (const [name, deep] of bindings) {
    t.is(root[name], deep, name)
  }
})
