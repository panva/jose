import type QUnit from 'qunit'
import * as lib from '#dist/webapi'
import * as env from './env.js'

export default (QUnit: QUnit) => {
  const { module, test } = QUnit
  module('jwk.ts')

  const RSA = {
    kty: 'RSA',
    n: 'rcbWc-i_C8NtS4CpPcMF3QC025re_zzrhv-3ElzxAsMCCepwEqxCzQtsG7mAtROdGR1N_oNPNqr3jmEZdv5C5NtpPeX_gk4-r30_JLXcGNgVbZpmWVSmUI-nrU0cC3kjMS4RUPx7uDQxAUiVUq0k13qjEbEgcZAA3nEH2zuQWg3iWSmwYL0h1VxdINQ-WZZzBJsI_ONyBS5z3-vbyhtnMbgALRZSvNcYpODrH9AEIWNJhcaBVr1vKBdNT76KOl87ilLiKE1dOr72sLJDDsVqXDfxCjU_wdt2bF-YFcKwlYa5Aj2JF-UH7KLniC3P-2sS1zduLoAPAkyLcHgVdOifhQ',
    e: 'AQAB',
    d: 'gJwTJS-RDOyym9l558rJMRoPwCOrfG0ixwPEAuQkPu4COUJ3dWpl-gjFFvPATMNaVjb4_S9DVetMUeSNCyL8cRHtnrD03AR6ojhongu1-_EYUsidjOl4OVFIQJs78UXTBNfaWvyxt89woUmNseWQyaTqwPI9V67C5d3zeY5otCwv-Sb8n-WH3HD7tenz4RwrFZL9jZJWSwEJnBuqGBmKbXp-gzhF8Jy5525yoCCgYxbcCZnX8dewkVc8WFoMhrSFdPeW572RKMzFmqxoE52vLLi8GzcYx7GLrwuoUpu539T0dwVO1yusYJyodm40Lb40E42Zc98GsLTRN7Fbf-nylQ',
    p: '2ugdCItnOnjc5ZMjSyq0frngZxyaaWWchnTDxTokjaW93Bvzu1hc42J8M-Ux3qyoVrpkF82jZPV66dkM6LRcCq2qtHQHYyvghEr6_Tbn2ls3rJqBxEGgZ6GNa83zBIMFD7IE6SVvlVcY4EWRFza-syy2D8yi_s83ZQBUDAJFHf8',
    q: 'yzkLZo4r0BMnwuMjkDWUh6fb_9PG5kGdOs3gFDhcjfXJPBlq34G5g-VS_I7dP2YinmLJAOvnKaz47Kxf5A3lGvNF5ammxro0Wum9h1KAasPrQEsY0LMqzKqDLMJorfV5FUEd3whllZC8aXfKQIZLrmZMlUgkJQ3u5pTyWTv4yns',
    dp: 'Nh4wH06nZJNAuRjZHtod6T52tccifW_7dFolk_q90q7o8yON7AD6ZdSRNBszawNwUpCd8iyKeokdq_ZW9KiyIImyrA4LTX8pcEtBJZyPUTI_31ILRsOarkQIPGCb9b-WXrz57dGtdlQj-D36kqycFJu3HszOdwQvg67DGHzvLW0',
    dq: 'Rsvdo-Gdc8RokqUsa32u-79Hjg0J-ocbLjQwfvrPi4j3jN9R8wEvTrqiOWfPvdln8AN8AL0t77_ZjCHU2g7ZJJVhYUvD1PFjcdSB-VWNdSRBnUlMINB59YjlX79uVkPw5a2kqWE0enFMofVgWTAvx1bOESdrqBj9hAiZkOqqlmc',
    qi: 'ZZwU0mSvEF9ReylGTz5MmzqAKThqVwYo3D5VqKwDrg6wBuTo4Dg8X92NAxwn89kRFjPoOzTAn0vBx7SFW4GkPp4b3jXV_vWts0p_WBTTNw3Bw3P4CErdU44FKdog7yM06R3ZfNRFncxuad9SzV1zow8Ocvf-SjfdG9xMWG8-j7c',
  }

  const P256 = {
    crv: 'P-256',
    kty: 'EC',
    x: 'E8KpG0wpGUfRBYx8tUhd6tYaFaTZaIyHvAudXbSUFxQ',
    y: 'gcVDlKTo-UhZ-wHDNUdoQP0M9zevurU6A5WMR07B-wQ',
    d: 'm2lKgT3jxM3ouusu8sgjk2Ajqyf1L8KBLuRxQ3opSlY',
  }

  const P384 = {
    crv: 'P-384',
    kty: 'EC',
    x: 'HnBAtgpS-GJzTCdLBELPm1VIRoQwlk7luJIGEYWKhWtMHmOq14Hh7674Oxcc52mE',
    y: 'jXGek8Zapkjav7mO-KB-7vEWrqNxHSoXgNn1r6C0BiqS89SVciz6O8uriPdxoWem',
    d: 'Fr-aKdB1GdA98B80LTNftu04p9RILDBSNRQxQ1chl4DS9CSZcw39aEZoSUAbJa6r',
  }

  const P521 = {
    crv: 'P-521',
    kty: 'EC',
    x: 'AIwG869tNnEGIDg2hSyvXKIOk9rWPO_riIixGliBGBV0kB57QoTrjK-g5JCtazDTcBT23igX9gvAVkLvr2oFTQ9p',
    y: 'AeGZ0Z3JHM1rQWvmmpdfVu0zSNpmu0xPjGUE2hGhloRqF-JJV3aVMS72ZhGlbWi-O7OCcypIfndhpYgrc3qx0Y1w',
    d: 'AVIiopJk-cUIfQCJey-NvNbxiTB7haAB1AVvjp4r6wQ0ySw-RsKM03VbJNdWxcSsyHnk-mj-IP6wdWdeqUdto04T',
  }

  const secp256k1 = {
    kty: 'EC',
    crv: 'secp256k1',
    x: 'Z2jPhON0yh9F5N4DoUzvVX6tfNtDjmwdqpodR9pX-NI',
    y: 'grTNHdY88Mo6UbKA7-z4n6BgA9v3dZ-yewwbLEsXTYQ',
    d: 'B0ed4c2LWiG67o6MdYgYWeo_8gHYyRCQ3xWR0hYM41c',
  }

  const Ed25519 = {
    kty: 'OKP',
    crv: 'Ed25519',
    x: 'UX-2D7zxYLGioHoM-SUVpeFFNo9P7YikFGr2dh0S0R8',
    d: 'pjhYsOQ8x2N6d3rekqpTeD0yeXIZIkiIPX7Q3QjXjko',
  }

  const Ed448 = {
    kty: 'OKP',
    crv: 'X25519',
    x: 'IgTW3WUetorvpyWIMX0MK7zVkFebI6nOFQ5315TLKWs',
    d: '8GzXT_MJgUXdXnpM8V9Oh9szRPuZ1ghjZ9Qu1ds4N3g',
  }

  const X25519 = {
    kty: 'OKP',
    crv: 'Ed448',
    x: 'P4VT2Jk8ft0cgpC43mQX5OcaXE6VKXfkKMGA0qkeGhmPR2yr9Z7UYSzs5QiFREeFFzkbhyOgHDEA',
    d: 'k28CQuDvByCLBQ7aZvlzApTod9skzMtVVN39aHLYjCBJVK27MfAmVaJ4qxqN-AU3LKkT60jEGI7a',
  }

  const X448 = {
    kty: 'OKP',
    crv: 'X448',
    x: 'KErL1kZ1r8Onb6DbrfQSOP34o1h7AWYRNNGTnXmf_z4AMOQqwbIKFQztADNEcGLI27nz_r9618E',
    d: '2Kz7WV4t8Ffkup_f26i70BsMFZClN47GaXuueM-xkNraXtcRyqVrp0i1Uh5axz_KdbzLMZHgjew',
  }

  type Vector = [string, JsonWebKey, boolean | ((jwk: JsonWebKey) => boolean)]
  const algorithms: Vector[] = [
    ['ECDH-ES', P256, true],
    ['ECDH-ES', P384, true],
    ['ECDH-ES', P521, !env.isDeno],
    ['ECDH-ES', X25519, false],
    ['ECDH-ES', X448, false],
    ['EdDSA', Ed25519, env.isDeno || env.isWorkers],
    ['EdDSA', Ed448, false],
    ['ES256', P256, true],
    ['ES256K', secp256k1, false],
    ['ES384', P384, true],
    ['ES512', P521, !env.isDeno],
    ['PS256', RSA, true],
    ['PS384', RSA, true],
    ['PS512', RSA, true],
    ['RS256', RSA, true],
    ['RS384', RSA, true],
    ['RS512', RSA, true],
    ['RSA-OAEP-256', RSA, true],
    ['RSA-OAEP-384', RSA, true],
    ['RSA-OAEP-512', RSA, true],
    ['RSA-OAEP', RSA, true],
    ['RSA1_5', RSA, false],
  ]

  function publicJwk(jwk: JsonWebKey) {
    const { d, k, dp, dq, q, qi, ...result } = jwk
    return result
  }

  for (const vector of algorithms.slice()) {
    algorithms.push([vector[0], publicJwk(vector[1]), vector[2]])
  }

  function title(alg: string, jwk: JsonWebKey, works: boolean) {
    let result = ''
    if (!works) {
      result = '[not supported] '
    }
    result += `${alg} `
    if (alg === 'EdDSA' || alg === 'ECDH-ES') {
      result += `${jwk.crv} `
    }
    result += jwk.d ? 'Private' : 'Public'
    result += ' JWK Import'
    return result
  }

  for (const vector of algorithms) {
    const [alg, jwk] = vector
    let [, , works] = vector

    if (typeof works === 'function') {
      works = works(jwk)
    }

    const execute = async (t: typeof QUnit.assert) => {
      await lib.importJWK({ ...jwk, ext: true }, alg)
      t.ok(1)
    }

    if (works) {
      test(title(alg, jwk, works), execute)
    } else {
      test(title(alg, jwk, works), async (t) => {
        await t.rejects(execute(t))
      })
    }
  }
}
