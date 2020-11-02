/* eslint-disable no-param-reassign */
import test from 'ava';

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto';
Promise.all([
  import(`${root}/jws/flattened/sign`),
  import(`${root}/jws/flattened/verify`),
  import(`${root}/jwe/flattened/encrypt`),
  import(`${root}/jwe/flattened/decrypt`),
  import(`${root}/util/random`),
  import(`${root}/jwk/parse`),
]).then(
  ([
    { default: FlattenedSign },
    { default: flattenedVerify },
    { default: FlattenedEncrypt },
    { default: flattenedDecrypt },
    { default: random },
    { default: parseJwk },
  ]) => {
    function pubjwk(jwk) {
      const { d, p, q, dp, dq, qi, ...publicJwk } = jwk;
      return publicJwk;
    }

    test.before((t) => {
      const encode = TextEncoder.prototype.encode.bind(new TextEncoder());
      t.context.payload = encode('It’s a dangerous business, Frodo, going out your door.');
      t.context.rsa2040 = {
        e: 'AQAB',
        n:
          '4waoB9XUAsGc-bhkfY-v3hKEqmLYF4nS-8nji5R5KoOOeWC2hCkvbMfd2IlKRdMU7EmGXNx2BD2FVIqN9mWyZKJlzR2125lgJ-VxCymGv1A9057LEAFIrXsCUqwjPO07hCzZNv8IAAQzq53pnlAgb3TbfrxW24tamhCtaKHb5upAwo4jhYnfzex2--vD7mPxMoTuikno-eD_hxYmA52Uh1gu3wEWy44KA6aFJBpP7m4G5StuHSCXxiOWDaqMeFsMX1jqrom7SwbGJ7j0sf3ZqWrZR4x1pB3wk5Sixi_lmDfOkXhiizYnvJJ5rzr_f0bVdXeAe2U8vpEJSQeA36T7',
        d:
          'T7ZPm2it50XZ-yiOSDQCWSQBZt4L57_hz7ykY6b_IDlO9jlJ_H-FgllvAI-7_2ZNC2YJgmN6IKUFQpjfnas5hvIqcmnDJ9bjlz6NgZDUGipvevVfcUAyJ49wUlzUhpj5c8BXiGLliTPwfIqWs5qIuPm78_TnPnDgoAXJDVr_njr_C6CJFVfWni_6MTeT8iSApGrIJ-tovLlUWSQAyKfWT0QK8dclmREla6-B4YPFwMuBViiSI8dGFpw1O-sEn7D1aMWRepWKr-dgvukuksdL39LxBeGz-iHpI_DMdSB63t5kyjT7GPlbBkD__4ie_Vl4bG30dUZvH_Vt6nXxyXEh',
        p:
          'D0TqaIEyAQHzW1SnC_b1AM9sehg6baMhw4mwSQHqVQreS6a2FKor2xVUdWzT3EurRJ-NThGyi81b30MsKjV_eZ1pIA2r5ulab5CgsV4pkk9LZPZYtz4Rylv9RY3ArtBxziF_BPhTbyy5LXUr5TZUpTQn-LGPOc2sjDaB80uD9XE',
        q:
          'Dt5ET14bw-tNwsgBK-IuhuPzxeCYSi6AkiDqdJuykcN8z8Of-OyPbQSVgTNbvQSZ1anaV0-pvrkER5ilIjcaGtaBmQmCUZe0vKBynakRWXR16SE2mqJAjAmO6VD25cxdnNghdg8ue5XsdyjuQ0dnTXibsIcVyjfaIZgjbhi6mys',
        dp:
          'BD0cWXBsAi2ZceQZD1A6CUSLl4U8Sw07JT4Gyu2WMI940EVyTGBFFmdgb8yLL59t5vnnzyFIkFisxVivXPRG8-rHsRc6fjqPWWMryLEcFzqd8mQUkqHPbH6G25UTRTQmM5PG4AlTmAwxR7Y8PkAL1WSaKAaafPBkkvPatUBkXHE',
        dq:
          'Bv-nBfkVdr6PRu2gZ4i7P_GTMQTMirai_KYT1rnnb2emm6HI7oJj7PwoZ73GJA5DX2jphwnPrCApHI6ExLtNRW7NaD0qo7-WaufXq9EGgqYoTom8y0MuwPxK0hazcW4mborqDUmOJsxml5yjsvWscbIhDxI3No3d1sxneQ6Y4Cs',
        qi:
          'AkpKJwYKvaB73G7IQK5yxXCOvypwSEUK1bOcbhOZSQPPNtKvov11dVsGs-pqHo0Su06IXQv0Ayyy3uxXvsY8CyZ3CbPWMXM06Z3Gr0kZWWfNu8NiFwXvkbe24P-KeXIQGFTfdqSMTfm2an1YNE9e9F36rZ0EkhdKzmwzudA7jtw',
        kty: 'RSA',
      };
      t.context.rsa2048 = {
        e: 'AQAB',
        n:
          '3egkthDOqRIif9azx83Q-HKcVNUeDALom8e5L1rjljB82EKYt5zgfKlgLW4NuJQgLDx5jA7Ez_nz-8lIcVTez-C75_M-Thv2wLhk4ZAYAZZPEmZr76zH8-lClnhxcqFnkOABqLmopr2gF1gBG_IkqEnH_h_yH486YkCd0G2ZNJAzjCOCQMR5pzBnIxC4YUAX7r_-9ilQ8Lv3MSJ0MLv6cujJTneyjWnoh_SfOXRsY6f3gkfR9APj9Q5A8PA8gvbYyN8EHr4OYb1KwNjs_0_X0Aq0e1NJx3H5eiZe6UaFleIbEVZYoNtlNJO3kmGESaxepkWTRAqBZVTfj4KnKX_9Ow',
        d:
          'Q17sbl4x8ACyeq97i4jADf312oeNhMYJSupbHbZxbDKyZJHrfatiOFbP_VrxTX2jOurtWAlP1Xiki2fz13yV3PT095nQ67PvuVkCP70YnLq-rO5tjKmfVz0VW0ub3dqE7-YietBLFLxzc0Ljq1FbscAcuNmID-7TIetOPm5X2i3wxOuiEV2xz1nHVuys3yoO3z4rAitGFl943k71P4FKxK9mp9oTQTnDfKauP0eSOD10L2NiYLkUTg9YC8A0EQopdZatDVAz3hWitNpJg28fWe7rp7yR2YBb4nFcNuygZmzEzp7x0r87NnTt9t4Hjd1rNFbd3hdT6Dy9_pejkmdU2Q',
        p:
          '8_HZDF8wp0ujYxiyvAXOL6Xsnv08bQ80uzDOGCnHWWKeFn8n43gc49AdBiJ2ljmfQxExiK0wmetR76zdxTJBIWQdGI2ZJkb6lAIOEBhrXzrWXUSMPgc3qYbQRkmexrAAdwG1nWUymMDd36K5d_YEmL172a-gyEAXMGGW81AaeVU',
        q:
          '6N9-STJXjcrwedkJpmmjKLBpU_Nw0UfpKAkh3Xf6jpaF-A2Cvr07JqDVzExMfpYDCcki7IW8SLK5wXVfWCZqXXl4bsb5LAJLnRIglgnDxItlmRf5CWHw7lmBD6BguEIhXU3xPiNrK3XiBVS4k2yDaYHHoAPYXDfTCGpbts7SXE8',
        dp:
          'k_OmtH43P__8BGpCXQ8YUoXL0VG9iFekn7OmC7mrEmdhgjt0sd1ziCf8sm_MhKhGE6Ml68M-qtuyQi8SAjvMjLfvfajDrhd2erYUWWa2GHfS85ZTiHtQIx2EzFxyVAcDASqkP-XUnhi7eJt06XDosMqbhxeh6FIWvl0x9DgtFlE',
        dq:
          'UqK8VY0ftJlHLHXwDrV9yHqRZdEFP76c5jAXbFee-epAL_3bX4QW8WYxeAW7P1BMU7SkR_pNDh8d-6CC7Oz04aaxLd49nXhTDLHaDmP4rE4rB2CSZtnyfSIVwk3PBJOy80EtUjePWCTEx8-AkA_5sf7zr7ytkkvc_yd-1CggTdE',
        qi:
          'd72eV7EbpvaSA3ZiQdGXpMMr41o0ih1WnV80Bxraugj1vMqxLlhVdDhDCVoF3LEoXVz8n2NEl1F6k2o3Gt9C5pXUDJwRGS41FwYVp8RN-aWviJM43mM0oQndJomZyDzjOKzpTzlNlAkFQQbfoagc4sbg-0JxK9rWdnMDW5AR1BU',
        kty: 'RSA',
      };
    });

    async function testHMAC(t, alg) {
      const size = parseInt(alg.substr(-3), 10);
      const message = `${alg} requires symmetric keys to be ${size} bits or larger`;
      const secret = random(new Uint8Array((size >> 3) - 1));
      await t.throwsAsync(
        new FlattenedSign(t.context.payload).setProtectedHeader({ alg }).sign(secret),
        { instanceOf: TypeError, message },
      );

      const jws = await new FlattenedSign(t.context.payload)
        .setProtectedHeader({ alg })
        .sign(random(new Uint8Array(size >> 3)));

      await t.throwsAsync(flattenedVerify(jws, secret), { instanceOf: TypeError, message });
    }
    testHMAC.title = (title, alg) =>
      `${alg} requires symmetric keys to be ${alg.substr(-3)} bits or larger`;

    test(testHMAC, 'HS256');
    test(testHMAC, 'HS384');
    test(testHMAC, 'HS512');

    async function testRSAsig(t, alg) {
      const message = `${alg} requires key modulusLength to be 2048 bits or larger`;
      const keyBad = t.context.rsa2040;
      const keyOk = t.context.rsa2048;
      await t.throwsAsync(
        new FlattenedSign(t.context.payload)
          .setProtectedHeader({ alg })
          .sign(await parseJwk(keyBad, alg)),
        { instanceOf: TypeError, message },
      );

      const jws = await new FlattenedSign(t.context.payload)
        .setProtectedHeader({ alg })
        .sign(await parseJwk(keyOk, alg));

      await t.throwsAsync(flattenedVerify(jws, await parseJwk(pubjwk(keyBad), alg)), {
        instanceOf: TypeError,
        message,
      });
    }
    testRSAsig.title = (title, alg) =>
      `${alg} requires key modulusLength to be 2048 bits or larger`;

    async function testRSAenc(t, alg) {
      const message = `${alg} requires key modulusLength to be 2048 bits or larger`;
      const keyBad = t.context.rsa2040;
      const keyOk = t.context.rsa2048;
      await t.throwsAsync(
        new FlattenedEncrypt(t.context.payload)
          .setProtectedHeader({ alg, enc: 'A256GCM' })
          .encrypt(await parseJwk(pubjwk(keyBad), alg)),
        { instanceOf: TypeError, message },
      );

      const jwe = await new FlattenedEncrypt(t.context.payload)
        .setProtectedHeader({ alg, enc: 'A256GCM' })
        .encrypt(await parseJwk(pubjwk(keyOk), alg));

      await t.throwsAsync(flattenedDecrypt(jwe, await parseJwk(keyBad, alg)), {
        instanceOf: TypeError,
        message,
      });
    }
    testRSAenc.title = (title, alg) =>
      `${alg} requires key modulusLength to be 2048 bits or larger`;

    test(testRSAsig, 'RS256');
    test(testRSAsig, 'PS256');
    test(testRSAsig, 'RS384');
    test(testRSAsig, 'PS384');
    test(testRSAsig, 'RS512');
    test(testRSAsig, 'PS512');

    test(testRSAenc, 'RSA-OAEP');
    test(testRSAenc, 'RSA-OAEP-256');
    test(testRSAenc, 'RSA-OAEP-384');
    test(testRSAenc, 'RSA-OAEP-512');

    let conditional;
    if ('WEBCRYPTO' in process.env) {
      conditional = test.failing;
    } else {
      conditional = test;
    }
    conditional(testRSAenc, 'RSA1_5');
  },
  (err) => {
    test('failed to import', (t) => {
      console.error(err);
      t.fail();
    });
  },
);
