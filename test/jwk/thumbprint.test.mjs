import test from 'ava';

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto';
import(`${root}/jwk/thumbprint`).then(
  ({ default: thumbprint }) => {
    test('https://tools.ietf.org/html/rfc7638#section-3.1', async (t) => {
      t.is(
        await thumbprint({
          kty: 'RSA',
          n:
            '0vx7agoebGcQSuuPiLJXZptN9nndrQmbXEps2aiAFbWhM78LhWx4cbbfAAtVT86zwu1RK7aPFFxuhDR1L6tSoc_BJECPebWKRXjBZCiFV4n3oknjhMstn64tZ_2W-5JsGY4Hc5n9yBXArwl93lqt7_RN5w6Cf0h4QyQ5v-65YGjQR0_FDW2QvzqY368QQMicAtaSqzs8KJZgnYb9c7d0zgdAZHzu6qMQvRL5hajrn1n91CbOpbISD08qNLyrdkt-bFTWhAI4vMQFh6WeZu0fM4lFd2NcRwr3XPksINHaQ-G_xBniIqbw0Ls1jF44-csFCur-kEgU8awapJzKnqDKgw',
          e: 'AQAB',
          alg: 'RS256',
        }),
        'NzbLsXh8uDCcd-6MNwXF4W_7noWXFZAfHkxZsRGC9Xs',
      );
    });

    test('JWK must be an object', async (t) => {
      await t.throwsAsync(thumbprint(true), {
        instanceOf: TypeError,
        message: 'JWK must be an object',
      });
      await t.throwsAsync(thumbprint(null), {
        instanceOf: TypeError,
        message: 'JWK must be an object',
      });
      await t.throwsAsync(thumbprint(Boolean), {
        instanceOf: TypeError,
        message: 'JWK must be an object',
      });
      await t.throwsAsync(thumbprint([]), {
        instanceOf: TypeError,
        message: 'JWK must be an object',
      });
      await t.throwsAsync(thumbprint(''), {
        instanceOf: TypeError,
        message: 'JWK must be an object',
      });
      await t.throwsAsync(thumbprint(Object.create(null)), {
        instanceOf: TypeError,
        message: 'JWK must be an object',
      });
    });

    test('JWK kty must be recognized', async (t) => {
      await t.throwsAsync(thumbprint({ kty: 'unrecognized' }), {
        code: 'ERR_JOSE_NOT_SUPPORTED',
        message: '"kty" (Key Type) Parameter missing or unsupported',
      });
    });

    test('EC JWK', async (t) => {
      const ec = {
        crv: 'P-256',
        kty: 'EC',
        x: 'q3zAwR_kUwtdLEwtB2oVfucXiLHmEhu9bJUFYjJxYGs',
        y: '8h0D-ONoU-iZqrq28TyUxEULxuGwJZGMJYTMbeMshvI',
      };

      await t.throwsAsync(thumbprint({ ...ec, crv: undefined }), {
        code: 'ERR_JWK_INVALID',
        message: '"crv" (Curve) Parameter missing or invalid',
      });
      await t.throwsAsync(thumbprint({ ...ec, x: undefined }), {
        code: 'ERR_JWK_INVALID',
        message: '"x" (X Coordinate) Parameter missing or invalid',
      });
      await t.throwsAsync(thumbprint({ ...ec, y: undefined }), {
        code: 'ERR_JWK_INVALID',
        message: '"y" (Y Coordinate) Parameter missing or invalid',
      });
      t.is(await thumbprint(ec), 'ZrBaai73Hi8Fg4MElvDGzIne2NsbI75RHubOViHYE5Q');
    });

    test('OKP JWK', async (t) => {
      const okp = {
        crv: 'Ed25519',
        kty: 'OKP',
        x: '5fL1GDeyNTIxtuzTeFnvZTo4Oz0EkMfAdhIJA-EFn0w',
      };

      await t.throwsAsync(thumbprint({ ...okp, crv: undefined }), {
        code: 'ERR_JWK_INVALID',
        message: '"crv" (Subtype of Key Pair) Parameter missing or invalid',
      });
      await t.throwsAsync(thumbprint({ ...okp, x: undefined }), {
        code: 'ERR_JWK_INVALID',
        message: '"x" (Public Key) Parameter missing or invalid',
      });
      t.is(await thumbprint(okp), '1OzNmMHhNzbSJyoePAtdoVedRZlFvER3K3RAzCrfX0k');
    });

    test('RSA JWK', async (t) => {
      const rsa = {
        e: 'AQAB',
        kty: 'RSA',
        n:
          'ok6WYUlmj2J1p-Sm0kwaZlAbWetUooe2LR6iAOJfntavWlyBO0shK_550YG3lQ6R1YeKisNAqbQ1pjqo3vwvR_v_AWtZ1gY1h6KX4DhCv0nNMexZ4g67LxEweoQ4_InMMiwMyQ3CRVJ3P1w0TQZYqzfSye-llY39tyzHeHeuotgrZrM427iUuIJdN38nZ2vW9VpK3bo_Nsvl12ZBe6x7DBzWEFHqQDFyjy8lH8EZyxqDArLA7T5OAcEdkm3RI8jBbsrUD9IySCE5SdEU3n0VGNGkT88DFU85QGvLpL2ITbGX0amaJvxYjIRhIYTfZS6Mqoxr6K1LIwP8pu0VD2Ca5Q',
      };

      await t.throwsAsync(thumbprint({ ...rsa, e: undefined }), {
        code: 'ERR_JWK_INVALID',
        message: '"e" (Exponent) Parameter missing or invalid',
      });
      await t.throwsAsync(thumbprint({ ...rsa, n: undefined }), {
        code: 'ERR_JWK_INVALID',
        message: '"n" (Modulus) Parameter missing or invalid',
      });
      t.is(await thumbprint(rsa), 'dQiQXSGtV4XcPK143Cu2-ZSsQtVNjQZrleUMs9nLnKQ');
    });

    test('oct JWK', async (t) => {
      const oct = {
        k: 'FyCq1CKBflh3I5gikEjpYrdOXllzxB_yc02za8ERknI',
        kty: 'oct',
      };

      await t.throwsAsync(thumbprint({ ...oct, k: undefined }), {
        code: 'ERR_JWK_INVALID',
        message: '"k" (Key Value) Parameter missing or invalid',
      });
      t.is(await thumbprint(oct), 'prDKy90VJzrDTpm8-W2Q_pv_kzrX_zyZ7ANjRAasDxc');
    });
  },
  (err) => {
    test('failed to import', (t) => {
      console.error(err);
      t.fail();
    });
  },
);
