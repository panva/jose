import type { KeyObject } from 'crypto'
import { expectType } from 'tsd'

import * as lib from '../../dist/types'

{
  const kp = await lib.generateKeyPair('EdDSA')
  expectType<lib.GenerateKeyPairResult>(kp)
  expectType<lib.KeyLike>(kp.privateKey)
  expectType<lib.KeyLike>(kp.publicKey)
}

{
  const kp = await lib.generateKeyPair<CryptoKey>('EdDSA')
  expectType<lib.GenerateKeyPairResult<CryptoKey>>(kp)
  expectType<CryptoKey>(kp.privateKey)
  expectType<CryptoKey>(kp.publicKey)
}

{
  const kp = await lib.generateKeyPair<KeyObject>('EdDSA')
  expectType<lib.GenerateKeyPairResult<KeyObject>>(kp)
  expectType<KeyObject>(kp.privateKey)
  expectType<KeyObject>(kp.publicKey)
}

expectType<lib.KeyLike | Uint8Array>(await lib.generateSecret('HS256'))
expectType<CryptoKey | Uint8Array>(await lib.generateSecret<CryptoKey>('HS256'))
expectType<KeyObject | Uint8Array>(await lib.generateSecret<KeyObject>('HS256'))

expectType<lib.KeyLike>(await lib.importPKCS8('', 'RS256'))
expectType<CryptoKey>(await lib.importPKCS8<CryptoKey>('', 'RS256'))
expectType<KeyObject>(await lib.importPKCS8<KeyObject>('', 'RS256'))

expectType<lib.KeyLike>(await lib.importSPKI('', 'RS256'))
expectType<CryptoKey>(await lib.importSPKI<CryptoKey>('', 'RS256'))
expectType<KeyObject>(await lib.importSPKI<KeyObject>('', 'RS256'))

expectType<lib.KeyLike>(await lib.importX509('', 'RS256'))
expectType<CryptoKey>(await lib.importX509<CryptoKey>('', 'RS256'))
expectType<KeyObject>(await lib.importX509<KeyObject>('', 'RS256'))

expectType<lib.KeyLike | Uint8Array>(await lib.importJWK({}))
expectType<CryptoKey | Uint8Array>(await lib.importJWK<CryptoKey>({}))
expectType<KeyObject | Uint8Array>(await lib.importJWK<KeyObject>({}))

{
  const result = await lib.jwtVerify('', lib.createLocalJWKSet({ keys: [] }))
  expectType<lib.KeyLike | Uint8Array>(result.key)
}

{
  const result = await lib.jwtVerify<CryptoKey>('', lib.createLocalJWKSet({ keys: [] }))
  expectType<CryptoKey | Uint8Array>(result.key)
}

{
  const result = await lib.jwtVerify<KeyObject>('', lib.createLocalJWKSet({ keys: [] }))
  expectType<KeyObject | Uint8Array>(result.key)
}

{
  const result = await lib.compactVerify('', lib.createLocalJWKSet({ keys: [] }))
  expectType<lib.KeyLike | Uint8Array>(result.key)
}

{
  const result = await lib.compactVerify<CryptoKey>('', lib.createLocalJWKSet({ keys: [] }))
  expectType<CryptoKey | Uint8Array>(result.key)
}

{
  const result = await lib.compactVerify<KeyObject>('', lib.createLocalJWKSet({ keys: [] }))
  expectType<KeyObject | Uint8Array>(result.key)
}

{
  const result = await lib.flattenedVerify(
    { payload: '', signature: '' },
    lib.createLocalJWKSet({ keys: [] }),
  )
  expectType<lib.KeyLike | Uint8Array>(result.key)
}

{
  const result = await lib.flattenedVerify<CryptoKey>(
    { payload: '', signature: '' },
    lib.createLocalJWKSet({ keys: [] }),
  )
  expectType<CryptoKey | Uint8Array>(result.key)
}

{
  const result = await lib.flattenedVerify<KeyObject>(
    { payload: '', signature: '' },
    lib.createLocalJWKSet({ keys: [] }),
  )
  expectType<KeyObject | Uint8Array>(result.key)
}

{
  const result = await lib.generalVerify(
    { payload: '', signatures: [] },
    lib.createLocalJWKSet({ keys: [] }),
  )
  expectType<lib.KeyLike | Uint8Array>(result.key)
}

{
  const result = await lib.generalVerify<CryptoKey>(
    { payload: '', signatures: [] },
    lib.createLocalJWKSet({ keys: [] }),
  )
  expectType<CryptoKey | Uint8Array>(result.key)
}

{
  const result = await lib.generalVerify<KeyObject>(
    { payload: '', signatures: [] },
    lib.createLocalJWKSet({ keys: [] }),
  )
  expectType<KeyObject | Uint8Array>(result.key)
}

{
  const result = await lib.jwtDecrypt('', () => <any>{})
  expectType<lib.KeyLike | Uint8Array>(result.key)
}

{
  const result = await lib.jwtDecrypt<CryptoKey>('', () => <any>{})
  expectType<CryptoKey | Uint8Array>(result.key)
}

{
  const result = await lib.jwtDecrypt<KeyObject>('', () => <any>{})
  expectType<KeyObject | Uint8Array>(result.key)
}

{
  const result = await lib.compactDecrypt('', () => <any>{})
  expectType<lib.KeyLike | Uint8Array>(result.key)
}

{
  const result = await lib.compactDecrypt<CryptoKey>('', () => <any>{})
  expectType<CryptoKey | Uint8Array>(result.key)
}

{
  const result = await lib.compactDecrypt<KeyObject>('', () => <any>{})
  expectType<KeyObject | Uint8Array>(result.key)
}

{
  const result = await lib.flattenedDecrypt({ ciphertext: '', iv: '', tag: '' }, () => <any>{})
  expectType<lib.KeyLike | Uint8Array>(result.key)
}

{
  const result = await lib.flattenedDecrypt<CryptoKey>(
    { ciphertext: '', iv: '', tag: '' },
    () => <any>{},
  )
  expectType<CryptoKey | Uint8Array>(result.key)
}

{
  const result = await lib.flattenedDecrypt<KeyObject>(
    { ciphertext: '', iv: '', tag: '' },
    () => <any>{},
  )
  expectType<KeyObject | Uint8Array>(result.key)
}

{
  const result = await lib.generalDecrypt(
    { ciphertext: '', iv: '', tag: '', recipients: [] },
    () => <any>{},
  )
  expectType<lib.KeyLike | Uint8Array>(result.key)
}

{
  const result = await lib.generalDecrypt<CryptoKey>(
    { ciphertext: '', iv: '', tag: '', recipients: [] },
    () => <any>{},
  )
  expectType<CryptoKey | Uint8Array>(result.key)
}

{
  const result = await lib.generalDecrypt<KeyObject>(
    { ciphertext: '', iv: '', tag: '', recipients: [] },
    () => <any>{},
  )
  expectType<KeyObject | Uint8Array>(result.key)
}

expectType<lib.KeyLike>(await lib.createLocalJWKSet({ keys: [] })())
expectType<CryptoKey>(await lib.createLocalJWKSet<CryptoKey>({ keys: [] })())
expectType<KeyObject>(await lib.createLocalJWKSet<KeyObject>({ keys: [] })())

expectType<lib.KeyLike>(await lib.createRemoteJWKSet(new URL(''))())
expectType<CryptoKey>(await lib.createRemoteJWKSet<CryptoKey>(new URL(''))())
expectType<KeyObject>(await lib.createRemoteJWKSet<KeyObject>(new URL(''))())

expectType<lib.KeyLike>(await lib.EmbeddedJWK())
expectType<CryptoKey>(await lib.EmbeddedJWK())
expectType<KeyObject>(await lib.EmbeddedJWK())
