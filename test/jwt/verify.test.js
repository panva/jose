const test = require('ava')

const { JWT, JWK, JWKS, errors } = require('../..')
const base64url = require('../../lib/help/base64url')

const key = JWK.generateSync('oct')
const token = JWT.sign({}, key, { iat: false })

const string = (t, option) => {
  ;['', false, [], {}, Buffer, Buffer.from('foo'), 0, Infinity].forEach((val) => {
    t.throws(() => {
      JWT.verify(token, key, { [option]: val })
    }, { instanceOf: TypeError, message: `options.${option} must be a string` })
  })
}

test('options.complete true', t => {
  const token = JWT.sign({}, key)
  const completeResult = JWT.verify(token, key, { complete: true })
  t.is(completeResult.key, key)
})

test('options.complete with KeyStore', t => {
  const ks = new JWKS.KeyStore(JWK.generateSync('oct'), key)
  const token = JWT.sign({}, key, { kid: false })
  const completeResult = JWT.verify(token, ks, { complete: true })
  t.is(completeResult.key, key)
})

test('options must be an object', t => {
  ;['', false, [], Buffer, Buffer.from('foo'), 0, Infinity].forEach((val) => {
    t.throws(() => {
      JWT.verify(token, key, val)
    }, { instanceOf: TypeError, message: 'options must be an object' })
  })
})

test('options.clockTolerance must be a string', string, 'clockTolerance')
test('options.issuer must be a string', string, 'issuer')
test('options.jti must be a string', string, 'jti')
test('options.profile must be a string', string, 'profile')
test('options.maxAuthAge must be a string', string, 'maxAuthAge')
test('options.maxTokenAge must be a string', string, 'maxTokenAge')
test('options.nonce must be a string', string, 'nonce')
test('options.subject must be a string', string, 'subject')

const boolean = (t, option) => {
  ;['', 'foo', [], {}, Buffer, Buffer.from('foo'), 0, Infinity].forEach((val) => {
    t.throws(() => {
      JWT.verify(token, key, { [option]: val })
    }, { instanceOf: TypeError, message: `options.${option} must be a boolean` })
  })
}
test('options.complete must be boolean', boolean, 'complete')
test('options.ignoreExp must be boolean', boolean, 'ignoreExp')
test('options.ignoreNbf must be boolean', boolean, 'ignoreNbf')
test('options.ignoreIat must be boolean', boolean, 'ignoreIat')

test('options.audience must be string or array of strings', t => {
  ;['', false, [], Buffer, Buffer.from('foo'), 0, Infinity].forEach((val) => {
    t.throws(() => {
      JWT.verify(token, key, { audience: val })
    }, { instanceOf: TypeError, message: 'options.audience must be a string or an array of strings' })
    t.throws(() => {
      JWT.verify(token, key, { audience: [val] })
    }, { instanceOf: TypeError, message: 'options.audience must be a string or an array of strings' })
  })
})

test('options.algorithms must be string or array of strings', t => {
  ;['', false, [], Buffer, Buffer.from('foo'), 0, Infinity].forEach((val) => {
    t.throws(() => {
      JWT.verify(token, key, { algorithms: val })
    }, { instanceOf: TypeError, message: 'options.algorithms must be an array of strings' })
    t.throws(() => {
      JWT.verify(token, key, { algorithms: [val] })
    }, { instanceOf: TypeError, message: 'options.algorithms must be an array of strings' })
  })
})

test('options.crit must be string or array of strings', t => {
  ;['', false, [], Buffer, Buffer.from('foo'), 0, Infinity].forEach((val) => {
    t.throws(() => {
      JWT.verify(token, key, { crit: val })
    }, { instanceOf: TypeError, message: 'options.crit must be an array of strings' })
    t.throws(() => {
      JWT.verify(token, key, { crit: [val] })
    }, { instanceOf: TypeError, message: 'options.crit must be an array of strings' })
  })
})

test('options.now must be a valid date', t => {
  ;['', 'foo', [], {}, Buffer, Buffer.from('foo'), 0, Infinity, new Date('foo')].forEach((val) => {
    t.throws(() => {
      JWT.verify(token, key, { now: val })
    }, { instanceOf: TypeError, message: 'options.now must be a valid Date object' })
  })
})

test('options.ignoreIat & options.maxTokenAge may not be used together', t => {
  t.throws(() => {
    JWT.verify(token, key, { ignoreIat: true, maxTokenAge: '2d' })
  }, { instanceOf: TypeError, message: 'options.ignoreIat and options.maxTokenAge cannot used together' })
})

;['iat', 'exp', 'auth_time', 'nbf'].forEach((claim) => {
  test(`"${claim} must be a timestamp when provided"`, t => {
    ;['', 'foo', true, null, [], {}].forEach((val) => {
      t.throws(() => {
        const invalid = `e30.${base64url.JSON.encode({ [claim]: val })}.`
        JWT.verify(invalid, key)
      }, { instanceOf: errors.JWTClaimInvalid, message: `"${claim}" claim must be a unix timestamp` })
    })
  })
})

;['jti', 'acr', 'iss', 'nonce', 'sub', 'azp'].forEach((claim) => {
  test(`"${claim} must be a string when provided"`, t => {
    ;['', 0, 1, true, null, [], {}].forEach((val) => {
      t.throws(() => {
        const invalid = `e30.${base64url.JSON.encode({ [claim]: val })}.`
        JWT.verify(invalid, key)
      }, { instanceOf: errors.JWTClaimInvalid, message: `"${claim}" claim must be a string` })
    })
  })
})

;['aud', 'amr'].forEach((claim) => {
  test(`"${claim} must be a string when provided"`, t => {
    ;['', 0, 1, true, null, [], {}].forEach((val) => {
      t.throws(() => {
        const invalid = `e30.${base64url.JSON.encode({ [claim]: val })}.`
        JWT.verify(invalid, key)
      }, { instanceOf: errors.JWTClaimInvalid, message: `"${claim}" claim must be a string or array of strings` })
      t.throws(() => {
        const invalid = `e30.${base64url.JSON.encode({ [claim]: [val] })}.`
        JWT.verify(invalid, key)
      }, { instanceOf: errors.JWTClaimInvalid, message: `"${claim}" claim must be a string or array of strings` })
    })
  })
})

Object.entries({
  issuer: 'iss',
  nonce: 'nonce',
  subject: 'sub',
  jti: 'jti'
}).forEach(([option, claim]) => {
  test(`option.${option} validation fails`, t => {
    t.throws(() => {
      const invalid = `e30.${base64url.JSON.encode({ [claim]: 'foo' })}.`
      JWT.verify(invalid, key, { [option]: 'bar' })
    }, { instanceOf: errors.JWTClaimInvalid, message: `${option} mismatch` })
  })

  test(`option.${option} validation success`, t => {
    const token = JWT.sign({ [claim]: 'foo' }, key)
    JWT.verify(token, key, { [option]: 'foo' })
    t.pass()
  })
})

test('option.audience validation fails', t => {
  t.throws(() => {
    const invalid = `e30.${base64url.JSON.encode({ aud: 'foo' })}.`
    JWT.verify(invalid, key, { audience: 'bar' })
  }, { instanceOf: errors.JWTClaimInvalid, message: 'audience mismatch' })
  t.throws(() => {
    const invalid = `e30.${base64url.JSON.encode({ aud: ['foo'] })}.`
    JWT.verify(invalid, key, { audience: 'bar' })
  }, { instanceOf: errors.JWTClaimInvalid, message: 'audience mismatch' })
})

test('option.audience validation success', t => {
  let token = JWT.sign({ aud: 'foo' }, key)
  JWT.verify(token, key, { audience: 'foo' })
  token = JWT.sign({ aud: 'foo' }, key)
  JWT.verify(token, key, { audience: ['foo'] })
  token = JWT.sign({ aud: 'foo' }, key)
  JWT.verify(token, key, { audience: ['foo', 'bar'] })

  token = JWT.sign({ aud: ['foo', 'bar'] }, key)
  JWT.verify(token, key, { audience: 'foo' })
  token = JWT.sign({ aud: ['foo', 'bar'] }, key)
  JWT.verify(token, key, { audience: ['foo'] })
  token = JWT.sign({ aud: ['foo', 'bar'] }, key)
  JWT.verify(token, key, { audience: ['foo', 'bar'] })
  t.pass()
})

test('option.maxAuthAge requires iat to be in the payload', t => {
  t.throws(() => {
    const invalid = `e30.${base64url.JSON.encode({})}.`
    JWT.verify(invalid, key, { maxAuthAge: '30s' })
  }, { instanceOf: errors.JWTClaimInvalid, message: 'missing auth_time' })
})

const epoch = 1265328501
const now = new Date(epoch * 1000)

test('option.maxAuthAge checks auth_time', t => {
  t.throws(() => {
    const invalid = `e30.${base64url.JSON.encode({ auth_time: epoch - 31 })}.`
    JWT.verify(invalid, key, { maxAuthAge: '30s', now })
  }, { instanceOf: errors.JWTClaimInvalid, message: 'too much time has elapsed since the last End-User authentication' })
})

test('option.maxAuthAge checks auth_time (with tolerance)', t => {
  const token = JWT.sign({ auth_time: epoch - 31 }, key, { now })
  JWT.verify(token, key, { maxAuthAge: '30s', now, clockTolerance: '1s' })
  t.pass()
})

test('option.maxTokenAge requires iat to be in the payload', t => {
  t.throws(() => {
    const invalid = `e30.${base64url.JSON.encode({})}.`
    JWT.verify(invalid, key, { maxTokenAge: '30s' })
  }, { instanceOf: errors.JWTClaimInvalid, message: 'missing iat claim' })
})

test('option.maxTokenAge checks iat elapsed time', t => {
  t.throws(() => {
    const invalid = `e30.${base64url.JSON.encode({ iat: epoch - 31 })}.`
    JWT.verify(invalid, key, { maxTokenAge: '30s', now })
  }, { instanceOf: errors.JWTClaimInvalid, message: 'maxTokenAge exceeded' })
})

test('option.maxTokenAge checks iat (with tolerance)', t => {
  const token = JWT.sign({ iat: epoch - 31 }, key, { now })
  JWT.verify(token, key, { maxTokenAge: '30s', now, clockTolerance: '1s' })
  t.pass()
})

test('iat check (pass)', t => {
  const token = JWT.sign({ iat: epoch - 30 }, key, { iat: false })
  JWT.verify(token, key, { now })
  t.pass()
})

test('iat check (pass equal)', t => {
  const token = JWT.sign({}, key, { now })
  JWT.verify(token, key, { now })
  t.pass()
})

test('iat check (pass with tolerance)', t => {
  const token = JWT.sign({}, key, { now: new Date((epoch + 1) * 1000) })
  JWT.verify(token, key, { now, clockTolerance: '1s' })
  t.pass()
})

test('iat check (failed)', t => {
  const token = JWT.sign({}, key, { now: new Date((epoch + 1) * 1000) })
  t.throws(() => {
    JWT.verify(token, key, { now })
  }, { instanceOf: errors.JWTClaimInvalid, message: 'token issued in the future' })
})

test('iat check (ignored since exp is also present)', t => {
  const token = JWT.sign({}, key, { now: new Date((epoch + 1) * 1000), expiresIn: '2h' })
  JWT.verify(token, key, { now })
  t.pass()
})

test('iat check (passed because of ignoreIat)', t => {
  const token = JWT.sign({}, key, { now: new Date((epoch + 1) * 1000) })
  JWT.verify(token, key, { now, ignoreIat: true })
  t.pass()
})

test('exp check (pass)', t => {
  const token = JWT.sign({ exp: epoch + 30 }, key, { iat: false })
  JWT.verify(token, key, { now })
  t.pass()
})

test('exp check (pass equal - 1)', t => {
  const token = JWT.sign({ exp: epoch + 1 }, key, { iat: false })
  JWT.verify(token, key, { now })
  t.pass()
})

test('exp check (pass with tolerance)', t => {
  const token = JWT.sign({ exp: epoch }, key, { iat: false })
  JWT.verify(token, key, { now, clockTolerance: '1s' })
  t.pass()
})

test('exp check (failed equal)', t => {
  const token = JWT.sign({ exp: epoch }, key, { iat: false })
  t.throws(() => {
    JWT.verify(token, key, { now })
  }, { instanceOf: errors.JWTClaimInvalid, message: 'token is expired' })
})

test('exp check (failed normal)', t => {
  const token = JWT.sign({ exp: epoch - 1 }, key, { iat: false })
  t.throws(() => {
    JWT.verify(token, key, { now })
  }, { instanceOf: errors.JWTClaimInvalid, message: 'token is expired' })
})

test('exp check (passed because of ignoreExp)', t => {
  const token = JWT.sign({ exp: epoch - 10 }, key, { iat: false })
  JWT.verify(token, key, { now, ignoreExp: true })
  t.pass()
})

test('nbf check (pass)', t => {
  const token = JWT.sign({ nbf: epoch - 30 }, key, { iat: false })
  JWT.verify(token, key, { now })
  t.pass()
})

test('nbf check (pass equal)', t => {
  const token = JWT.sign({ nbf: epoch }, key, { iat: false })
  JWT.verify(token, key, { now })
  t.pass()
})

test('nbf check (pass with tolerance)', t => {
  const token = JWT.sign({ nbf: epoch + 1 }, key, { iat: false })
  JWT.verify(token, key, { now, clockTolerance: '1s' })
  t.pass()
})

test('nbf check (failed)', t => {
  const token = JWT.sign({ nbf: epoch + 10 }, key, { iat: false })
  t.throws(() => {
    JWT.verify(token, key, { now })
  }, { instanceOf: errors.JWTClaimInvalid, message: 'token is not active yet' })
})

test('nbf check (passed because of ignoreIat)', t => {
  const token = JWT.sign({ nbf: epoch + 10 }, key, { iat: false })
  JWT.verify(token, key, { now, ignoreNbf: true })
  t.pass()
})

{
  // JWT options.profile
  test('must be a supported value', t => {
    t.throws(() => {
      JWT.verify('foo', key, { profile: 'foo' })
    }, { instanceOf: TypeError, message: 'unsupported options.profile value "foo"' })
  })

  const token = JWT.sign({ }, key, { expiresIn: '10m', subject: 'subject', issuer: 'issuer', audience: 'client_id' })

  test('profile=id_token requires issuer option too', t => {
    t.throws(() => {
      JWT.verify(token, key, { profile: 'id_token' })
    }, { instanceOf: TypeError, message: '"issuer" option is required to validate an ID Token' })
  })

  test('profile=id_token requires audience option too', t => {
    t.throws(() => {
      JWT.verify(token, key, { profile: 'id_token', issuer: 'issuer' })
    }, { instanceOf: TypeError, message: '"audience" option is required to validate an ID Token' })
  })

  test('profile=id_token mandates exp to be present', t => {
    t.throws(() => {
      JWT.verify(
        JWT.sign({ }, key, { subject: 'subject', issuer: 'issuer', audience: 'client_id' }),
        key,
        { profile: 'id_token', issuer: 'issuer', audience: 'client_id' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: '"exp" claim is missing' })
  })

  test('profile=id_token mandates iat to be present', t => {
    t.throws(() => {
      JWT.verify(
        JWT.sign({ }, key, { expiresIn: '10m', iat: false, subject: 'subject', issuer: 'issuer', audience: 'client_id' }),
        key,
        { profile: 'id_token', issuer: 'issuer', audience: 'client_id' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: '"iat" claim is missing' })
  })

  test('profile=id_token mandates sub to be present', t => {
    t.throws(() => {
      JWT.verify(
        JWT.sign({ }, key, { expiresIn: '10m', issuer: 'issuer', audience: 'client_id' }),
        key,
        { profile: 'id_token', issuer: 'issuer', audience: 'client_id' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: '"sub" claim is missing' })
  })

  test('profile=id_token mandates iss to be present', t => {
    t.throws(() => {
      JWT.verify(
        JWT.sign({ }, key, { expiresIn: '10m', subject: 'subject', audience: 'client_id' }),
        key,
        { profile: 'id_token', issuer: 'issuer', audience: 'client_id' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: '"iss" claim is missing' })
  })

  test('profile=id_token mandates aud to be present', t => {
    t.throws(() => {
      JWT.verify(
        JWT.sign({ }, key, { expiresIn: '10m', subject: 'subject', issuer: 'issuer' }),
        key,
        { profile: 'id_token', issuer: 'issuer', audience: 'client_id' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: '"aud" claim is missing' })
  })

  test('profile=id_token mandates azp to be present when multiple audiences are used', t => {
    t.throws(() => {
      JWT.verify(
        JWT.sign({ }, key, { expiresIn: '10m', subject: 'subject', issuer: 'issuer', audience: ['client_id', 'another audience'] }),
        key,
        { profile: 'id_token', issuer: 'issuer', audience: 'client_id' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: '"azp" claim is missing' })
  })

  test('profile=id_token mandates azp to match the audience when required', t => {
    t.throws(() => {
      JWT.verify(
        JWT.sign({ azp: 'mismatched' }, key, { expiresIn: '10m', subject: 'subject', issuer: 'issuer', audience: ['client_id', 'another audience'] }),
        key,
        { profile: 'id_token', issuer: 'issuer', audience: 'client_id' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: 'azp mismatch' })
  })

  test('profile=id_token validates full id tokens', t => {
    t.notThrows(() => {
      JWT.verify(
        JWT.sign({ azp: 'client_id' }, key, { expiresIn: '10m', subject: 'subject', issuer: 'issuer', audience: ['client_id', 'another audience'] }),
        key,
        { profile: 'id_token', issuer: 'issuer', audience: 'client_id' }
      )
    })
  })
}

test('invalid tokens', t => {
  t.throws(() => {
    JWT.verify(
      'eyJ0eXAiOiJKV1QiLCJraWQiOiIyZTFkYjRmMC1mYmY5LTQxZjYtOGMxYi1hMzczYjgwZmNhYTEiLCJhbGciOiJFUzI1NiIsImlzcyI6Imh0dHBzOi8vaWRlbnRpdHktc3RhZ2luZy5kZWxpdmVyb28uY29tLyIsImNsaWVudCI6ImIyM2I0ZjM1YzIyMTI5NDQxZjMwZDMyYmI5ZmM4ZWYyIiwic2lnbmVyIjoiYXJuOmF3czplbGFzdGljbG9hZGJhbGFuY2luZzpldS13ZXN0LTE6NTE3OTAyNjYzOTE1OmxvYWRiYWxhbmNlci9hcHAvcGF5bWVudHMtZGFzaGJvYXJkLXdlYi80YzA4ZGI2NDMyMDIyOWEyIiwiZXhwIjoxNTYyNjkxNTg1fQ==.eyJlbWFpbCI6ImpvYW8udmllaXJhQGRlbGl2ZXJvby5jby51ayIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmYW1pbHlfbmFtZSI6Ikd1ZXJyYSBWaWVpcmEiLCJnaXZlbl9uYW1lIjoiSm9hbyIsIm5hbWUiOiJKb2FvIEd1ZXJyYSBWaWVpcmEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy1sTUpXTXV3R1dpYy9BQUFBQUFBQUFBSS9BQUFBQUFBQUFCVS9lNGtkTDg5UjlqZy9zOTYtYy9waG90by5qcGciLCJzdWIiOiIxMWE1YmFmMGRjNzcwNWRmMzk1ZTMzYWFkZjU2MDk4OCIsImV4cCI6MTU2MjY5MTU4NSwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS1zdGFnaW5nLmRlbGl2ZXJvby5jb20vIn0=.DSHLJXLOfLJ-ZYcX0Vlii6Ak_jcDSkKOvNRj_rvtAyY9uYXtwo798ZrR35fgut-LuCdx0aKz2SgK0KJqw5q6dA==',
      key
    )
  }, { instanceOf: errors.JOSEInvalidEncoding, code: 'ERR_JOSE_INVALID_ENCODING', message: 'input is not a valid base64url encoded string' })
})
