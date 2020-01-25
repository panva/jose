const test = require('ava')

const derive = require('../../lib/jwa/ecdh/derive')
const JWK = require('../../lib/jwk')
const base64url = require('../../lib/help/base64url')

test('https://tools.ietf.org/html/rfc7518#appendix-C', t => {
  const alice = JWK.asKey({
    kty: 'EC',
    crv: 'P-256',
    x: 'gI0GAILBdu7T53akrFmMyGcsF3n5dO7MmwNBHKW5SV0',
    y: 'SLW_xSffzlPWrHEVI30DHM_4egVwt3NQqeUD7nMFpps',
    d: '0_NxaRPUMQoAJt50Gz8YiTr8gRTwyEaCumd-MToTmIo'
  })

  const bob = JWK.asKey({
    kty: 'EC',
    crv: 'P-256',
    x: 'weNJy2HscCSM6AEDTDg04biOvhFhyyWvOHQfeF_PxMQ',
    y: 'e8lnCO-AlStT-NJVX-crhB7QRYhiix03illJOVAOyck',
    d: 'VEmDZpDXXK8p8N0Cndsxs924q6nS1RXFASRl6BfUqdw'
  })

  t.deepEqual(
    derive('A128GCM', 128, alice, bob, { apu: Buffer.from('Alice'), apv: Buffer.from('Bob') }),
    base64url.decodeToBuffer('VqqN6vgjbSBcIijNcacQGg')
  )

  t.deepEqual(
    derive('A128GCM', 128, bob, alice, { apu: Buffer.from('Alice'), apv: Buffer.from('Bob') }),
    base64url.decodeToBuffer('VqqN6vgjbSBcIijNcacQGg')
  )
})
