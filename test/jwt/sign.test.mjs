/* eslint-disable no-param-reassign */
import test from 'ava';
import timekeeper from 'timekeeper';

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto';
Promise.all([import(`${root}/jwt/sign`), import(`${root}/jws/compact/verify`)]).then(
  ([{ default: SignJWT }, { default: compactVerify }]) => {
    const now = 1604416038;

    test.before(async (t) => {
      t.context.secret = new Uint8Array(32);
      t.context.payload = { 'urn:example:claim': true };

      timekeeper.freeze(now * 1000);
    });

    test.after(timekeeper.reset);

    test('SignJWT', async (t) => {
      const jwt = await new SignJWT(t.context.payload)
        .setProtectedHeader({ alg: 'HS256' })
        .sign(t.context.secret);
      t.is(
        jwt,
        'eyJhbGciOiJIUzI1NiJ9.eyJ1cm46ZXhhbXBsZTpjbGFpbSI6dHJ1ZX0.yPnOE--rxp3rJaYy0iZaW2Vswvus05G6_ZBdXqIdjGo',
      );
    });

    test('new SignJWT', (t) => {
      t.throws(() => new SignJWT(), {
        instanceOf: TypeError,
        message: 'JWT Claims Set MUST be an object',
      });
    });

    test('Signed JWTs cannot use unencoded payload', async (t) => {
      await t.throwsAsync(
        () =>
          new SignJWT({})
            .setProtectedHeader({ alg: 'HS256', crit: ['b64'], b64: false })
            .sign(t.context.secret),
        { code: 'ERR_JWT_INVALID', message: 'JWTs MUST NOT use unencoded payload' },
      );
    });

    async function testJWTsetFunction(t, method, claim, value, expected = value) {
      const jwt = await new SignJWT({})
        .setProtectedHeader({ alg: 'HS256' })
        [method](value)
        .sign(t.context.secret);
      const { payload } = await compactVerify(jwt, async (header, token) => {
        t.true('alg' in header);
        t.is(header.alg, 'HS256');
        t.true('payload' in token);
        t.true('protected' in token);
        t.true('signature' in token);
        return t.context.secret;
      });
      const claims = JSON.parse(new TextDecoder().decode(payload));
      t.true(claim in claims);
      t.is(claims[claim], expected);
    }
    testJWTsetFunction.title = (title, method, claim, value) =>
      `SignJWT.prototype.${method} called with ${value}`;

    test(testJWTsetFunction, 'setIssuer', 'iss', 'urn:example:issuer');
    test(testJWTsetFunction, 'setSubject', 'sub', 'urn:example:subject');
    test(testJWTsetFunction, 'setAudience', 'aud', 'urn:example:audience');
    test(testJWTsetFunction, 'setJti', 'jti', 'urn:example:jti');
    test(testJWTsetFunction, 'setIssuedAt', 'iat', 0);
    test(testJWTsetFunction, 'setIssuedAt', 'iat', undefined, now);
    test(testJWTsetFunction, 'setExpirationTime', 'exp', 0);
    test(testJWTsetFunction, 'setExpirationTime', 'exp', '10s', now + 10);
    test(testJWTsetFunction, 'setNotBefore', 'nbf', 0);
    test(testJWTsetFunction, 'setNotBefore', 'nbf', '10s', now + 10);
  },
  (err) => {
    test('failed to import', (t) => {
      console.error(err);
      t.fail();
    });
  },
);
