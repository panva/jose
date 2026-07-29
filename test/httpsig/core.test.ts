import test from 'ava'

import * as httpsig from '../../src/httpsig.js'
import { exportJWK, generateKeyPair, generateSecret } from '../../src/index.js'

const data = new TextEncoder().encode(
  '"@method": POST\n' +
    '"@authority": example.com\n' +
    '"@signature-params": ("@method" "@authority");created=1618884473;keyid="test-key"',
)

test('verify resolves false and does not throw for invalid signatures', async (t) => {
  const { privateKey, publicKey } = await generateKeyPair('ES256')
  const signature = await httpsig.sign('ecdsa-p256-sha256', privateKey, data)

  const flipped = new Uint8Array(signature)
  flipped[0] ^= 0x01
  t.false(await httpsig.verify('ecdsa-p256-sha256', publicKey, flipped, data))

  const tampered = new Uint8Array(data)
  tampered[0] ^= 0x01
  t.false(await httpsig.verify('ecdsa-p256-sha256', publicKey, signature, tampered))

  t.false(await httpsig.verify('ecdsa-p256-sha256', publicKey, signature.slice(0, 63), data))

  const long = new Uint8Array(65)
  long.set(signature.slice(0, 64))
  t.false(await httpsig.verify('ecdsa-p256-sha256', publicKey, long, data))

  t.false(await httpsig.verify('ecdsa-p256-sha256', publicKey, new Uint8Array(0), data))

  const other = await generateKeyPair('ES256')
  t.false(await httpsig.verify('ecdsa-p256-sha256', other.publicKey, signature, data))
})

test('a non-ASCII signature base is rejected', async (t) => {
  const { privateKey, publicKey } = await generateKeyPair('Ed25519')

  // RFC 9421 Section 2.5 requires the signature base to be an ASCII string.
  for (const base of [
    new TextEncoder().encode('"x": \u00e9'),
    Uint8Array.of(0x80), // the first non-ASCII byte
    Uint8Array.of(0xff),
    Uint8Array.of(0x22, 0x78, 0x22, 0x80),
  ]) {
    await t.throwsAsync(httpsig.sign('ed25519', privateKey, base), {
      instanceOf: TypeError,
      message: 'data must only contain ASCII characters',
    })
    await t.throwsAsync(httpsig.verify('ed25519', publicKey, new Uint8Array(64), base), {
      instanceOf: TypeError,
      message: 'data must only contain ASCII characters',
    })
  }

  // The whole ASCII range is accepted, including control characters and 0x7f.
  const ascii = Uint8Array.from({ length: 128 }, (_, i) => i)
  const signature = await httpsig.sign('ed25519', privateKey, ascii)
  t.true(await httpsig.verify('ed25519', publicKey, signature, ascii))
})

test('an empty signature base is supported', async (t) => {
  const { privateKey, publicKey } = await generateKeyPair('Ed25519')

  const empty = new Uint8Array(0)
  const signature = await httpsig.sign('ed25519', privateKey, empty)
  t.true(await httpsig.verify('ed25519', publicKey, signature, empty))
})

test('alg must be a string', async (t) => {
  const secret = await generateSecret('HS256')
  for (const alg of [undefined, null, 1, Symbol('x'), {}]) {
    await t.throwsAsync(httpsig.sign(alg as any, secret, data), {
      instanceOf: TypeError,
      message: 'alg must be a string',
    })
    await t.throwsAsync(httpsig.verify(alg as any, secret, new Uint8Array(32), data), {
      instanceOf: TypeError,
      message: 'alg must be a string',
    })
  }
})

test('unsupported algorithms are rejected', async (t) => {
  const secret = await generateSecret('HS256')
  // Support is decided by lib/signing.ts, which is what enforces RFC 9421 Section 3.3.7's
  // prohibition on "none" and on algorithms jose does not implement.
  for (const alg of ['none', 'ES256K', 'RS1', 'ED25519', 'Ed448', '', 'HS256 ', 'rsa-pss-sha256']) {
    await t.throwsAsync(httpsig.sign(alg, secret, data), {
      code: 'ERR_JOSE_NOT_SUPPORTED',
      message: `Unsupported HTTP Message Signature algorithm: ${alg}`,
    })
  }
})

test('the lookup table does not inherit Object.prototype members', async (t) => {
  const secret = await generateSecret('HS256')
  for (const alg of ['toString', 'constructor', 'hasOwnProperty', '__proto__']) {
    await t.throwsAsync(httpsig.sign(alg, secret, data), { code: 'ERR_JOSE_NOT_SUPPORTED' })
  }
})

test('signature and data must be Uint8Array', async (t) => {
  const { privateKey, publicKey } = await generateKeyPair('Ed25519')
  const signature = await httpsig.sign('ed25519', privateKey, data)

  for (const bad of [undefined, null, 'string', 42, signature.buffer, [...signature]]) {
    await t.throwsAsync(httpsig.verify('ed25519', publicKey, bad as any, data), {
      instanceOf: TypeError,
      message: 'signature must be an instance of Uint8Array',
    })
  }

  for (const bad of [undefined, null, 'string', 42, data.buffer, [...data], {}]) {
    await t.throwsAsync(httpsig.sign('ed25519', privateKey, bad as any), {
      instanceOf: TypeError,
      message: 'data must be an instance of Uint8Array',
    })
    await t.throwsAsync(httpsig.verify('ed25519', publicKey, signature, bad as any), {
      instanceOf: TypeError,
      message: 'data must be an instance of Uint8Array',
    })
  }
})

test('the key must be a CryptoKey', async (t) => {
  const { privateKey } = await generateKeyPair('ES256', { extractable: true })
  const signature = await httpsig.sign('ecdsa-p256-sha256', privateKey, data)

  for (const [bad, received] of [
    [await exportJWK(privateKey), 'Received an instance of Object'],
    [new Uint8Array(32), 'Received an instance of Uint8Array'],
    [undefined, 'Received undefined'],
    [null, 'Received null'],
    [{}, 'Received an instance of Object'],
  ] as [unknown, string][]) {
    const message = `Key must be of type CryptoKey. ${received}`
    await t.throwsAsync(httpsig.sign('ecdsa-p256-sha256', bad as any, data), {
      instanceOf: TypeError,
      message,
    })
    await t.throwsAsync(httpsig.verify('ecdsa-p256-sha256', bad as any, signature, data), {
      instanceOf: TypeError,
      message,
    })
  }

  // Primitives carry no "Received" clause.
  await t.throwsAsync(httpsig.sign('ecdsa-p256-sha256', 1 as any, data), {
    instanceOf: TypeError,
    message: 'Key must be of type CryptoKey.',
  })
})

test('the RSA modulus length restriction is enforced', async (t) => {
  const { privateKey } = await crypto.subtle.generateKey(
    {
      name: 'RSA-PSS',
      modulusLength: 1024,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-512',
    },
    false,
    ['sign', 'verify'],
  )

  await t.throwsAsync(httpsig.sign('rsa-pss-sha512', privateKey, data), {
    instanceOf: TypeError,
    message: 'PS512 requires key modulusLength to be 2048 bits or larger',
  })
})

test('key usages and the key algorithm are enforced', async (t) => {
  const { privateKey, publicKey } = await generateKeyPair('ES256')

  // A CryptoKey carries its own usages, so the private/public distinction is enforced through them
  // rather than through the key type.
  await t.throwsAsync(httpsig.sign('ecdsa-p256-sha256', publicKey, data), {
    instanceOf: TypeError,
    message: 'CryptoKey does not support this operation, its usages must include sign.',
  })

  const signature = await httpsig.sign('ecdsa-p256-sha256', privateKey, data)
  await t.throwsAsync(httpsig.verify('ecdsa-p256-sha256', privateKey, signature, data), {
    instanceOf: TypeError,
    message: 'CryptoKey does not support this operation, its usages must include verify.',
  })

  // The key's own algorithm must match the one requested, which is what stops an ECDSA key being
  // used under an HMAC identifier.
  await t.throwsAsync(httpsig.sign('hmac-sha256', privateKey, data), {
    instanceOf: TypeError,
    message: 'CryptoKey does not support this operation, its algorithm.name must be HMAC',
  })

  const { privateKey: rsa } = await generateKeyPair('PS256')
  await t.throwsAsync(httpsig.sign('rsa-pss-sha512', rsa, data), {
    instanceOf: TypeError,
    message: 'CryptoKey does not support this operation, its algorithm.hash must be SHA-512',
  })
})

test('a key on the wrong curve for the algorithm throws rather than resolving false', async (t) => {
  const { privateKey, publicKey } = await generateKeyPair('ES256')
  const signature = await httpsig.sign('ecdsa-p256-sha256', privateKey, data)

  // The key is unusable for the algorithm, which is a caller error, not a bad signature.
  await t.throwsAsync(httpsig.verify('ecdsa-p384-sha384', publicKey, signature, data), {
    instanceOf: TypeError,
    message: 'CryptoKey does not support this operation, its algorithm.namedCurve must be P-384',
  })
  await t.throwsAsync(httpsig.sign('ecdsa-p384-sha384', privateKey, data), {
    instanceOf: TypeError,
    message: 'CryptoKey does not support this operation, its algorithm.namedCurve must be P-384',
  })
})

test('a usable key with a wrong-length signature resolves false', async (t) => {
  const { privateKey } = await generateKeyPair('ES256')
  const { publicKey } = await generateKeyPair('ES384')
  // A 64 octet P-256 signature presented to a P-384 verifier that is otherwise correctly configured.
  const signature = await httpsig.sign('ecdsa-p256-sha256', privateKey, data)

  t.false(await httpsig.verify('ecdsa-p384-sha384', publicKey, signature, data))
})
