/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-bitwise */
/* eslint-disable no-param-reassign */

import test from 'ava';

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto';
Promise.all([
  import(`${root}/jwe/flattened/encrypt`),
  import(`${root}/jwe/flattened/decrypt`),
  import(`${root}/util/random`),
  import(`${root}/util/base64url`),
  import(`${root}/jwk/parse`),
  import(`${root}/util/generate_key_pair`),
  import(`${root}/util/generate_secret`),
]).then(
  ([
    { default: FlattenedEncrypt },
    { default: decryptFlattened },
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

    const randomEnc = () => {
      const encs = [
        'A128GCM',
        'A192GCM',
        'A256GCM',
        'A128CBC-HS256',
        'A192CBC-HS384',
        'A256CBC-HS512',
      ];
      return encs[Math.floor(Math.random() * encs.length)];
    };

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
      const x25519 = {
        ext: false,
        crv: 'X25519',
        x: 'i0CfuN5lAHXdv-_OeozwEDIL0-TAC47Gx1iFb6Si6wc',
        d: 'UEmf0e90dkN0jc1VW2k9Ensb03r5wbuQfYs5xNrT7Xw',
        kty: 'OKP',
      };
      const x448 = {
        ext: false,
        crv: 'X448',
        x: 'FXL1VnZUBAAXhO7I2BrECCQGQmTzPzcsB3G-5VCgqOrBHDIWUqhg4hgisgF3EOuV87RjfjR43FE',
        d: 'YETRz89J2Di6UTLBE_qZtENzsb5YoBjl_Hh7sR69YkP0mDhnndkzEyIZuo6kbqPMtqlLDXKrSbI',
        kty: 'OKP',
      };
      t.context.keys = {
        rsa: {
          public: pubjwk(rsa),
          private: rsa,
          algs: ['RSA-OAEP', 'RSA-OAEP-256', 'RSA-OAEP-384', 'RSA-OAEP-512'],
        },
        rsa1_5: {
          public: pubjwk(rsa),
          private: rsa,
          algs: ['RSA1_5'],
        },
        x25519: {
          public: pubjwk(x25519),
          private: x25519,
          algs: ['ECDH-ES', 'ECDH-ES+A128KW', 'ECDH-ES+A192KW', 'ECDH-ES+A256KW'],
          generate: { crv: 'X25519' },
        },
        x448: {
          public: pubjwk(x448),
          private: x448,
          algs: ['ECDH-ES', 'ECDH-ES+A128KW', 'ECDH-ES+A192KW', 'ECDH-ES+A256KW'],
          generate: { crv: 'X448' },
        },
        p256: {
          public: pubjwk(p256),
          private: p256,
          algs: ['ECDH-ES', 'ECDH-ES+A128KW', 'ECDH-ES+A192KW', 'ECDH-ES+A256KW'],
          generate: { crv: 'P-256' },
        },
        p384: {
          public: pubjwk(p384),
          private: p384,
          algs: ['ECDH-ES', 'ECDH-ES+A128KW', 'ECDH-ES+A192KW', 'ECDH-ES+A256KW'],
          generate: { crv: 'P-384' },
        },
        p521: {
          public: pubjwk(p521),
          private: p521,
          algs: ['ECDH-ES', 'ECDH-ES+A128KW', 'ECDH-ES+A192KW', 'ECDH-ES+A256KW'],
          generate: { crv: 'P-521' },
        },
        octAny: {
          secret: { ext: false, kty: 'oct', k: base64url(random(new Uint8Array(160 >> 3))) },
          algs: ['PBES2-HS256+A128KW', 'PBES2-HS384+A192KW', 'PBES2-HS512+A256KW'],
          generate: false,
        },
        oct128: {
          secret: { ext: false, kty: 'oct', k: base64url(random(new Uint8Array(128 >> 3))) },
          algs: ['A128KW'],
        },
        oct192: {
          secret: { ext: false, kty: 'oct', k: base64url(random(new Uint8Array(192 >> 3))) },
          algs: ['A192KW'],
        },
        oct256: {
          secret: { ext: false, kty: 'oct', k: base64url(random(new Uint8Array(256 >> 3))) },
          algs: ['A256KW'],
        },
        oct128gcm: {
          secret: { ext: false, kty: 'oct', k: base64url(random(new Uint8Array(128 >> 3))) },
          algs: ['A128GCM', 'A128GCMKW'],
        },
        oct192gcm: {
          secret: { ext: false, kty: 'oct', k: base64url(random(new Uint8Array(192 >> 3))) },
          algs: ['A192GCM', 'A192GCMKW'],
        },
        oct256gcm: {
          secret: { ext: false, kty: 'oct', k: base64url(random(new Uint8Array(256 >> 3))) },
          algs: ['A256GCM', 'A256GCMKW'],
        },
        oct256c: {
          secret: { kty: 'oct', k: base64url(random(new Uint8Array(256 >> 3))) },
          algs: ['A128CBC-HS256'],
        },
        oct384c: {
          secret: { kty: 'oct', k: base64url(random(new Uint8Array(384 >> 3))) },
          algs: ['A192CBC-HS384'],
        },
        oct512c: {
          secret: { kty: 'oct', k: base64url(random(new Uint8Array(512 >> 3))) },
          algs: ['A256CBC-HS512'],
        },
      };
    });

    async function smoke(t, ref, publicKeyUsages, privateKeyUsage, octAsKeyObject = false) {
      const fixtures = t.context.keys[ref];
      await Promise.all([
        ...fixtures.algs.map(async (alg) => {
          let priv;
          let pub;
          if ('secret' in fixtures) {
            const key_ops =
              publicKeyUsages || privateKeyUsage
                ? [...new Set([...publicKeyUsages, ...privateKeyUsage])]
                : undefined;
            const secret = await parseJwk({ ...fixtures.secret, key_ops }, alg, octAsKeyObject);
            if (octAsKeyObject) {
              t.false(secret instanceof Uint8Array);
            } else {
              t.true(secret instanceof Uint8Array);
            }
            pub = secret;
            priv = secret;
          } else {
            [pub, priv] = await Promise.all([
              parseJwk({ ...fixtures.public, key_ops: publicKeyUsages }, alg),
              parseJwk({ ...fixtures.private, key_ops: privateKeyUsage }, alg),
            ]);
          }

          const jwe = await new FlattenedEncrypt(random(new Uint8Array(256 >> 3)))
            .setProtectedHeader({ 'urn:example:protected': true })
            .setUnprotectedHeader(
              alg.startsWith('A') && !alg.endsWith('KW')
                ? { enc: alg }
                : { enc: randomEnc(), 'urn:example:header': true },
            )
            .setSharedUnprotectedHeader(
              alg.startsWith('A') && !alg.endsWith('KW')
                ? { alg: 'dir' }
                : { alg, 'urn:example:unprotected': true },
            )
            .setAdditionalAuthenticatedData(random(new Uint8Array(128 >> 3)))
            .encrypt(pub);
          await decryptFlattened(jwe, priv);
        }),
        ...fixtures.algs.map(async (alg) => {
          let priv;
          let pub;
          if ('secret' in fixtures) {
            if (fixtures.generate === false) return;
            const secret = await generateSecret(alg);
            pub = secret;
            priv = secret;
          } else {
            ({ privateKey: priv, publicKey: pub } = await generateKeyPair(alg, fixtures.generate));
          }

          const jwe = await new FlattenedEncrypt(random(new Uint8Array(256 >> 3)))
            .setProtectedHeader({ 'urn:example:protected': true })
            .setUnprotectedHeader(
              alg.startsWith('A') && !alg.endsWith('KW')
                ? { enc: alg }
                : { enc: randomEnc(), 'urn:example:header': true },
            )
            .setSharedUnprotectedHeader(
              alg.startsWith('A') && !alg.endsWith('KW')
                ? { alg: 'dir' }
                : { alg, 'urn:example:unprotected': true },
            )
            .setAdditionalAuthenticatedData(random(new Uint8Array(128 >> 3)))
            .encrypt(pub);
          await decryptFlattened(jwe, priv);
        }),
      ]);
      t.pass();
    }
    smoke.title = (title, ref) => `${ref.toUpperCase()}${title ? ` ${title}` : ''}`;

    test(smoke, 'rsa');
    test('with wrap ops', smoke, 'rsa', ['wrapKey'], ['unwrapKey']);
    test('with enc ops', smoke, 'rsa', ['encrypt'], ['decrypt']);
    test(smoke, 'p256');
    test(smoke, 'p384');
    test(smoke, 'p521');
    test(smoke, 'oct128');
    test('as keyobject', smoke, 'oct128', ['wrapKey'], ['unwrapKey'], true);
    test(smoke, 'oct128gcm');
    test('as keyobject', smoke, 'oct128gcm', ['encrypt'], ['decrypt'], true);
    test(smoke, 'oct192');
    test('as keyobject', smoke, 'oct192', ['wrapKey'], ['unwrapKey'], true);
    test(smoke, 'oct192gcm');
    test('as keyobject', smoke, 'oct192gcm', ['encrypt'], ['decrypt'], true);
    test(smoke, 'oct256');
    test('as keyobject', smoke, 'oct256', ['wrapKey'], ['unwrapKey'], true);
    test(smoke, 'oct256gcm');
    test('as keyobject', smoke, 'oct256gcm', ['encrypt'], ['decrypt'], true);
    test(smoke, 'oct256c');
    test(smoke, 'oct384c');
    test(smoke, 'oct512c');
    test(smoke, 'octAny');
    test('as keyobject (deriveBits)', smoke, 'octAny', ['deriveBits'], ['deriveBits'], true);
    test('as keyobject (deriveKey)', smoke, 'octAny', ['deriveKey'], ['deriveKey'], true);

    let conditional;
    if ('WEBCRYPTO' in process.env) {
      conditional = test.failing;
    } else {
      conditional = test;
    }
    conditional(smoke, 'rsa1_5');
    conditional(smoke, 'x25519');
    conditional(smoke, 'x448');
    conditional('as keyobject', smoke, 'oct256c', undefined, undefined, true);
    conditional('as keyobject', smoke, 'oct384c', undefined, undefined, true);
    conditional('as keyobject', smoke, 'oct512c', undefined, undefined, true);
  },
  (err) => {
    test('failed to import', (t) => {
      console.error(err);
      t.fail();
    });
  },
);
