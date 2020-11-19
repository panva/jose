import test from 'ava';

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto';
Promise.all([import(`${root}/jwk/parse`), import(`${root}/jwk/from_key_like`)]).then(
  ([{ default: parseJwk }, { default: fromKeyLike }]) => {
    test('JWK must be an object', async (t) => {
      await t.throwsAsync(parseJwk(true), {
        instanceOf: TypeError,
        message: 'JWK must be an object',
      });
      await t.throwsAsync(parseJwk(null), {
        instanceOf: TypeError,
        message: 'JWK must be an object',
      });
      await t.throwsAsync(parseJwk(Boolean), {
        instanceOf: TypeError,
        message: 'JWK must be an object',
      });
      await t.throwsAsync(parseJwk([]), {
        instanceOf: TypeError,
        message: 'JWK must be an object',
      });
      await t.throwsAsync(parseJwk(''), {
        instanceOf: TypeError,
        message: 'JWK must be an object',
      });
      await t.throwsAsync(parseJwk(Object.create(null)), {
        instanceOf: TypeError,
        message: 'JWK must be an object',
      });
    });

    test('JWK kty must be recognized', async (t) => {
      await t.throwsAsync(parseJwk({ kty: 'unrecognized' }, 'HS256'), {
        code: 'ERR_JOSE_NOT_SUPPORTED',
        message: 'unsupported "kty" (Key Type) Parameter value',
      });
    });

    test('alg argument must be present if jwk does not have alg', async (t) => {
      const oct = {
        k: 'FyCq1CKBflh3I5gikEjpYrdOXllzxB_yc02za8ERknI',
        kty: 'oct',
      };
      await t.throwsAsync(parseJwk(oct), {
        instanceOf: TypeError,
        message: '"alg" argument is required when "jwk.alg" is not present',
      });
      await t.notThrowsAsync(parseJwk(oct, 'HS256'));
      await t.notThrowsAsync(parseJwk({ ...oct, alg: 'HS256' }));
    });

    test('oct JWK must have "k"', async (t) => {
      await t.throwsAsync(parseJwk({ kty: 'oct' }, 'HS256'), {
        instanceOf: TypeError,
        message: 'missing "k" (Key Value) Parameter value',
      });
    });

    test('RSA JWK with oth is unsupported', async (t) => {
      await t.throwsAsync(parseJwk({ kty: 'RSA', oth: [] }, 'RS256'), {
        code: 'ERR_JOSE_NOT_SUPPORTED',
        message: 'RSA JWK "oth" (Other Primes Info) Parameter value is unsupported',
      });
    });

    test('oct JWK (ext: true)', async (t) => {
      const oct = {
        k: 'FyCq1CKBflh3I5gikEjpYrdOXllzxB_yc02za8ERknI',
        kty: 'oct',
        ext: true,
      };

      t.deepEqual(
        await parseJwk(oct, 'HS256'),
        Uint8Array.from([
          23,
          32,
          170,
          212,
          34,
          129,
          126,
          88,
          119,
          35,
          152,
          34,
          144,
          72,
          233,
          98,
          183,
          78,
          94,
          89,
          115,
          196,
          31,
          242,
          115,
          77,
          179,
          107,
          193,
          17,
          146,
          114,
        ]),
      );
    });

    test('oct JWK (ext: false)', async (t) => {
      const oct = {
        k: 'FyCq1CKBflh3I5gikEjpYrdOXllzxB_yc02za8ERknI',
        kty: 'oct',
        ext: false,
      };

      const k = await parseJwk(oct, 'HS256');

      t.true('type' in k);
      t.is(k.type, 'secret');
    });

    test('oct JWK (ext missing)', async (t) => {
      const oct = {
        k: 'FyCq1CKBflh3I5gikEjpYrdOXllzxB_yc02za8ERknI',
        kty: 'oct',
      };

      const k = await parseJwk(oct, 'HS256');

      t.true('type' in k);
      t.is(k.type, 'secret');
    });

    async function testKeyImportExport(t, jwk) {
      await t.notThrowsAsync(async () => {
        const key = await parseJwk(jwk);
        t.is(key.type, 'private');
      });
      await t.notThrowsAsync(async () => {
        const { d, p, q, dp, dq, qi, ...publicJwk } = jwk;
        const key = await parseJwk(publicJwk);
        t.is(key.type, 'public');
      });
      await t.notThrowsAsync(async () => {
        const { ext, key_ops, alg, use, ...expectedExport } = jwk;
        const key = await parseJwk({ ...jwk, ext: true });
        t.is(key.type, 'private');
        t.deepEqual(await fromKeyLike(key), expectedExport);
      });
      await t.notThrowsAsync(async () => {
        const { d, p, q, dp, dq, qi, ...publicJwk } = jwk;
        const { ext, key_ops, alg, use, ...expectedExport } = publicJwk;
        const key = await parseJwk({ ...publicJwk, ext: true });
        t.is(key.type, 'public');
        t.deepEqual(await fromKeyLike(key), expectedExport);
      });
    }
    testKeyImportExport.title = (_, jwk) => `${jwk.kty} ${jwk.crv} JWK (${jwk.alg})`;

    const ec = {
      crv: 'P-256',
      x: 'Sp3KpzPjwcCF04_W2GvSSf-vGDvp3Iv2kQYqAjnMB-Y',
      y: 'lZmecT2quXe0i9f7b4qHvDAFDpxs0oxCoJx4tOOqsks',
      d: 'hRVo5TGE_d_4tQC1KEQIlCdo9rteZmLSmaMPpFOjeDI',
      kty: 'EC',
    };
    test(testKeyImportExport, { ...ec, alg: 'ES256' });
    test(testKeyImportExport, { ...ec, alg: 'ECDH-ES' });
    test(testKeyImportExport, { ...ec, alg: 'ECDH-ES+A128KW' });
    test(testKeyImportExport, {
      crv: 'P-384',
      x: 'H50cO3PJnVhAoF6_jPKpCl60cnvmoygN2u29jVN19x8C2PymixZS4Y5d1FfMMK3L',
      y: 'ATQ-4QWyYTtEaBW3CFQZEX0NdDE5g_9F24B0y2xxQgVmWa5Uz0QerlhzFoYU7Z_F',
      d: 'HDUcH8y8xr22EroPYBK3PvpNjA3pCJjvHpBXKejxOiQCoXhZ5PhX_nxb7lU0mlDE',
      kty: 'EC',
      alg: 'ES384',
    });
    test(testKeyImportExport, {
      crv: 'P-521',
      x: 'AFy8VTdHeJx7rrUajpeqIjGZsjtx0tftQ7pdL1qkTRpnvY0WVVKXjib3HINNLMA72gA7JujbvEtGvkvoo0P7pGVK',
      y: 'AfMRSFv9qfcH_XMHfPoltBMYLhDbS3Pw1GL7NO9SI_vF4JsiAta1Bq6teCl2z8klFtRCWXHfPqEF3cmXS8bDQVoT',
      d: 'AL123tYK7y-iViaReLOHe7XxKNSeoUMk4RRmcP6nSVuZrYJHtyYPak4gUmWB6A_GzED3zXkrkcssZEzHrYQILw5c',
      kty: 'EC',
      alg: 'ES512',
    });
    const rsa = {
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
    test(testKeyImportExport, { ...rsa, alg: 'RS256' });
    test(testKeyImportExport, { ...rsa, alg: 'PS256' });
    test(testKeyImportExport, { ...rsa, alg: 'RSA-OAEP' });
    test(testKeyImportExport, { ...rsa, alg: 'RSA-OAEP-256' });

    test('Uin8tArray can be transformed to a JWK', async (t) => {
      t.deepEqual(
        await fromKeyLike(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])),
        {
          k: 'AQIDBAUGBwgJCgsMDQ4P',
          kty: 'oct',
        },
      );
    });

    let conditional;
    if ('WEBCRYPTO' in process.env) {
      conditional = test.failing;
    } else {
      conditional = test;
    }

    conditional('secret key object can be transformed to a JWK', async (t) => {
      const keylike = await parseJwk(
        {
          ext: true,
          k: 'AQIDBAUGBwgJCgsMDQ4P',
          kty: 'oct',
        },
        'HS256',
        true,
      );
      t.deepEqual(await fromKeyLike(keylike), {
        k: 'AQIDBAUGBwgJCgsMDQ4P',
        kty: 'oct',
      });
    });

    const secp256k1 = {
      crv: 'secp256k1',
      x: 'WsY3Cti12AIuzgUEIINSmyhT8O6-o_6sBaUnjxKtJkE',
      y: 'yejzoIE2tLzM_av8Pbd3rW7adTxlUqys2Ajk-JCBLp8',
      d: '47Iw2GXvj-hpfgGsfF3F2mekHKaDc2qv7WTqtAkU1H0',
      kty: 'EC',
    };
    conditional(testKeyImportExport, { ...secp256k1, alg: 'ES256K' });
    const ed25519 = {
      crv: 'Ed25519',
      x: 'GVLslCt7dY6H8p_yatNaGOtpdrCho5qaLvIvNTMd29M',
      d: 'FRaWZohbbDyzhYpTCS9m4fv2xoK6HG83bw6jq6zNxEs',
      kty: 'OKP',
    };
    conditional(testKeyImportExport, { ...ed25519, alg: 'EdDSA' });
    const ed448 = {
      crv: 'Ed448',
      x: 'KYWcaDwgH77xdAwcbzOgvCVcGMy9I6prRQBhQTTdKXUcr-VquTz7Fd5adJO0wT2VHysF3bk3kBoA',
      d: 'UhC3-vN5vp_g9PnTknXZgfXUez7Xvw-OfuJ0pYkuwzpYkcTvacqoFkV_O05WMHpyXkzH9q2wzx5n',
      kty: 'OKP',
    };
    conditional(testKeyImportExport, { ...ed448, alg: 'EdDSA' });
    const x25519 = {
      crv: 'X25519',
      x: 'axR8Q7PEd74nY9nWaAoAYpMe3gp5sWbau6V6X1inPw4',
      d: 'aCvvb3jEBnxJJBjCIN2a9ZDTL-HG6LVgBbij4m8-d3Y',
      kty: 'OKP',
    };
    conditional(testKeyImportExport, { ...x25519, alg: 'ECDH-ES' });
    const x448 = {
      crv: 'X448',
      x: 'z8s0Ej7D4pgIDu233UHoDW48EbiEm5eFv8_LuFwRr0xVREHhCtdxH75x6J8egZbjDGweOSbeHbY',
      d: 'xBrCwLlrHa1ov2cbmD4eMw4t6DoN_MWsBT_mxcA_QWsCS_9sKMRyFpphNN9_2iKrGPTC9pWCS5w',
      kty: 'OKP',
    };
    conditional(testKeyImportExport, { ...x448, alg: 'ECDH-ES' });
  },
  (err) => {
    test('failed to import', (t) => {
      console.error(err);
      t.fail();
    });
  },
);
