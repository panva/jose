import type QUnit from 'qunit'
import * as env from './env.js'
import { KEYS } from './fixtures.js'
import type * as jose from '../src/index.js'

function normalize(pem: string) {
  return pem.replace(/\s+$/, '')
}

export default (
  QUnit: QUnit,
  lib: typeof jose,
  keys: Pick<typeof jose, 'exportJWK' | 'importJWK'>,
) => {
  const { module, test } = QUnit
  module('pem.ts')

  type Vector = [string | string[], string]
  const algorithms: Vector[] = [
    ['ES256', KEYS.P256.pkcs8],
    ['ES256', KEYS.P256.spki],
    ['ES256', KEYS.P256.x509],
    ['ES384', KEYS.P384.pkcs8],
    ['ES384', KEYS.P384.spki],
    ['ES384', KEYS.P384.x509],
    ['ES512', KEYS.P521.pkcs8],
    ['ES512', KEYS.P521.spki],
    ['ES512', KEYS.P521.x509],
    ['PS256', KEYS.RSA.pkcs8],
    ['PS256', KEYS.RSA.spki],
    ['PS256', KEYS.RSA.x509],
    ['PS384', KEYS.RSA.pkcs8],
    ['PS384', KEYS.RSA.spki],
    ['PS384', KEYS.RSA.x509],
    ['PS512', KEYS.RSA.pkcs8],
    ['PS512', KEYS.RSA.spki],
    ['PS512', KEYS.RSA.x509],
    ['RS256', KEYS.RSA.pkcs8],
    ['RS256', KEYS.RSA.spki],
    ['RS256', KEYS.RSA.x509],
    ['RS384', KEYS.RSA.pkcs8],
    ['RS384', KEYS.RSA.spki],
    ['RS384', KEYS.RSA.x509],
    ['RS512', KEYS.RSA.pkcs8],
    ['RS512', KEYS.RSA.spki],
    ['RS512', KEYS.RSA.x509],
    ['RSA-OAEP-256', KEYS.RSA.pkcs8],
    ['RSA-OAEP-256', KEYS.RSA.spki],
    ['RSA-OAEP-256', KEYS.RSA.x509],
    ['RSA-OAEP-384', KEYS.RSA.pkcs8],
    ['RSA-OAEP-384', KEYS.RSA.spki],
    ['RSA-OAEP-384', KEYS.RSA.x509],
    ['RSA-OAEP-512', KEYS.RSA.pkcs8],
    ['RSA-OAEP-512', KEYS.RSA.spki],
    ['RSA-OAEP-512', KEYS.RSA.x509],
    ['RSA-OAEP', KEYS.RSA.pkcs8],
    ['RSA-OAEP', KEYS.RSA.spki],
    ['RSA-OAEP', KEYS.RSA.x509],
    [['ECDH-ES', 'P-256'], KEYS.P256.pkcs8],
    [['ECDH-ES', 'P-256'], KEYS.P256.spki],
    [['ECDH-ES', 'P-256'], KEYS.P256.x509],
    [['ECDH-ES', 'P-384'], KEYS.P384.pkcs8],
    [['ECDH-ES', 'P-384'], KEYS.P384.spki],
    [['ECDH-ES', 'P-384'], KEYS.P384.x509],
    [['ECDH-ES', 'P-521'], KEYS.P521.pkcs8],
    [['ECDH-ES', 'P-521'], KEYS.P521.spki],
    [['ECDH-ES', 'P-521'], KEYS.P521.x509],
    [['ECDH-ES', 'X25519'], KEYS.X25519.pkcs8],
    [['ECDH-ES', 'X25519'], KEYS.X25519.spki],
    ['Ed25519', KEYS.Ed25519.pkcs8],
    ['Ed25519', KEYS.Ed25519.spki],
    ['Ed25519', KEYS.Ed25519.x509],
    [['EdDSA', 'Ed25519'], KEYS.Ed25519.pkcs8],
    [['EdDSA', 'Ed25519'], KEYS.Ed25519.spki],
    [['EdDSA', 'Ed25519'], KEYS.Ed25519.x509],
    ['ML-DSA-44', KEYS['ML-DSA-44'].pkcs8],
    ['ML-DSA-44', KEYS['ML-DSA-44'].pkcs8_seed],
    ['ML-DSA-44', KEYS['ML-DSA-44'].spki],
    ['ML-DSA-65', KEYS['ML-DSA-65'].pkcs8],
    ['ML-DSA-65', KEYS['ML-DSA-65'].spki],
    ['ML-DSA-87', KEYS['ML-DSA-87'].pkcs8],
    ['ML-DSA-87', KEYS['ML-DSA-87'].spki],
  ]

  function title(alg: string, crv: string | undefined, pem: string, supported = true) {
    let result = ''
    if (!supported) {
      result = '[not supported] '
    }
    result += `${alg} `
    if (crv) result += `${crv} `
    result += pem.startsWith('-----BEGIN PRIVATE KEY-----')
      ? 'PKCS8 Private Key Import'
      : pem.startsWith('-----BEGIN PUBLIC KEY-----')
        ? 'SPKI Public Key Import'
        : 'X.509 Certificate Import'
    return result
  }

  for (const vector of algorithms) {
    const [, pem] = vector
    let [alg] = vector

    let crv!: string
    if (Array.isArray(alg)) {
      ;[alg, crv] = alg
    }

    let x509 = false
    let importFn: typeof lib.importSPKI | typeof lib.importPKCS8 | typeof lib.importX509
    let exportFn: typeof lib.exportSPKI | typeof lib.exportPKCS8
    switch (true) {
      case pem.startsWith('-----BEGIN PRIVATE KEY-----'): {
        importFn = lib.importPKCS8
        exportFn = lib.exportPKCS8
        break
      }
      case pem.startsWith('-----BEGIN PUBLIC KEY-----'): {
        importFn = lib.importSPKI
        exportFn = lib.exportSPKI
        break
      }
      case pem.startsWith('-----BEGIN CERTIFICATE-----'): {
        importFn = lib.importX509
        exportFn = lib.exportSPKI
        x509 = true
        break
      }
      default:
        throw new Error()
    }

    const execute = async (t: typeof QUnit.assert) => {
      const k = await importFn(pem, alg as string, { extractable: true })

      if (env.supported(alg, 'pem export')) {
        if (!x509) {
          t.strictEqual(normalize(await exportFn(k)), normalize(pem))
          if (env.isNode && lib.importJWK !== keys.importJWK) {
            const nCrypto = globalThis.process.getBuiltinModule('node:crypto')
            if (pem.startsWith('-----BEGIN PRIVATE KEY-----')) {
              t.strictEqual(
                normalize(await exportFn(nCrypto.createPrivateKey(pem))),
                normalize(pem),
              )
            } else {
              t.strictEqual(normalize(await exportFn(nCrypto.createPublicKey(pem))), normalize(pem))
            }
          }
        } else {
          await exportFn(k)
        }
      }
      t.ok(1)
    }

    if (env.supported(alg, 'pem import') && env.supported(crv, 'pem import')) {
      test(title(alg, crv, pem), execute)
    } else {
      test(title(alg, crv, pem, false), async (t) => {
        await t.rejects(execute(t))
      })
    }
  }
}
