import test from 'ava'
import * as crypto from 'crypto'
import { promisify } from 'util'

const generateKeyPair = promisify(crypto.generateKeyPair)

const [major, minor] = process.version
  .substr(1)
  .split('.')
  .map((str) => parseInt(str, 10))

const rsaPssParams = major >= 17 || (major === 16 && minor >= 9)
const electron = 'electron' in process.versions

const { FlattenedSign, flattenedVerify } = await import('#dist')

if (rsaPssParams) {
  for (const length of [256, 384, 512]) {
    test(`valid RSASSA-PSS-Params PS${length}`, async (t) => {
      for (const options of [
        { modulusLength: 2048 },
        {
          modulusLength: 2048,
          hashAlgorithm: `sha${length}`,
          hash: `sha${length}`,
          mgf1HashAlgorithm: `sha${length}`,
          mgf1Hash: `sha${length}`,
          saltLength: 0,
        },
        {
          modulusLength: 2048,
          hashAlgorithm: `sha${length}`,
          hash: `sha${length}`,
          mgf1HashAlgorithm: `sha${length}`,
          mgf1Hash: `sha${length}`,
          saltLength: length >> 3,
        },
      ]) {
        const { privateKey, publicKey } = await generateKeyPair('rsa-pss', options)
        const jws = await new FlattenedSign(new Uint8Array(0))
          .setProtectedHeader({ alg: `PS${length}` })
          .sign(privateKey)
        await flattenedVerify(jws, publicKey)
      }
      t.pass()
    })

    test(`invalid saltLength for PS${length}`, async (t) => {
      const { privateKey, publicKey } = await generateKeyPair('rsa-pss', {
        modulusLength: 2048,
        hashAlgorithm: `sha${length}`,
        hash: `sha${length}`,
        mgf1HashAlgorithm: `sha${length}`,
        mgf1Hash: `sha${length}`,
        saltLength: (length >> 3) + 1,
      })
      await t.throwsAsync(
        new FlattenedSign(new Uint8Array(0))
          .setProtectedHeader({ alg: `PS${length}` })
          .sign(privateKey),
        {
          message: `Invalid key for this operation, its RSA-PSS parameter saltLength does not meet the requirements of "alg" PS${length}`,
          instanceOf: TypeError,
        },
      )
      await t.throwsAsync(
        flattenedVerify({ header: { alg: `PS${length}` }, payload: '', signature: '' }, publicKey),
        {
          message: `Invalid key for this operation, its RSA-PSS parameter saltLength does not meet the requirements of "alg" PS${length}`,
          instanceOf: TypeError,
        },
      )
    })

    test(`invalid hashAlgorithm for PS${length}`, async (t) => {
      const { privateKey, publicKey } = await generateKeyPair('rsa-pss', {
        modulusLength: 2048,
        hashAlgorithm: 'sha1',
        hash: 'sha1',
        mgf1HashAlgorithm: `sha${length}`,
        mgf1Hash: `sha${length}`,
        saltLength: length >> 3,
      })
      await t.throwsAsync(
        new FlattenedSign(new Uint8Array(0))
          .setProtectedHeader({ alg: `PS${length}` })
          .sign(privateKey),
        {
          message: `Invalid key for this operation, its RSA-PSS parameters do not meet the requirements of "alg" PS${length}`,
          instanceOf: TypeError,
        },
      )
      await t.throwsAsync(
        flattenedVerify({ header: { alg: `PS${length}` }, payload: '', signature: '' }, publicKey),
        {
          message: `Invalid key for this operation, its RSA-PSS parameters do not meet the requirements of "alg" PS${length}`,
          instanceOf: TypeError,
        },
      )
    })

    test(`invalid mgf1HashAlgorithm for PS${length}`, async (t) => {
      const { privateKey, publicKey } = await generateKeyPair('rsa-pss', {
        modulusLength: 2048,
        hashAlgorithm: `sha${length}`,
        hash: `sha${length}`,
        mgf1HashAlgorithm: 'sha1',
        mgf1Hash: 'sha1',
        saltLength: length >> 3,
      })
      await t.throwsAsync(
        new FlattenedSign(new Uint8Array(0))
          .setProtectedHeader({ alg: `PS${length}` })
          .sign(privateKey),
        {
          message: `Invalid key for this operation, its RSA-PSS parameters do not meet the requirements of "alg" PS${length}`,
          instanceOf: TypeError,
        },
      )
      await t.throwsAsync(
        flattenedVerify({ header: { alg: `PS${length}` }, payload: '', signature: '' }, publicKey),
        {
          message: `Invalid key for this operation, its RSA-PSS parameters do not meet the requirements of "alg" PS${length}`,
          instanceOf: TypeError,
        },
      )
    })
  }
} else if (!electron) {
  test('does not support rsa-pss', async (t) => {
    const { privateKey, publicKey } = await generateKeyPair('rsa-pss', { modulusLength: 2048 })
    await t.throwsAsync(
      new FlattenedSign(new Uint8Array(0)).setProtectedHeader({ alg: 'PS256' }).sign(privateKey),
      {
        message: 'Invalid key for this operation, its asymmetricKeyType must be rsa',
        instanceOf: TypeError,
      },
    )
    await t.throwsAsync(
      flattenedVerify({ header: { alg: 'PS256' }, payload: '', signature: '' }, publicKey),
      {
        message: 'Invalid key for this operation, its asymmetricKeyType must be rsa',
        instanceOf: TypeError,
      },
    )
  })
}
