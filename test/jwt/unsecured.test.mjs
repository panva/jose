/* eslint-disable no-param-reassign */
import test from 'ava';
import timekeeper from 'timekeeper';

const root = !('WEBCRYPTO' in process.env) ? '#dist' : '#dist/webcrypto';
import(`${root}/jwt/unsecured`).then(
  ({ default: UnsecuredJWT }) => {
    const now = 1604416038;

    test.before(async (t) => {
      t.context.payload = { 'urn:example:claim': true };

      timekeeper.freeze(now * 1000);
    });

    test.after(timekeeper.reset);

    test('UnsecuredJWT', async (t) => {
      const jwt = new UnsecuredJWT(t.context.payload).encode();
      t.is(jwt, 'eyJhbGciOiJub25lIn0.eyJ1cm46ZXhhbXBsZTpjbGFpbSI6dHJ1ZX0.');
    });

    test('UnsecuredJWT validations', (t) => {
      t.throws(() => UnsecuredJWT.decode(null), {
        code: 'ERR_JWT_INVALID',
        message: 'Unsecured JWT must be a string',
      });
      t.throws(() => UnsecuredJWT.decode('....'), {
        code: 'ERR_JWT_INVALID',
        message: 'Invalid Unsecured JWT',
      });
      t.throws(() => UnsecuredJWT.decode('..'), {
        code: 'ERR_JWT_INVALID',
        message: 'Invalid Unsecured JWT',
      });
      t.throws(() => UnsecuredJWT.decode('..foo'), {
        code: 'ERR_JWT_INVALID',
        message: 'Invalid Unsecured JWT',
      });
      t.throws(
        () => UnsecuredJWT.decode('eyJhbGciOiJIUzI1NiJ9.eyJ1cm46ZXhhbXBsZTpjbGFpbSI6dHJ1ZX0.'),
        { code: 'ERR_JWT_INVALID', message: 'Invalid Unsecured JWT' },
      );
    });

    test('new UnsecuredJWT', (t) => {
      t.throws(() => new UnsecuredJWT(), {
        instanceOf: TypeError,
        message: 'JWT Claims Set MUST be an object',
      });
    });

    async function testJWTsetFunction(t, method, claim, value, expected = value) {
      const jwt = new UnsecuredJWT({})[method](value).encode();
      const { payload: claims } = UnsecuredJWT.decode(jwt);
      t.true(claim in claims);
      t.is(claims[claim], expected);
    }
    testJWTsetFunction.title = (title, method, claim, value) =>
      `UnsecuredJWT.prototype.${method} called with ${value}`;

    test(testJWTsetFunction, 'setIssuer', 'iss', 'urn:example:issuer');
    test(testJWTsetFunction, 'setSubject', 'sub', 'urn:example:subject');
    test(testJWTsetFunction, 'setAudience', 'aud', 'urn:example:audience');
    test(testJWTsetFunction, 'setJti', 'jti', 'urn:example:jti');
    test(testJWTsetFunction, 'setIssuedAt', 'iat', 0);
    test(testJWTsetFunction, 'setIssuedAt', 'iat', undefined, now);
    test(testJWTsetFunction, 'setExpirationTime', 'exp', '10s', now + 10);
    test(testJWTsetFunction, 'setNotBefore', 'nbf', 0);
  },
  (err) => {
    test('failed to import', (t) => {
      console.error(err);
      t.fail();
    });
  },
);
