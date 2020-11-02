/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-bitwise */
/* eslint-disable no-param-reassign */

import test from 'ava';

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto';
Promise.all([
  import(`${root}/jws/flattened/sign`),
  import(`${root}/jws/flattened/verify`),
  import(`${root}/util/random`),
  import(`${root}/util/base64url`),
  import(`${root}/jwk/parse`),
  import(`${root}/util/generate_key_pair`),
  import(`${root}/util/generate_secret`),
]).then(
  ([
    { default: FlattenedSign },
    { default: verifyFlattened },
    { default: random },
    { encode: base64url },
    { default: parseJwk },
    { default: generateKeyPair },
    { default: generateSecret },
  ]) => {
    function pubjwk(jwk) {
      const { d, p, q, dp, dq, qi, ...publicJwk } = jwk;
      return publicJwk;
    }

    test.before(async (t) => {
      const p256 = {
        ext: false,
        crv: 'P-256',
        x: 'Sp3KpzPjwcCF04_W2GvSSf-vGDvp3Iv2kQYqAjnMB-Y',
        y: 'lZmecT2quXe0i9f7b4qHvDAFDpxs0oxCoJx4tOOqsks',
        d: 'hRVo5TGE_d_4tQC1KEQIlCdo9rteZmLSmaMPpFOjeDI',
        kty: 'EC',
      };
      const p384 = {
        ext: false,
        crv: 'P-384',
        x: 'H50cO3PJnVhAoF6_jPKpCl60cnvmoygN2u29jVN19x8C2PymixZS4Y5d1FfMMK3L',
        y: 'ATQ-4QWyYTtEaBW3CFQZEX0NdDE5g_9F24B0y2xxQgVmWa5Uz0QerlhzFoYU7Z_F',
        d: 'HDUcH8y8xr22EroPYBK3PvpNjA3pCJjvHpBXKejxOiQCoXhZ5PhX_nxb7lU0mlDE',
        kty: 'EC',
      };
      const p521 = {
        ext: false,
        crv: 'P-521',
        x:
          'AFy8VTdHeJx7rrUajpeqIjGZsjtx0tftQ7pdL1qkTRpnvY0WVVKXjib3HINNLMA72gA7JujbvEtGvkvoo0P7pGVK',
        y:
          'AfMRSFv9qfcH_XMHfPoltBMYLhDbS3Pw1GL7NO9SI_vF4JsiAta1Bq6teCl2z8klFtRCWXHfPqEF3cmXS8bDQVoT',
        d:
          'AL123tYK7y-iViaReLOHe7XxKNSeoUMk4RRmcP6nSVuZrYJHtyYPak4gUmWB6A_GzED3zXkrkcssZEzHrYQILw5c',
        kty: 'EC',
      };
      const secp256k1 = {
        ext: false,
        crv: 'secp256k1',
        x: 'Hr99bGFN0HWT3ZgNNAXvmz-6Wk1HIxwsyFqUZH8PBFc',
        y: 'bonc3DRZe51NzuWetY336VmTYdUFvPK7DivSPHeu_CA',
        d: 'jv_VrhPomm6_WOzb74xF4eMI0hu9p0W1Zlxi0nz8AFs',
        kty: 'EC',
      };
      const rsa = {
        ext: false,
        e: 'AQAB',
        n:
          'rPOe2kdmQY1wN2ADn-EIKsPO_kXotIqPjbZQOoW6sIHPGS8xJqrR60JLTBir5jG8Prrp4_KoEDGm3zYlWb5EJr9BMAVHAUYB2ZMXjdojpIkKeJ_cMI0lLcSUTkKkOA6u2DnVJBlnQgeyVZ927h65cJ5zsnSqG6MHh5tVPAwocEsfH27Tik_Fp-dCidmr_-rCrPfoAuASadvuFr5oAa7aAKdlLz6P0GgmCs2KzTAR6FiBMm48hd1YkrIaGzljKOwCgh0KYA3tnetbOCFEuzsmn9wmQHUA0iPQqYGlFJVfQ64949hQk42uWxCXtaO_wlXqy_TVki5LTQ7hO4reUiMXpQ',
        d:
          'qhn97b91khmS-dOkHPYNu0nUZv_JDPCOmhlqtPRcFkfFsYZZuCcfyVvthM1rHD9kXuolKf26UBsVfcnaWHaqvtUyPxGhsV3yadSiwPCAR85FDzhjLxlTLL2AA6zFqSC_1Iik2hlmFmpNeqsZJL_xMROWxTi7Ke1hdX1QCnwGtdF-Emdqgf1wqBWv6VTQVd2qslQySQN8RLTYmlkHBmOHU1jc0e2QP5xbLD4-pPr7RW17WbOkW2aLsC0YYebqFaqVgLNZJIVDKetRCCgi1RcdieQ0zSuUfRc9wzhZW7HHCECASqjeFqHopG05ge-DwAcc62-H7EbKr0XWz-7SLqjTrQ',
        p:
          '3wSG2cBBbo6FZ0GiRucHhJhSx1U6ZRhwhrbJmSpiFG5rvHvZn-DWnOmurvO5jc1V2Qj4QAEO4w7YQh3A9PFBry_42Od5zof1GIeAOVT3REiMTOSCxMVEMWQ74UBUM2T2R_TDrBgVSuaRmX14mcZM6_SYu7JLpqeSDzZEy2cqOBs',
        q:
          'xoeWkL7oZ488PsJ6_lkjCmrlxouKJgHqMHI_RVE-MGSYHDNrJ_iS4wp8CK4xhAdGukqxDm5ChqFECgdg5QfdLoCseAIC-aHrrylYrmka5_8ke-ObpW9iGFcZy-5cEH5NCr6iSb-KS6fZkxJl7g3Az6XmLoEHHmyy8QxG9Yikaz8',
        dp:
          'DKUxED-6dg5Wuhgan3KSFo6cgvjuKrVMDBdpLuocTZRFP5a2LD6PbK5DXWAscUHnUDsV-GsW8QDyei09t6XGV6ycq4_UdEV5PD7Som2S56hFbEa4s3eL-lD4pDkFjTR4UnQqdCOZcXnJX66hm_aGfgqMbngZmgV-XqZxGCdtWWk',
        dq:
          'uX6ijefyWiCZF8K7DL_YX7l1q8dhcxXC7TUyLOA2DR1Qirj4XEaDaCO5tJqdpVDvIsz7FhKrkgNIAV7Xh-eLIBIWE6M9iGVkQyuMspl-DFp2ilMmcLLbowZvEf5KgxafgXSRSfrvirTwM9yy5HRxPRMzOSxRrHm_0D26Z1we1B0',
        qi:
          'htPHLViOVG6QrldfuHn9evfdlD-UEuViOWNx8aKR3IBv0qegpJ78vYB4hdAcJZtBslKI97En5rzOAN3Y6Y8MbI4oN77WeiePJl2cMrS64evmlERvjJ6ZTs8jK0iV5q_gIZ9Qg9drmolUgb_CccQOBFbqSL6YkXwCBxlkCrzTlhc',
        kty: 'RSA',
      };
      const ed25519 = {
        ext: false,
        crv: 'Ed25519',
        x: 'beguov5KuiEE0a9t_NaKRwnqLp0OIURn2BTYmdLMed4',
        d: 'Z1Q1Hgl8PfBvypfTzQOklI5r0y4ImPfWHP4OoIKm_kA',
        kty: 'OKP',
      };
      const ed448 = {
        ext: false,
        crv: 'Ed448',
        x: 'YecSEZalR2McQ2f0yU8mMwLXSzz7eHirRsv0o9lqGhCZMihCPjpLKJ9BHj3u2DTnLtcBXGYmJbYA',
        d: 'epoLrq-y89h6gjCEZl39VGKQKqqHlTgt0gp7mMM1bbZOPkToOOusOvxwayZlVU8pRtLbAIxcTK7n',
        kty: 'OKP',
      };
      t.context.keys = {
        rsa: {
          public: pubjwk(rsa),
          private: rsa,
          algs: ['RS256', 'RS384', 'RS512', 'PS256', 'PS384', 'PS512'],
        },
        ed25519: {
          public: pubjwk(ed25519),
          private: ed25519,
          algs: ['EdDSA'],
          generate: { crv: 'Ed25519' },
        },
        ed448: {
          public: pubjwk(ed448),
          private: ed448,
          algs: ['EdDSA'],
          generate: { crv: 'Ed448' },
        },
        p256: {
          public: pubjwk(p256),
          private: p256,
          algs: ['ES256'],
        },
        secp256k1: {
          public: pubjwk(secp256k1),
          private: secp256k1,
          algs: ['ES256K'],
        },
        p384: {
          public: pubjwk(p384),
          private: p384,
          algs: ['ES384'],
        },
        p521: {
          public: pubjwk(p521),
          private: p521,
          algs: ['ES512'],
        },
        oct256: {
          secret: { ext: false, kty: 'oct', k: base64url(random(new Uint8Array(256 >> 3))) },
          algs: ['HS256'],
        },
        oct384: {
          secret: { ext: false, kty: 'oct', k: base64url(random(new Uint8Array(384 >> 3))) },
          algs: ['HS256', 'HS384'],
        },
        oct512: {
          secret: { ext: false, kty: 'oct', k: base64url(random(new Uint8Array(512 >> 3))) },
          algs: ['HS256', 'HS384', 'HS512'],
        },
      };
    });

    async function smoke(t, ref, octAsKeyObject = false) {
      const fixtures = t.context.keys[ref];
      await Promise.all([
        ...fixtures.algs.map(async (alg) => {
          let priv;
          let pub;
          if ('secret' in fixtures) {
            const secret = await parseJwk(fixtures.secret, alg, octAsKeyObject);
            if (octAsKeyObject) {
              t.false(secret instanceof Uint8Array);
            } else {
              t.true(secret instanceof Uint8Array);
            }
            pub = secret;
            priv = secret;
          } else {
            [pub, priv] = await Promise.all([
              parseJwk(fixtures.public, alg),
              parseJwk(fixtures.private, alg),
            ]);
          }

          const jws = await new FlattenedSign(random(new Uint8Array(256 >> 3)))
            .setProtectedHeader({ alg })
            .sign(priv);
          await verifyFlattened(jws, pub);
        }),
        ...fixtures.algs.map(async (alg) => {
          let priv;
          let pub;
          if ('secret' in fixtures) {
            const secret = await generateSecret(alg);
            pub = secret;
            priv = secret;
          } else {
            ({ privateKey: priv, publicKey: pub } = await generateKeyPair(alg, fixtures.generate));
          }

          const jws = await new FlattenedSign(random(new Uint8Array(256 >> 3)))
            .setProtectedHeader({ alg })
            .sign(priv);
          await verifyFlattened(jws, pub);
        }),
      ]);
      t.pass();
    }
    smoke.title = (title, ref) => `${ref.toUpperCase()}${title ? ` ${title}` : ''}`;

    test(smoke, 'rsa');
    test(smoke, 'p256');
    test(smoke, 'p384');
    test(smoke, 'p521');
    test(smoke, 'oct256');
    test(smoke, 'oct384');
    test(smoke, 'oct512');
    test('as keyobject', smoke, 'oct256', true);
    test('as keyobject', smoke, 'oct384', true);
    test('as keyobject', smoke, 'oct512', true);

    let conditional;
    if ('WEBCRYPTO' in process.env) {
      conditional = test.failing;
    } else {
      conditional = test;
    }
    conditional(smoke, 'secp256k1');
    conditional(smoke, 'ed25519');
    conditional(smoke, 'ed448');
  },
  (err) => {
    test('failed to import', (t) => {
      console.error(err);
      t.fail();
    });
  },
);
