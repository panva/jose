/* eslint-disable no-param-reassign */
import test from 'ava';
import nock from 'nock';
import timekeeper from 'timekeeper';

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto';
Promise.all([
  import(`${root}/jwt/verify`),
  import(`${root}/jwt/sign`),
  import(`${root}/jwk/parse`),
  import(`${root}/jwks/remote`),
]).then(
  ([
    { default: jwtVerify },
    { default: SignJWT },
    { default: parseJwk },
    { default: createRemoteJWKSet },
  ]) => {
    const now = 1604416038;

    test.beforeEach(() => {
      timekeeper.freeze(now * 1000);
    });

    test.afterEach((t) => {
      t.true(nock.isDone());
      nock.cleanAll();
    });

    test.afterEach(timekeeper.reset);

    test.serial('RemoteJWKSet', async (t) => {
      const keys = [
        {
          e: 'AQAB',
          n:
            'wAR7gpvDJx2cUR15R1gyBYxEXanhOIDzk7evzadBpNCEpf6HA6utqMrf8dZ3EXSslKPSPBD5Qrz63kc2u8y7NqzwJQIi_i5xR6AxAyWLG3_kOHBwxnct6talLCZqgr8pDwnyP1BPnIaNf2hZxgS-UZbHCAVycd1n2qCdyb4FzFhcaNtiOLg5VSfgvtOdhHQlDXW-DBvwatpd9HzzTP6l5MZRyQ-N_AoGbIfhNCZRUfnb-A8IBPSqXBWN4TEpt-0yHAOIhWnSpu66AYE4f1efZdHVFCTQZ13e5bS-5RQra4pfmGqU9hog1j1SpHnDTia-s__qGi43rev2MqzY-qeUlw',
          d:
            'buWn14TSLtMhJo_ZLWU4bo_WJCoq0xFWm-eodyOz-9YZ5iycGXibcTLKJ8fvOHuj-KysjNhYvTybvqhuagQR08AJabZUM2zrK6zO4bxbHOS-EAKQf27xbAHPnzIIrb5tnivmZr6hXAsxyXWg84ZlzIVCKdXLhQuUIWZF-u_uNVeJSUTDMRVTL2J0mzAGTXqi-yHejapEeLS7lFXDe6cpDnBVXauJfB4GmSUOjxtdAEVW7uGNQJGarGwRz6l3Tpy_xQiYl8e_IrU1N6qAN_HJEBrdgfK7js93RcsxHGbtdnj1ylevZqGFpB1UXrWE4JSz3sJgyXrmKNFFWOCjalMccQ',
          p:
            '98OCXxur1omXdjfWkDubqkI3xRehVQryIhqt0go-1yLS4Nwa7KyrdAbzTo81bCHN0A-NlmIvHA4YZc8QUHftq65s4nCbb3g_CwTfGCJEVCvoaTO2EE6Pd8VrGu2PVsN4SM52Gc0TNJGS54yUhyCWDTi1onUBEg8gnqpMSoWuaVM',
          q:
            'xmaRdSJf4wN5Vse5jiIjZy5jy9veHHhzXxTmW25epr9KTMERUDDCzX0bNbnF8jCvDFN5ebzcEe-9nkWyzJ17wVcJTouEfw8A5pBPcx6Gr8Kd8WIrUjuom4xu-4619kMItoV4j62_nq3p0QUGot_6CgUdq63PCp9Fh-sHv8wViy0',
          dp:
            '0OCXwbzfYu_-rCCpGFHYi3Jl-BhS4BJpTc02K3SNw-vM4ttNK6jqptfRObLMNAxPqg_iqxy9YKaVdQdbVqu0yF811rVepVw3sf96YatJ9bhKqJ566EaC91ONV1dd16TVfHPq5xeYEGKF-gXvlfgn6J-dqYeAzovIUVt7E_ydrJc',
          dq:
            'sYDOnqe0dhyDkNp77ugoGIZujtMVcw9o2SaPujmSwUjfprANV1tozgQiNf0RVk-sLTD5u6r2ka2WTmY5Q8uaDy5Zi0ZTsoGv4pg2HN6wzcsnF_EmpRnvDcuk97eEoOD0iKf9Zz6h88vRJ0qB13Lf99r_4rtMQ0qgIKxscHKcy7k',
          qi:
            '7uvpgL15VFjd_zjhU0fPVeTzAa6Vg3P3Q2v5DLwLkAIlQDqF50maTYztxtxssVNJtEMIxKefwrmGkyVCXNhrGHZDoj7wj-2o0k878bQqtltCO2TPm9TSYZgW7dR3ji0t4Msc5DcrQL002M_Vxqr9MAunQcAsnulRTepQM2n-aOc',
          kty: 'RSA',
          kid: 'ZuLUAgyr6RQV3ERjDukHzOO_90rVbrPiE1vD_HtPFuM',
        },
        {
          e: 'AQAB',
          n:
            '0PjQVV2ZAT27Y0h7hfAWWcnPetORCvR1_gHvEUxtlrlnhZia7utHl7BCJH9HP17YHMMBeeEkmUDflYoUL6MDl4DYHgVDq8jZfu1pxH1XqrpeswqOVoReknEe0F5kRt_mPtIoShI2Qv-pxGAw392akAXTirVRLL4Fn_0Oiifxp182P7eTPy41rlKDevLHuKHBZzzaes_33YE2epY2YCLp9k3mZ-tJEei2qiq0T1fERQicGUL8kppOnz0cDNuKRBHyYtXWhjhuDQ8OZQHNLfte9cqzTJMJ4Leu4MGjikSZMsk-_aRFnXtYHH0orwY-giSenRnwNaReAXaR1Px9ReljAQ',
          d:
            'LXGufKH6IBb4pUKh-iKX-ba1dBSGOkenUTHCd5STUG_JX3gsWUC5NPeTqrQzHkjV3otZytN3TgyZkr-QXDurEEtotD6Y1Ma85aljkuNfKTWWWoE1KwNmPZp0BQRB8lfGjmrNcC49tpw6owX4GvbqId_ifQupN32rY3t4qfq9xpO9SAqZF0oUMoS7xE0zChsCJmNYpD9jx87p5Vud1naeaZPlvwWW0ITV4kp2zjYSbBh5DkI52rSrGjkuzlsJ_lKJk5YB557OHhN9XTRBnjqlwwWevh6QAoUivqpcelcplgmfxTHoII1opovYXn8AVt-DbGSO_7LLJ0Sw9sJR5GAqcQ',
          p:
            '9RdDqZ3O73lH6nWUGi0abQRRfgvj-HM0zP7GSDQ185l-ZByletl1VuJ86qYJTUY8Q3Gagv6_eXmQMo_14-0wT_FPUMiTMYsjw5QNgFgjlJTM1AayS_U5ddix_Ut7Kti7EXgM0gsavsIazv2-xwCrFzD4sa-t2FWELzzWxgt8wbs',
          q:
            '2kX8MN8ItGnn7NnPx-0iqe8kkhy5s9gJRiD3mxN9E6xzRCnf488yhc3aBwI9kZzQtV0XVjX5VhCws5vnJv9b7KA8NATDhpGNrqy2h9ncmsjTTjafUg3jb6QG08kIKDR-A97Mc-MJbIUNzYs10BAG4z9wk7t1bdo4gZJEvjiXVHM',
          dp:
            'Ahggy-I9Um6G3soCafbYsvXGfH09hXH2kYnbx-IqU9qL6e8UuugAyK1Gw_qHOdHP0gO2fkgO-sq_IK96OmhccVJuixIrr9CwjYtGUkJui2Z6GZW1EFEYHJmta6ypcMRJVOzhrynJILgn4nzolGq9C4WvmlUV9zND3eN3MloGxuE',
          dq:
            'uXKWlusX2TjVvM0-FO2r8tdkqeNP_7XAA15FIPOI5Cszb6loOIQ0t6wy3puPteSXClBCYJPQ-MeLab4-wUpaTovBOq0FdpK53ruNBZUbMkMIDL6p1CxKnPKufkeh747RtfYYnSk7O4E8PfNV0CWdxHuE6W9ukNvEAIpGb5tjL3M',
          qi:
            '3BLQ03cHEmO8nUT7U8M_H_JciEWAH8XWh_9nihIhXzLKYbNmWM16Ah0F9DUg0GPeiG7e_08ZJ4X3oK1bHnnXdns6NSOEoULWfHl5LUY5PoFPYaBDy3f6td2SCTE83p1YzegXKysWEk1snA2ROq4UEfz1vL8v64RtwR3SvNrAyOI',
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
      ];
      const jwks = {
        keys: [
          {
            e: 'AQAB',
            n:
              'wAR7gpvDJx2cUR15R1gyBYxEXanhOIDzk7evzadBpNCEpf6HA6utqMrf8dZ3EXSslKPSPBD5Qrz63kc2u8y7NqzwJQIi_i5xR6AxAyWLG3_kOHBwxnct6talLCZqgr8pDwnyP1BPnIaNf2hZxgS-UZbHCAVycd1n2qCdyb4FzFhcaNtiOLg5VSfgvtOdhHQlDXW-DBvwatpd9HzzTP6l5MZRyQ-N_AoGbIfhNCZRUfnb-A8IBPSqXBWN4TEpt-0yHAOIhWnSpu66AYE4f1efZdHVFCTQZ13e5bS-5RQra4pfmGqU9hog1j1SpHnDTia-s__qGi43rev2MqzY-qeUlw',
            kty: 'RSA',
            kid: 'ZuLUAgyr6RQV3ERjDukHzOO_90rVbrPiE1vD_HtPFuM',
          },
          {
            e: 'AQAB',
            n:
              '0PjQVV2ZAT27Y0h7hfAWWcnPetORCvR1_gHvEUxtlrlnhZia7utHl7BCJH9HP17YHMMBeeEkmUDflYoUL6MDl4DYHgVDq8jZfu1pxH1XqrpeswqOVoReknEe0F5kRt_mPtIoShI2Qv-pxGAw392akAXTirVRLL4Fn_0Oiifxp182P7eTPy41rlKDevLHuKHBZzzaes_33YE2epY2YCLp9k3mZ-tJEei2qiq0T1fERQicGUL8kppOnz0cDNuKRBHyYtXWhjhuDQ8OZQHNLfte9cqzTJMJ4Leu4MGjikSZMsk-_aRFnXtYHH0orwY-giSenRnwNaReAXaR1Px9ReljAQ',
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
            n:
              '0PjQVV2ZAT27Y0h7hfAWWcnPetORCvR1_gHvEUxtlrlnhZia7utHl7BCJH9HP17YHMMBeeEkmUDflYoUL6MDl4DYHgVDq8jZfu1pxH1XqrpeswqOVoReknEe0F5kRt_mPtIoShI2Qv-pxGAw392akAXTirVRLL4Fn_0Oiifxp182P7eTPy41rlKDevLHuKHBZzzaes_33YE2epY2YCLp9k3mZ-tJEei2qiq0T1fERQicGUL8kppOnz0cDNuKRBHyYtXWhjhuDQ8OZQHNLfte9cqzTJMJ4Leu4MGjikSZMsk-_aRFnXtYHH0orwY-giSenRnwNaReAXaR1Px9ReljAQ',
            alg: 'RS256',
            kty: 'RSA',
            use: 'enc',
          },
          {
            e: 'AQAB',
            n:
              '0PjQVV2ZAT27Y0h7hfAWWcnPetORCvR1_gHvEUxtlrlnhZia7utHl7BCJH9HP17YHMMBeeEkmUDflYoUL6MDl4DYHgVDq8jZfu1pxH1XqrpeswqOVoReknEe0F5kRt_mPtIoShI2Qv-pxGAw392akAXTirVRLL4Fn_0Oiifxp182P7eTPy41rlKDevLHuKHBZzzaes_33YE2epY2YCLp9k3mZ-tJEei2qiq0T1fERQicGUL8kppOnz0cDNuKRBHyYtXWhjhuDQ8OZQHNLfte9cqzTJMJ4Leu4MGjikSZMsk-_aRFnXtYHH0orwY-giSenRnwNaReAXaR1Px9ReljAQ',
            alg: 'RS256',
            kty: 'RSA',
            use: 'sig',
            key_ops: [],
          },
        ],
      };

      nock('https://as.example.com').get('/jwks').reply(200, jwks);
      const url = new URL('https://as.example.com/jwks');
      const JWKS = createRemoteJWKSet(url);
      {
        const [jwk] = keys;
        const key = await parseJwk({ ...jwk, alg: 'PS256' });
        const jwt = await new SignJWT({})
          .setProtectedHeader({ alg: 'PS256', kid: jwk.kid })
          .sign(key);
        await t.notThrowsAsync(jwtVerify(jwt, JWKS));
      }
      {
        const [jwk] = keys;
        const key = await parseJwk({ ...jwk, alg: 'RS256' });
        const jwt = await new SignJWT({}).setProtectedHeader({ alg: 'RS256' }).sign(key);
        await t.throwsAsync(jwtVerify(jwt, JWKS), {
          code: 'ERR_JWKS_MULTIPLE_MATCHING_KEYS',
          message: 'multiple matching keys found in the JSON Web Key Set',
        });
      }
      {
        const [, jwk] = keys;
        const key = await parseJwk({ ...jwk, alg: 'PS256' });
        const jwt = await new SignJWT({})
          .setProtectedHeader({ alg: 'PS256', kid: jwk.kid })
          .sign(key);
        await t.throwsAsync(jwtVerify(jwt, JWKS), {
          code: 'ERR_JWKS_NO_MATCHING_KEY',
          message: 'no applicable key found in the JSON Web Key Set',
        });
      }
      {
        const [, , jwk] = keys;
        const key = await parseJwk({ ...jwk, alg: 'ES256' });
        const jwt = await new SignJWT({}).setProtectedHeader({ alg: 'ES256' }).sign(key);
        await t.notThrowsAsync(jwtVerify(jwt, JWKS));
      }
    });

    test.serial('refreshes the JWKS once off cooldown', async (t) => {
      let jwk = {
        crv: 'P-256',
        x: 'fqCXPnWs3sSfwztvwYU9SthmRdoT4WCXxS8eD8icF6U',
        y: 'nP6GIc42c61hoKqPcZqkvzhzIJkBV3Jw3g8sGG7UeP8',
        d: 'XikZvoy8ayRpOnuz7ont2DkgMxp_kmmg1EKcuIJWX_E',
        kty: 'EC',
      };
      const jwks = {
        keys: [
          {
            crv: 'P-256',
            x: 'fqCXPnWs3sSfwztvwYU9SthmRdoT4WCXxS8eD8icF6U',
            y: 'nP6GIc42c61hoKqPcZqkvzhzIJkBV3Jw3g8sGG7UeP8',
            kty: 'EC',
            kid: 'one',
          },
        ],
      };

      const scope = nock('https://as.example.com').get('/jwks').once().reply(200, jwks);

      const url = new URL('https://as.example.com/jwks');
      const JWKS = createRemoteJWKSet(url);
      const key = await parseJwk({ ...jwk, alg: 'ES256' });
      {
        const jwt = await new SignJWT({})
          .setProtectedHeader({ alg: 'ES256', kid: 'one' })
          .sign(key);
        await t.notThrowsAsync(jwtVerify(jwt, JWKS));
        await t.notThrowsAsync(jwtVerify(jwt, JWKS));
      }
      {
        const jwt = await new SignJWT({})
          .setProtectedHeader({ alg: 'ES256', kid: 'two' })
          .sign(key);
        await t.throwsAsync(jwtVerify(jwt, JWKS), {
          code: 'ERR_JWKS_NO_MATCHING_KEY',
          message: 'no applicable key found in the JSON Web Key Set',
        });
        jwks.keys[0].kid = 'two';
        scope.get('/jwks').once().reply(200, jwks);
        timekeeper.travel((now + 30) * 1000);
        await t.notThrowsAsync(jwtVerify(jwt, JWKS));
      }
    });

    test.serial('throws on invalid JWKSet', async (t) => {
      const scope = nock('https://as.example.com').get('/jwks').once().reply(200, 'null');

      const url = new URL('https://as.example.com/jwks');
      const JWKS = createRemoteJWKSet(url);
      await t.throwsAsync(JWKS({ alg: 'RS256' }), {
        code: 'ERR_JWKS_INVALID',
        message: 'JSON Web Key Set malformed',
      });

      scope.get('/jwks').once().reply(200, {});
      await t.throwsAsync(JWKS({ alg: 'RS256' }), {
        code: 'ERR_JWKS_INVALID',
        message: 'JSON Web Key Set malformed',
      });

      scope.get('/jwks').once().reply(200, { keys: null });
      await t.throwsAsync(JWKS({ alg: 'RS256' }), {
        code: 'ERR_JWKS_INVALID',
        message: 'JSON Web Key Set malformed',
      });

      scope
        .get('/jwks')
        .once()
        .reply(200, { keys: [null] });
      await t.throwsAsync(JWKS({ alg: 'RS256' }), {
        code: 'ERR_JWKS_INVALID',
        message: 'JSON Web Key Set malformed',
      });

      scope.get('/jwks').once().reply(404);
      await t.throwsAsync(JWKS({ alg: 'RS256' }), {
        code: 'ERR_JOSE_GENERIC',
        message: 'Expected 200 OK from the JSON Web Key Set HTTP response',
      });

      scope.get('/jwks').once().reply(200, '{');
      await t.throwsAsync(JWKS({ alg: 'RS256' }), {
        code: 'ERR_JOSE_GENERIC',
        message: 'Failed to parse the JSON Web Key Set HTTP response as JSON',
      });
    });
  },
  (err) => {
    test.serial('failed to import', (t) => {
      console.error(err);
      t.fail();
    });
  },
);
