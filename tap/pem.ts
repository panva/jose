import type QUnit from 'qunit'
import * as env from './env.js'
import { KEYS } from './fixtures.js'
import type * as jose from '../src/index.js'

function normalize(pem: string) {
  return pem.replace(/\s+$/, '')
}

export default (QUnit: QUnit, lib: typeof jose) => {
  const { module, test } = QUnit
  module('pem.ts')

  type Vector = [string | string[], string, boolean]
  const algorithms: Vector[] = [
    ['ES256', KEYS.P256.pkcs8, true],
    ['ES256', KEYS.P256.spki, true],
    ['ES256', KEYS.P256.x509, true],
    ['ES256K', KEYS.secp256k1.pkcs8, env.isNodeCrypto],
    ['ES256K', KEYS.secp256k1.spki, env.isNodeCrypto],
    ['ES256K', KEYS.secp256k1.x509, env.isNodeCrypto],
    ['ES384', KEYS.P384.pkcs8, true],
    ['ES384', KEYS.P384.spki, true],
    ['ES384', KEYS.P384.x509, true],
    ['ES512', KEYS.P521.pkcs8, !env.isDeno],
    ['ES512', KEYS.P521.spki, !env.isDeno],
    ['ES512', KEYS.P521.x509, !env.isDeno],
    ['PS256', KEYS.RSA.pkcs8, true],
    ['PS256', KEYS.RSA.spki, true],
    ['PS256', KEYS.RSA.x509, true],
    ['PS384', KEYS.RSA.pkcs8, true],
    ['PS384', KEYS.RSA.spki, true],
    ['PS384', KEYS.RSA.x509, true],
    ['PS512', KEYS.RSA.pkcs8, true],
    ['PS512', KEYS.RSA.spki, true],
    ['PS512', KEYS.RSA.x509, true],
    ['RS256', KEYS.RSA.pkcs8, true],
    ['RS256', KEYS.RSA.spki, true],
    ['RS256', KEYS.RSA.x509, true],
    ['RS384', KEYS.RSA.pkcs8, true],
    ['RS384', KEYS.RSA.spki, true],
    ['RS384', KEYS.RSA.x509, true],
    ['RS512', KEYS.RSA.pkcs8, true],
    ['RS512', KEYS.RSA.spki, true],
    ['RS512', KEYS.RSA.x509, true],
    ['RSA-OAEP-256', KEYS.RSA.pkcs8, true],
    ['RSA-OAEP-256', KEYS.RSA.spki, true],
    ['RSA-OAEP-256', KEYS.RSA.x509, true],
    ['RSA-OAEP-384', KEYS.RSA.pkcs8, true],
    ['RSA-OAEP-384', KEYS.RSA.spki, true],
    ['RSA-OAEP-384', KEYS.RSA.x509, true],
    ['RSA-OAEP-512', KEYS.RSA.pkcs8, true],
    ['RSA-OAEP-512', KEYS.RSA.spki, true],
    ['RSA-OAEP-512', KEYS.RSA.x509, true],
    ['RSA-OAEP', KEYS.RSA.pkcs8, true],
    ['RSA-OAEP', KEYS.RSA.spki, true],
    ['RSA-OAEP', KEYS.RSA.x509, true],
    ['RSA1_5', KEYS.RSA.pkcs8, env.isNodeCrypto || env.isElectron],
    ['RSA1_5', KEYS.RSA.spki, env.isNodeCrypto || env.isElectron],
    ['RSA1_5', KEYS.RSA.x509, env.isNodeCrypto || env.isElectron],
    [['ECDH-ES', 'P-256'], KEYS.P256.pkcs8, true],
    [['ECDH-ES', 'P-256'], KEYS.P256.spki, true],
    [['ECDH-ES', 'P-256'], KEYS.P256.x509, true],
    [['ECDH-ES', 'P-384'], KEYS.P384.pkcs8, true],
    [['ECDH-ES', 'P-384'], KEYS.P384.spki, true],
    [['ECDH-ES', 'P-384'], KEYS.P384.x509, true],
    [['ECDH-ES', 'P-521'], KEYS.P521.pkcs8, !env.isDeno],
    [['ECDH-ES', 'P-521'], KEYS.P521.spki, !env.isDeno],
    [['ECDH-ES', 'P-521'], KEYS.P521.x509, !env.isDeno],
    [['ECDH-ES', 'X25519'], KEYS.X25519.pkcs8, env.isDeno || env.isNode || env.isElectron],
    [['ECDH-ES', 'X25519'], KEYS.X25519.spki, env.isDeno || env.isNode || env.isElectron],
    [['ECDH-ES', 'X448'], KEYS.X448.pkcs8, env.isNode],
    [['ECDH-ES', 'X448'], KEYS.X448.spki, env.isNode],
    [['EdDSA', 'Ed25519'], KEYS.Ed25519.pkcs8, !(env.isBrowser || env.isEdgeRuntime)],
    [['EdDSA', 'Ed25519'], KEYS.Ed25519.spki, !(env.isBrowser || env.isEdgeRuntime)],
    [['EdDSA', 'Ed25519'], KEYS.Ed25519.x509, !(env.isBrowser || env.isEdgeRuntime)],
    [['EdDSA', 'Ed448'], KEYS.Ed448.pkcs8, env.isNode],
    [['EdDSA', 'Ed448'], KEYS.Ed448.spki, env.isNode],
    [['EdDSA', 'Ed448'], KEYS.Ed448.x509, env.isNode],
  ]

  function title(alg: string, crv: string | undefined, pem: string, works: boolean) {
    let result = ''
    if (!works) {
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
    const [, pem, works] = vector
    let [alg] = vector

    let crv!: string
    if (Array.isArray(alg)) {
      ;[alg, crv] = alg
    }

    let importFn: typeof lib.importSPKI | typeof lib.importPKCS8 | typeof lib.importX509
    let exportFn: typeof lib.exportSPKI | typeof lib.exportPKCS8 | undefined = undefined
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
        break
      }
      default:
        continue
    }

    const execute = async (t: typeof QUnit.assert) => {
      const k = await importFn(pem, <string>alg, { extractable: true })

      if (exportFn) {
        t.strictEqual(normalize(await exportFn(k)), normalize(pem))
      }
      t.ok(1)
    }

    if (works) {
      test(title(alg, crv, pem, works), execute)
    } else {
      test(title(alg, crv, pem, works), async (t) => {
        await t.rejects(execute(t))
      })
    }
  }
}
