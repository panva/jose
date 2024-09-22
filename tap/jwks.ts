import type QUnit from 'qunit'
import type * as jose from '../src/index.js'

export default (QUnit: QUnit, lib: typeof jose) => {
  const { module, test } = QUnit
  module('jwks.ts')

  const jwksUri = 'https://www.googleapis.com/oauth2/v3/certs'

  test('[createRemoteJWKSet] fetches the JWKSet', async (t: typeof QUnit.assert) => {
    const response = await fetch(jwksUri).then((r) => r.json())
    const { alg, kid } = response.keys[0]

    const jwks = lib.createRemoteJWKSet(new URL(jwksUri))
    t.false(jwks.coolingDown)
    t.false(jwks.fresh)
    t.equal(jwks.jwks(), undefined)

    await t.rejects(jwks({ alg: 'RS256' }), 'multiple matching keys found in the JSON Web Key Set')
    await t.rejects(
      jwks({ kid: 'foo', alg: 'RS256' }),
      'no applicable key found in the JSON Web Key Set',
    )
    t.ok(await Promise.all([jwks({ alg, kid }), jwks({ alg, kid })]))

    t.true(jwks.coolingDown)
    t.true(jwks.fresh)
    t.ok(jwks.jwks())
  })

  test('[createLocalJWKSet] establishes local JWKSet', async (t: typeof QUnit.assert) => {
    const keys = [
      {
        e: 'AQAB',
        n: 'wAR7gpvDJx2cUR15R1gyBYxEXanhOIDzk7evzadBpNCEpf6HA6utqMrf8dZ3EXSslKPSPBD5Qrz63kc2u8y7NqzwJQIi_i5xR6AxAyWLG3_kOHBwxnct6talLCZqgr8pDwnyP1BPnIaNf2hZxgS-UZbHCAVycd1n2qCdyb4FzFhcaNtiOLg5VSfgvtOdhHQlDXW-DBvwatpd9HzzTP6l5MZRyQ-N_AoGbIfhNCZRUfnb-A8IBPSqXBWN4TEpt-0yHAOIhWnSpu66AYE4f1efZdHVFCTQZ13e5bS-5RQra4pfmGqU9hog1j1SpHnDTia-s__qGi43rev2MqzY-qeUlw',
        d: 'buWn14TSLtMhJo_ZLWU4bo_WJCoq0xFWm-eodyOz-9YZ5iycGXibcTLKJ8fvOHuj-KysjNhYvTybvqhuagQR08AJabZUM2zrK6zO4bxbHOS-EAKQf27xbAHPnzIIrb5tnivmZr6hXAsxyXWg84ZlzIVCKdXLhQuUIWZF-u_uNVeJSUTDMRVTL2J0mzAGTXqi-yHejapEeLS7lFXDe6cpDnBVXauJfB4GmSUOjxtdAEVW7uGNQJGarGwRz6l3Tpy_xQiYl8e_IrU1N6qAN_HJEBrdgfK7js93RcsxHGbtdnj1ylevZqGFpB1UXrWE4JSz3sJgyXrmKNFFWOCjalMccQ',
        p: '98OCXxur1omXdjfWkDubqkI3xRehVQryIhqt0go-1yLS4Nwa7KyrdAbzTo81bCHN0A-NlmIvHA4YZc8QUHftq65s4nCbb3g_CwTfGCJEVCvoaTO2EE6Pd8VrGu2PVsN4SM52Gc0TNJGS54yUhyCWDTi1onUBEg8gnqpMSoWuaVM',
        q: 'xmaRdSJf4wN5Vse5jiIjZy5jy9veHHhzXxTmW25epr9KTMERUDDCzX0bNbnF8jCvDFN5ebzcEe-9nkWyzJ17wVcJTouEfw8A5pBPcx6Gr8Kd8WIrUjuom4xu-4619kMItoV4j62_nq3p0QUGot_6CgUdq63PCp9Fh-sHv8wViy0',
        dp: '0OCXwbzfYu_-rCCpGFHYi3Jl-BhS4BJpTc02K3SNw-vM4ttNK6jqptfRObLMNAxPqg_iqxy9YKaVdQdbVqu0yF811rVepVw3sf96YatJ9bhKqJ566EaC91ONV1dd16TVfHPq5xeYEGKF-gXvlfgn6J-dqYeAzovIUVt7E_ydrJc',
        dq: 'sYDOnqe0dhyDkNp77ugoGIZujtMVcw9o2SaPujmSwUjfprANV1tozgQiNf0RVk-sLTD5u6r2ka2WTmY5Q8uaDy5Zi0ZTsoGv4pg2HN6wzcsnF_EmpRnvDcuk97eEoOD0iKf9Zz6h88vRJ0qB13Lf99r_4rtMQ0qgIKxscHKcy7k',
        qi: '7uvpgL15VFjd_zjhU0fPVeTzAa6Vg3P3Q2v5DLwLkAIlQDqF50maTYztxtxssVNJtEMIxKefwrmGkyVCXNhrGHZDoj7wj-2o0k878bQqtltCO2TPm9TSYZgW7dR3ji0t4Msc5DcrQL002M_Vxqr9MAunQcAsnulRTepQM2n-aOc',
        kty: 'RSA',
        kid: 'ZuLUAgyr6RQV3ERjDukHzOO_90rVbrPiE1vD_HtPFuM',
      },
      {
        e: 'AQAB',
        n: '0PjQVV2ZAT27Y0h7hfAWWcnPetORCvR1_gHvEUxtlrlnhZia7utHl7BCJH9HP17YHMMBeeEkmUDflYoUL6MDl4DYHgVDq8jZfu1pxH1XqrpeswqOVoReknEe0F5kRt_mPtIoShI2Qv-pxGAw392akAXTirVRLL4Fn_0Oiifxp182P7eTPy41rlKDevLHuKHBZzzaes_33YE2epY2YCLp9k3mZ-tJEei2qiq0T1fERQicGUL8kppOnz0cDNuKRBHyYtXWhjhuDQ8OZQHNLfte9cqzTJMJ4Leu4MGjikSZMsk-_aRFnXtYHH0orwY-giSenRnwNaReAXaR1Px9ReljAQ',
        d: 'LXGufKH6IBb4pUKh-iKX-ba1dBSGOkenUTHCd5STUG_JX3gsWUC5NPeTqrQzHkjV3otZytN3TgyZkr-QXDurEEtotD6Y1Ma85aljkuNfKTWWWoE1KwNmPZp0BQRB8lfGjmrNcC49tpw6owX4GvbqId_ifQupN32rY3t4qfq9xpO9SAqZF0oUMoS7xE0zChsCJmNYpD9jx87p5Vud1naeaZPlvwWW0ITV4kp2zjYSbBh5DkI52rSrGjkuzlsJ_lKJk5YB557OHhN9XTRBnjqlwwWevh6QAoUivqpcelcplgmfxTHoII1opovYXn8AVt-DbGSO_7LLJ0Sw9sJR5GAqcQ',
        p: '9RdDqZ3O73lH6nWUGi0abQRRfgvj-HM0zP7GSDQ185l-ZByletl1VuJ86qYJTUY8Q3Gagv6_eXmQMo_14-0wT_FPUMiTMYsjw5QNgFgjlJTM1AayS_U5ddix_Ut7Kti7EXgM0gsavsIazv2-xwCrFzD4sa-t2FWELzzWxgt8wbs',
        q: '2kX8MN8ItGnn7NnPx-0iqe8kkhy5s9gJRiD3mxN9E6xzRCnf488yhc3aBwI9kZzQtV0XVjX5VhCws5vnJv9b7KA8NATDhpGNrqy2h9ncmsjTTjafUg3jb6QG08kIKDR-A97Mc-MJbIUNzYs10BAG4z9wk7t1bdo4gZJEvjiXVHM',
        dp: 'Ahggy-I9Um6G3soCafbYsvXGfH09hXH2kYnbx-IqU9qL6e8UuugAyK1Gw_qHOdHP0gO2fkgO-sq_IK96OmhccVJuixIrr9CwjYtGUkJui2Z6GZW1EFEYHJmta6ypcMRJVOzhrynJILgn4nzolGq9C4WvmlUV9zND3eN3MloGxuE',
        dq: 'uXKWlusX2TjVvM0-FO2r8tdkqeNP_7XAA15FIPOI5Cszb6loOIQ0t6wy3puPteSXClBCYJPQ-MeLab4-wUpaTovBOq0FdpK53ruNBZUbMkMIDL6p1CxKnPKufkeh747RtfYYnSk7O4E8PfNV0CWdxHuE6W9ukNvEAIpGb5tjL3M',
        qi: '3BLQ03cHEmO8nUT7U8M_H_JciEWAH8XWh_9nihIhXzLKYbNmWM16Ah0F9DUg0GPeiG7e_08ZJ4X3oK1bHnnXdns6NSOEoULWfHl5LUY5PoFPYaBDy3f6td2SCTE83p1YzegXKysWEk1snA2ROq4UEfz1vL8v64RtwR3SvNrAyOI',
        kty: 'RSA',
        alg: 'RS256',
        kid: 'hJU8GvYjtifxLVuBDSNmhLBF19wQHaZvQhfpT3wKzpE',
      },
      {
        crv: 'P-256',
        x: 'fqCXPnWs3sSfwztvwYU9SthmRdoT4WCXxS8eD8icF6U',
        y: 'nP6GIc42c61hoKqPcZqkvzhzIJkBV3Jw3g8sGG7UeP8',
        d: 'XikZvoy8ayRpOnuz7ont2DkgMxp_kmmg1EKcuIJWX_E',
        kty: 'EC',
        kid: 'a-5xuiQoRqlLBtec9jRpXoGTVOP10SGnj2Und0CHHxw',
      },
    ]
    const jwks = {
      keys: [
        {
          e: 'AQAB',
          n: 'wAR7gpvDJx2cUR15R1gyBYxEXanhOIDzk7evzadBpNCEpf6HA6utqMrf8dZ3EXSslKPSPBD5Qrz63kc2u8y7NqzwJQIi_i5xR6AxAyWLG3_kOHBwxnct6talLCZqgr8pDwnyP1BPnIaNf2hZxgS-UZbHCAVycd1n2qCdyb4FzFhcaNtiOLg5VSfgvtOdhHQlDXW-DBvwatpd9HzzTP6l5MZRyQ-N_AoGbIfhNCZRUfnb-A8IBPSqXBWN4TEpt-0yHAOIhWnSpu66AYE4f1efZdHVFCTQZ13e5bS-5RQra4pfmGqU9hog1j1SpHnDTia-s__qGi43rev2MqzY-qeUlw',
          kty: 'RSA',
          kid: 'ZuLUAgyr6RQV3ERjDukHzOO_90rVbrPiE1vD_HtPFuM',
        },
        {
          e: 'AQAB',
          n: '0PjQVV2ZAT27Y0h7hfAWWcnPetORCvR1_gHvEUxtlrlnhZia7utHl7BCJH9HP17YHMMBeeEkmUDflYoUL6MDl4DYHgVDq8jZfu1pxH1XqrpeswqOVoReknEe0F5kRt_mPtIoShI2Qv-pxGAw392akAXTirVRLL4Fn_0Oiifxp182P7eTPy41rlKDevLHuKHBZzzaes_33YE2epY2YCLp9k3mZ-tJEei2qiq0T1fERQicGUL8kppOnz0cDNuKRBHyYtXWhjhuDQ8OZQHNLfte9cqzTJMJ4Leu4MGjikSZMsk-_aRFnXtYHH0orwY-giSenRnwNaReAXaR1Px9ReljAQ',
          alg: 'RS256',
          kty: 'RSA',
          kid: 'hJU8GvYjtifxLVuBDSNmhLBF19wQHaZvQhfpT3wKzpE',
        },
        {
          crv: 'P-256',
          x: 'fqCXPnWs3sSfwztvwYU9SthmRdoT4WCXxS8eD8icF6U',
          y: 'nP6GIc42c61hoKqPcZqkvzhzIJkBV3Jw3g8sGG7UeP8',
          kty: 'EC',
          kid: 'a-5xuiQoRqlLBtec9jRpXoGTVOP10SGnj2Und0CHHxw',
        },
        {
          e: 'AQAB',
          n: '0PjQVV2ZAT27Y0h7hfAWWcnPetORCvR1_gHvEUxtlrlnhZia7utHl7BCJH9HP17YHMMBeeEkmUDflYoUL6MDl4DYHgVDq8jZfu1pxH1XqrpeswqOVoReknEe0F5kRt_mPtIoShI2Qv-pxGAw392akAXTirVRLL4Fn_0Oiifxp182P7eTPy41rlKDevLHuKHBZzzaes_33YE2epY2YCLp9k3mZ-tJEei2qiq0T1fERQicGUL8kppOnz0cDNuKRBHyYtXWhjhuDQ8OZQHNLfte9cqzTJMJ4Leu4MGjikSZMsk-_aRFnXtYHH0orwY-giSenRnwNaReAXaR1Px9ReljAQ',
          alg: 'RS256',
          kty: 'RSA',
          use: 'enc',
        },
        {
          e: 'AQAB',
          n: '0PjQVV2ZAT27Y0h7hfAWWcnPetORCvR1_gHvEUxtlrlnhZia7utHl7BCJH9HP17YHMMBeeEkmUDflYoUL6MDl4DYHgVDq8jZfu1pxH1XqrpeswqOVoReknEe0F5kRt_mPtIoShI2Qv-pxGAw392akAXTirVRLL4Fn_0Oiifxp182P7eTPy41rlKDevLHuKHBZzzaes_33YE2epY2YCLp9k3mZ-tJEei2qiq0T1fERQicGUL8kppOnz0cDNuKRBHyYtXWhjhuDQ8OZQHNLfte9cqzTJMJ4Leu4MGjikSZMsk-_aRFnXtYHH0orwY-giSenRnwNaReAXaR1Px9ReljAQ',
          alg: 'RS256',
          kty: 'RSA',
          use: 'sig',
          key_ops: [],
        },
        {
          // this is not valid
          e: 'AQAB',
          kty: 'RSA',
        },
      ],
    }

    const JWKS = lib.createLocalJWKSet(jwks)
    // Signed JWT
    {
      const [jwk] = keys
      const key = await lib.importJWK({ ...jwk, alg: 'PS256' })
      const jwt = await new lib.SignJWT()
        .setProtectedHeader({ alg: 'PS256', kid: jwk.kid })
        .sign(key)
      const { key: resolvedKey } = await lib.jwtVerify(jwt, JWKS)
      t.ok(resolvedKey)
      t.equal((resolvedKey as jose.KeyLike).type, 'public')
    }
    // Compact JWS
    {
      const [jwk] = keys
      const key = await lib.importJWK({ ...jwk, alg: 'PS256' })
      const jws = await new lib.CompactSign(new Uint8Array(1))
        .setProtectedHeader({ alg: 'PS256', kid: jwk.kid })
        .sign(key)
      const { key: resolvedKey } = await lib.compactVerify(jws, JWKS)
      t.ok(resolvedKey)
      t.equal((resolvedKey as jose.KeyLike).type, 'public')
    }
    // Flattened JWS
    {
      const [jwk] = keys
      const key = await lib.importJWK({ ...jwk, alg: 'PS256' })
      const jws = await new lib.FlattenedSign(new Uint8Array(1))
        .setProtectedHeader({ alg: 'PS256' })
        .setUnprotectedHeader({ kid: jwk.kid })
        .sign(key)
      const { key: resolvedKey } = await lib.flattenedVerify(jws, JWKS)
      t.ok(resolvedKey)
      t.equal((resolvedKey as jose.KeyLike).type, 'public')
    }
    // General JWS
    {
      const [jwk] = keys
      const key = await lib.importJWK({ ...jwk, alg: 'PS256' })
      const jws = await new lib.GeneralSign(new Uint8Array(1))
        .addSignature(key)
        .setProtectedHeader({ alg: 'PS256' })
        .setUnprotectedHeader({ kid: jwk.kid })
        .sign()
      const { key: resolvedKey } = await lib.generalVerify(jws, JWKS)
      t.ok(resolvedKey)
      t.equal((resolvedKey as jose.KeyLike).type, 'public')
    }
    {
      await t.rejects(
        JWKS({ alg: 'RS256' }),
        'multiple matching keys found in the JSON Web Key Set',
      )

      // async iterator (KeyLike)
      let error = (await JWKS({ alg: 'RS256' }).catch(
        (err) => err,
      )) as jose.errors.JWKSMultipleMatchingKeys
      {
        const cache = new WeakSet()
        for await (const ko of error) {
          t.equal(ko.type, 'public')
          cache.add(ko)
        }
        error = (await JWKS({ alg: 'RS256' }).catch(
          (err) => err,
        )) as jose.errors.JWKSMultipleMatchingKeys
        let i = 0
        for await (const ko of error) {
          i++
          t.true(cache.has(ko))
        }
        t.equal(i, 2)
      }
    }
    {
      const [, { kid }] = keys
      await t.rejects(
        JWKS({ alg: 'PS256', kid }),
        'no applicable key found in the JSON Web Key Set',
      )
    }
    {
      await JWKS({ alg: 'ES256' })
    }
  })
}
