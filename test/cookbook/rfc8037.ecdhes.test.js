const test = require('ava')

const { improvedDH } = require('../../lib/help/runtime_support')

if (!improvedDH) return

const { JWK: { asKey } } = require('../..')
const computeSecret = require('../../lib/jwa/ecdh/compute_secret')

test('RFC8037 - A.6. ECDH-ES with X25519', t => {
  const pub = asKey({
    kty: 'OKP',
    crv: 'X25519',
    x: '3p7bfXt9wbTTW2HC7OQ1Nz-DQ8hbeGdNrfx-FG-IK08'
  })

  const ephemeral = asKey({
    kty: 'OKP',
    crv: 'X25519',
    x: 'hSDwCYkwp1R0i33ctD73Wg2_Og0mOBr066SpjqqbTmo',
    d: 'dwdtCnMYpX08FsFyUbJmRd9ML4frwJkqsXf7pR25LCo'
  })

  t.deepEqual(computeSecret(ephemeral, pub), Buffer.from('4a5d9d5ba4ce2de1728e3bf480350f25e07e21c947d19e3376f09b3c1e161742', 'hex'))
})

test('RFC8037 - A.6. ECDH-ES with X448', t => {
  const pub = asKey({
    kty: 'OKP',
    crv: 'X448',
    x: 'PreoKbDNIPW8_AtZm2_sz22kYnEHvbDU80W0MCfYuXL8PjT7QjKhPKcG3LV67D2uB73BxnvzNgk'
  })

  const ephemeral = asKey({
    kty: 'OKP',
    crv: 'X448',
    x: 'mwj3zDG34-Z9ItWuoSEHSic70rg94Jxj-qc9LCLF2bvINmRyQdlT1AxbEtqIEg1TF3-A5TLEH6A',
    d: 'mo9JJdFRn1d1z0awS1gA1O6e6LrovFVl1JjCjdnJuvV0qUGXRIlzkQBjgqbxJ6sdmsLYwKWYcms'
  })

  t.deepEqual(computeSecret(ephemeral, pub), Buffer.from('07fff4181ac6cc95ec1c16a94a0f74d12da232ce40a77552281d282bb60c0b56fd2464c335543936521c24403085d59a449a5037514a879d', 'hex'))
})
