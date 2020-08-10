const test = require('ava')

const { JWS, JWT, JWK, JWKS, errors } = require('../..')

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

test('options.issuer must be string or array of strings', t => {
  ;['', false, [], Buffer, Buffer.from('foo'), 0, Infinity].forEach((val) => {
    t.throws(() => {
      JWT.verify(token, key, { issuer: val })
    }, { instanceOf: TypeError, message: 'options.issuer must be a string or an array of strings' })
    t.throws(() => {
      JWT.verify(token, key, { issuer: [val] })
    }, { instanceOf: TypeError, message: 'options.issuer must be a string or an array of strings' })
  })
})

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
      const err = t.throws(() => {
        const invalid = JWS.sign({ [claim]: val }, key)
        JWT.verify(invalid, key)
      }, { instanceOf: errors.JWTClaimInvalid, message: `"${claim}" claim must be a JSON numeric value` })

      t.is(err.claim, claim)
      t.is(err.reason, 'invalid')
    })
  })
})

;['jti', 'acr', 'nonce', 'sub', 'azp'].forEach((claim) => {
  test(`"${claim} must be a string when provided"`, t => {
    ;['', 0, 1, true, null, [], {}].forEach((val) => {
      const err = t.throws(() => {
        const invalid = JWS.sign({ [claim]: val }, key)
        JWT.verify(invalid, key)
      }, { instanceOf: errors.JWTClaimInvalid, message: `"${claim}" claim must be a string` })

      t.is(err.claim, claim)
      t.is(err.reason, 'invalid')
    })
  })
})

;['aud', 'amr', 'iss'].forEach((claim) => {
  test(`"${claim} must be a string when provided"`, t => {
    ;['', 0, 1, true, null, [], {}].forEach((val) => {
      let err
      err = t.throws(() => {
        const invalid = JWS.sign({ [claim]: val }, key)
        JWT.verify(invalid, key)
      }, { instanceOf: errors.JWTClaimInvalid, message: `"${claim}" claim must be a string or array of strings` })
      t.is(err.claim, claim)
      t.is(err.reason, 'invalid')

      err = t.throws(() => {
        const invalid = JWS.sign({ [claim]: [val] }, key)
        JWT.verify(invalid, key)
      }, { instanceOf: errors.JWTClaimInvalid, message: `"${claim}" claim must be a string or array of strings` })
      t.is(err.claim, claim)
      t.is(err.reason, 'invalid')
    })
  })
})

Object.entries({
  issuer: 'iss',
  jti: 'jti',
  nonce: 'nonce',
  subject: 'sub'
}).forEach(([option, claim]) => {
  test(`option.${option} validation fails`, t => {
    let err
    err = t.throws(() => {
      const invalid = JWS.sign({ [claim]: 'foo' }, key)
      JWT.verify(invalid, key, { [option]: 'bar' })
    }, { instanceOf: errors.JWTClaimInvalid, message: `unexpected "${claim}" claim value` })
    t.is(err.claim, claim)
    t.is(err.reason, 'check_failed')

    err = t.throws(() => {
      const invalid = JWS.sign({ [claim]: undefined }, key)
      JWT.verify(invalid, key, { [option]: 'bar' })
    }, { instanceOf: errors.JWTClaimInvalid, message: `"${claim}" claim is missing` })
    t.is(err.claim, claim)
    t.is(err.reason, 'missing')
  })

  test(`option.${option} validation success`, t => {
    const token = JWT.sign({ [claim]: 'foo' }, key)
    JWT.verify(token, key, { [option]: 'foo' })
    t.pass()
  })
})

test('option.typ validation fails', t => {
  let err
  err = t.throws(() => {
    const invalid = JWT.sign({}, key, { header: { typ: 'foo' } })
    JWT.verify(invalid, key, { typ: 'bar' })
  }, { instanceOf: errors.JWTClaimInvalid, message: 'unexpected "typ" JWT header value' })
  t.is(err.claim, 'typ')
  t.is(err.reason, 'check_failed')

  err = t.throws(() => {
    const invalid = JWS.sign({}, key, { header: { typ: undefined } })
    JWT.verify(invalid, key, { typ: 'bar' })
  }, { instanceOf: errors.JWTClaimInvalid, message: '"typ" header parameter is missing' })
  t.is(err.claim, 'typ')
  t.is(err.reason, 'missing')
})

test('option.typ validation success', t => {
  {
    const token = JWT.sign({}, key, { header: { typ: 'foo' } })
    JWT.verify(token, key, { typ: 'foo' })
  }
  {
    const token = JWT.sign({}, key, { header: { typ: 'application/foo' } })
    JWT.verify(token, key, { typ: 'foo' })
  }
  {
    const token = JWT.sign({}, key, { header: { typ: 'foo' } })
    JWT.verify(token, key, { typ: 'application/foo' })
  }
  {
    const token = JWT.sign({}, key, { header: { typ: 'foO' } })
    JWT.verify(token, key, { typ: 'application/foo' })
  }
  {
    const token = JWT.sign({}, key, { header: { typ: 'application/foo' } })
    JWT.verify(token, key, { typ: 'fOo' })
  }
  t.pass()
})

test('option.audience validation fails', t => {
  let err
  err = t.throws(() => {
    const invalid = JWS.sign({ aud: 'foo' }, key)
    JWT.verify(invalid, key, { audience: 'bar' })
  }, { instanceOf: errors.JWTClaimInvalid, message: 'unexpected "aud" claim value' })
  t.is(err.claim, 'aud')
  t.is(err.reason, 'check_failed')

  err = t.throws(() => {
    const invalid = JWS.sign({ aud: ['foo'] }, key)
    JWT.verify(invalid, key, { audience: 'bar' })
  }, { instanceOf: errors.JWTClaimInvalid, message: 'unexpected "aud" claim value' })
  t.is(err.claim, 'aud')
  t.is(err.reason, 'check_failed')
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
  const err = t.throws(() => {
    const invalid = JWS.sign({}, key)
    JWT.verify(invalid, key, { maxAuthAge: '30s' })
  }, { instanceOf: errors.JWTClaimInvalid, message: '"auth_time" claim is missing' })
  t.is(err.claim, 'auth_time')
  t.is(err.reason, 'missing')
})

const epoch = 1265328501
const now = new Date(epoch * 1000)

test('option.maxAuthAge checks auth_time', t => {
  const err = t.throws(() => {
    const invalid = JWS.sign({ auth_time: epoch - 31 }, key)
    JWT.verify(invalid, key, { maxAuthAge: '30s', now })
  }, { instanceOf: errors.JWTClaimInvalid, message: '"auth_time" claim timestamp check failed (too much time has elapsed since the last End-User authentication)' })
  t.is(err.claim, 'auth_time')
  t.is(err.reason, 'check_failed')
})

test('option.maxAuthAge checks auth_time (with tolerance)', t => {
  const token = JWT.sign({ auth_time: epoch - 31 }, key, { now })
  JWT.verify(token, key, { maxAuthAge: '30s', now, clockTolerance: '1s' })
  t.pass()
})

test('option.maxTokenAge requires iat to be in the payload', t => {
  const err = t.throws(() => {
    const invalid = JWS.sign({}, key)
    JWT.verify(invalid, key, { maxTokenAge: '30s' })
  }, { instanceOf: errors.JWTClaimInvalid, message: '"iat" claim is missing' })
  t.is(err.claim, 'iat')
  t.is(err.reason, 'missing')
})

test('option.maxTokenAge checks iat elapsed time', t => {
  const err = t.throws(() => {
    const invalid = JWS.sign({ iat: epoch - 31 }, key)
    JWT.verify(invalid, key, { maxTokenAge: '30s', now })
  }, { instanceOf: errors.JWTExpired, code: 'ERR_JWT_EXPIRED', message: '"iat" claim timestamp check failed (too far in the past)' })
  t.true(err instanceof errors.JWTClaimInvalid)
  t.is(err.claim, 'iat')
  t.is(err.reason, 'check_failed')
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
  const err = t.throws(() => {
    JWT.verify(token, key, { now })
  }, { instanceOf: errors.JWTClaimInvalid, message: '"iat" claim timestamp check failed (it should be in the past)' })
  t.is(err.claim, 'iat')
  t.is(err.reason, 'check_failed')
})

test('iat future check (ignored since exp is also present)', t => {
  const token = JWT.sign({}, key, { now: new Date((epoch + 1) * 1000), expiresIn: '2h' })
  JWT.verify(token, key, { now })
  t.pass()
})

test('iat future check (part of maxTokenAge)', t => {
  const token = JWT.sign({}, key, { now: new Date((epoch + 1) * 1000), expiresIn: '2h' })
  const err = t.throws(() => {
    JWT.verify(token, key, { now, maxTokenAge: '30s' })
  }, { instanceOf: errors.JWTClaimInvalid, message: '"iat" claim timestamp check failed (it should be in the past)' })
  t.is(err.claim, 'iat')
  t.is(err.reason, 'check_failed')
})

test('iat future check with tolerance (part of maxTokenAge)', t => {
  const token = JWT.sign({}, key, { now: new Date((epoch + 1) * 1000), expiresIn: '2h' })
  JWT.verify(token, key, { now, maxTokenAge: '30s', clockTolerance: '1s' })
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
  const err = t.throws(() => {
    JWT.verify(token, key, { now })
  }, { instanceOf: errors.JWTExpired, code: 'ERR_JWT_EXPIRED', message: '"exp" claim timestamp check failed' })
  t.true(err instanceof errors.JWTClaimInvalid)
  t.is(err.claim, 'exp')
  t.is(err.reason, 'check_failed')
})

test('exp check (failed normal)', t => {
  const token = JWT.sign({ exp: epoch - 1 }, key, { iat: false })
  const err = t.throws(() => {
    JWT.verify(token, key, { now })
  }, { instanceOf: errors.JWTExpired, code: 'ERR_JWT_EXPIRED', message: '"exp" claim timestamp check failed' })
  t.true(err instanceof errors.JWTClaimInvalid)
  t.is(err.claim, 'exp')
  t.is(err.reason, 'check_failed')
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
  const err = t.throws(() => {
    JWT.verify(token, key, { now })
  }, { instanceOf: errors.JWTClaimInvalid, message: '"nbf" claim timestamp check failed' })
  t.is(err.claim, 'nbf')
  t.is(err.reason, 'check_failed')
})

test('nbf check (passed because of ignoreIat)', t => {
  const token = JWT.sign({ nbf: epoch + 10 }, key, { iat: false })
  JWT.verify(token, key, { now, ignoreNbf: true })
  t.pass()
})

// JWT options.profile
test('must be a supported value', t => {
  t.throws(() => {
    JWT.verify('foo', key, { profile: 'foo' })
  }, { instanceOf: TypeError, message: 'unsupported options.profile value "foo"' })
})

{
  const token = JWT.sign({ }, key, { expiresIn: '10m', subject: 'subject', issuer: 'issuer', audience: 'client_id' })

  test('profile=id_token', t => {
    JWT.verify(token, key, { profile: 'id_token', issuer: 'issuer', audience: 'client_id' })
    JWT.IdToken.verify(token, key, { issuer: 'issuer', audience: 'client_id' })
    t.pass()
  })

  test('profile=id_token requires issuer option too', t => {
    t.throws(() => {
      JWT.verify(token, key, { profile: 'id_token' })
    }, { instanceOf: TypeError, message: '"issuer" option is required to validate an ID Token' })
    t.throws(() => {
      JWT.IdToken.verify(token, key)
    }, { instanceOf: TypeError, message: '"issuer" option is required to validate an ID Token' })
  })

  test('profile=id_token requires audience option too', t => {
    t.throws(() => {
      JWT.verify(token, key, { profile: 'id_token', issuer: 'issuer' })
    }, { instanceOf: TypeError, message: '"audience" option is required to validate an ID Token' })
    t.throws(() => {
      JWT.IdToken.verify(token, key, { issuer: 'issuer' })
    }, { instanceOf: TypeError, message: '"audience" option is required to validate an ID Token' })
  })

  test('profile=id_token mandates exp to be present', t => {
    const err = t.throws(() => {
      JWT.verify(
        JWT.sign({ }, key, { subject: 'subject', issuer: 'issuer', audience: 'client_id' }),
        key,
        { profile: 'id_token', issuer: 'issuer', audience: 'client_id' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: '"exp" claim is missing' })
    t.is(err.claim, 'exp')
    t.is(err.reason, 'missing')
  })

  test('profile=id_token mandates iat to be present', t => {
    const err = t.throws(() => {
      JWT.verify(
        JWT.sign({ }, key, { expiresIn: '10m', iat: false, subject: 'subject', issuer: 'issuer', audience: 'client_id' }),
        key,
        { profile: 'id_token', issuer: 'issuer', audience: 'client_id' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: '"iat" claim is missing' })
    t.is(err.claim, 'iat')
    t.is(err.reason, 'missing')
  })

  test('profile=id_token mandates sub to be present', t => {
    const err = t.throws(() => {
      JWT.verify(
        JWT.sign({ }, key, { expiresIn: '10m', issuer: 'issuer', audience: 'client_id' }),
        key,
        { profile: 'id_token', issuer: 'issuer', audience: 'client_id' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: '"sub" claim is missing' })
    t.is(err.claim, 'sub')
    t.is(err.reason, 'missing')
  })

  test('profile=id_token mandates iss to be present', t => {
    const err = t.throws(() => {
      JWT.verify(
        JWT.sign({ }, key, { expiresIn: '10m', subject: 'subject', audience: 'client_id' }),
        key,
        { profile: 'id_token', issuer: 'issuer', audience: 'client_id' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: '"iss" claim is missing' })
    t.is(err.claim, 'iss')
    t.is(err.reason, 'missing')
  })

  test('profile=id_token mandates aud to be present', t => {
    const err = t.throws(() => {
      JWT.verify(
        JWT.sign({ }, key, { expiresIn: '10m', subject: 'subject', issuer: 'issuer' }),
        key,
        { profile: 'id_token', issuer: 'issuer', audience: 'client_id' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: '"aud" claim is missing' })
    t.is(err.claim, 'aud')
    t.is(err.reason, 'missing')
  })

  test('profile=id_token mandates azp to be present when multiple audiences are used', t => {
    const err = t.throws(() => {
      JWT.verify(
        JWT.sign({ }, key, { expiresIn: '10m', subject: 'subject', issuer: 'issuer', audience: ['client_id', 'another audience'] }),
        key,
        { profile: 'id_token', issuer: 'issuer', audience: 'client_id' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: '"azp" claim is missing' })
    t.is(err.claim, 'azp')
    t.is(err.reason, 'missing')
  })

  test('profile=id_token mandates azp to match the audience when required', t => {
    const err = t.throws(() => {
      JWT.verify(
        JWT.sign({ azp: 'mismatched' }, key, { expiresIn: '10m', subject: 'subject', issuer: 'issuer', audience: ['client_id', 'another audience'] }),
        key,
        { profile: 'id_token', issuer: 'issuer', audience: 'client_id' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: 'unexpected "azp" claim value' })
    t.is(err.claim, 'azp')
    t.is(err.reason, 'check_failed')
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

{
  const token = JWT.sign({
    events: {
      'http://schemas.openid.net/event/backchannel-logout': {}
    }
  }, key, { jti: 'foo', subject: 'subject', issuer: 'issuer', audience: 'client_id' })

  test('profile=logout_token', t => {
    JWT.verify(token, key, { profile: 'logout_token', issuer: 'issuer', audience: 'client_id' })
    JWT.LogoutToken.verify(token, key, { issuer: 'issuer', audience: 'client_id' })
    t.pass()
  })

  test('profile=logout_token requires issuer option too', t => {
    t.throws(() => {
      JWT.verify(token, key, { profile: 'logout_token' })
    }, { instanceOf: TypeError, message: '"issuer" option is required to validate a Logout Token' })
    t.throws(() => {
      JWT.LogoutToken.verify(token, key)
    }, { instanceOf: TypeError, message: '"issuer" option is required to validate a Logout Token' })
  })

  test('profile=logout_token requires audience option too', t => {
    t.throws(() => {
      JWT.verify(token, key, { profile: 'logout_token', issuer: 'issuer' })
    }, { instanceOf: TypeError, message: '"audience" option is required to validate a Logout Token' })
    t.throws(() => {
      JWT.LogoutToken.verify(token, key, { issuer: 'issuer' })
    }, { instanceOf: TypeError, message: '"audience" option is required to validate a Logout Token' })
  })

  test('profile=logout_token mandates jti to be present', t => {
    const err = t.throws(() => {
      JWT.verify(
        JWT.sign({ }, key, { subject: 'subject', issuer: 'issuer', audience: 'client_id' }),
        key,
        { profile: 'logout_token', issuer: 'issuer', audience: 'client_id' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: '"jti" claim is missing' })
    t.is(err.claim, 'jti')
    t.is(err.reason, 'missing')
  })

  test('profile=logout_token mandates events to be present', t => {
    const err = t.throws(() => {
      JWT.verify(
        JWT.sign({ }, key, { jti: 'foo', subject: 'subject', issuer: 'issuer', audience: 'client_id' }),
        key,
        { profile: 'logout_token', issuer: 'issuer', audience: 'client_id' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: '"events" claim is missing' })
    t.is(err.claim, 'events')
    t.is(err.reason, 'missing')
  })

  test('profile=logout_token mandates events to be an object', t => {
    const err = t.throws(() => {
      JWT.verify(
        JWT.sign({
          events: []
        }, key, { jti: 'foo', subject: 'subject', issuer: 'issuer', audience: 'client_id' }),
        key,
        { profile: 'logout_token', issuer: 'issuer', audience: 'client_id' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: '"events" claim must be an object' })
    t.is(err.claim, 'events')
    t.is(err.reason, 'invalid')
  })

  test('profile=logout_token mandates events to have the backchannel logout member', t => {
    const err = t.throws(() => {
      JWT.verify(
        JWT.sign({
          events: {}
        }, key, { jti: 'foo', subject: 'subject', issuer: 'issuer', audience: 'client_id' }),
        key,
        { profile: 'logout_token', issuer: 'issuer', audience: 'client_id' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: '"http://schemas.openid.net/event/backchannel-logout" member is missing in the "events" claim' })
    t.is(err.claim, 'events')
    t.is(err.reason, 'invalid')
  })

  test('profile=logout_token mandates events to have the backchannel logout member thats an object', t => {
    const err = t.throws(() => {
      JWT.verify(
        JWT.sign({
          events: {
            'http://schemas.openid.net/event/backchannel-logout': []
          }
        }, key, { jti: 'foo', subject: 'subject', issuer: 'issuer', audience: 'client_id' }),
        key,
        { profile: 'logout_token', issuer: 'issuer', audience: 'client_id' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: '"http://schemas.openid.net/event/backchannel-logout" member in the "events" claim must be an object' })
    t.is(err.claim, 'events')
    t.is(err.reason, 'invalid')
  })

  test('profile=logout_token mandates iat to be present', t => {
    const err = t.throws(() => {
      JWT.verify(
        JWT.sign({ }, key, { jti: 'foo', iat: false, subject: 'subject', issuer: 'issuer', audience: 'client_id' }),
        key,
        { profile: 'logout_token', issuer: 'issuer', audience: 'client_id' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: '"iat" claim is missing' })
    t.is(err.claim, 'iat')
    t.is(err.reason, 'missing')
  })

  test('profile=logout_token mandates sub or sid to be present', t => {
    const err = t.throws(() => {
      JWT.verify(
        JWT.sign({ }, key, { jti: 'foo', issuer: 'issuer', audience: 'client_id' }),
        key,
        { profile: 'logout_token', issuer: 'issuer', audience: 'client_id' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: 'either "sid" or "sub" (or both) claims must be present' })
    t.is(err.claim, 'unspecified')
    t.is(err.reason, 'unspecified')
  })

  test('profile=logout_token mandates sid to be a string when present', t => {
    const err = t.throws(() => {
      JWT.verify(
        JWT.sign({ sid: true }, key, { jti: 'foo', issuer: 'issuer', audience: 'client_id' }),
        key,
        { profile: 'logout_token', issuer: 'issuer', audience: 'client_id' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: '"sid" claim must be a string' })
    t.is(err.claim, 'sid')
    t.is(err.reason, 'invalid')
  })

  test('profile=logout_token prohibits nonce', t => {
    const err = t.throws(() => {
      JWT.verify(
        JWT.sign({ nonce: 'foo' }, key, { subject: 'subject', jti: 'foo', issuer: 'issuer', audience: 'client_id' }),
        key,
        { profile: 'logout_token', issuer: 'issuer', audience: 'client_id' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: '"nonce" claim is prohibited' })
    t.is(err.claim, 'nonce')
    t.is(err.reason, 'prohibited')
  })

  test('profile=logout_token mandates iss to be present', t => {
    const err = t.throws(() => {
      JWT.verify(
        JWT.sign({ }, key, { jti: 'foo', subject: 'subject', audience: 'client_id' }),
        key,
        { profile: 'logout_token', issuer: 'issuer', audience: 'client_id' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: '"iss" claim is missing' })
    t.is(err.claim, 'iss')
    t.is(err.reason, 'missing')
  })

  test('profile=logout_token mandates aud to be present', t => {
    const err = t.throws(() => {
      JWT.verify(
        JWT.sign({ }, key, { jti: 'foo', subject: 'subject', issuer: 'issuer' }),
        key,
        { profile: 'logout_token', issuer: 'issuer', audience: 'client_id' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: '"aud" claim is missing' })
    t.is(err.claim, 'aud')
    t.is(err.reason, 'missing')
  })
}

{
  const token = JWT.sign({ client_id: 'client_id' }, key, { expiresIn: '10m', subject: 'subject', issuer: 'issuer', audience: 'RS', jti: 'random', header: { typ: 'at+JWT' } })

  test('profile=at+JWT', t => {
    JWT.verify(token, key, { profile: 'at+JWT', issuer: 'issuer', audience: 'RS' })
    JWT.AccessToken.verify(token, key, { issuer: 'issuer', audience: 'RS' })
    t.pass()
  })

  test('profile=at+JWT requires issuer option too', t => {
    t.throws(() => {
      JWT.verify(token, key, { profile: 'at+JWT' })
    }, { instanceOf: TypeError, message: '"issuer" option is required to validate a JWT Access Token' })
    t.throws(() => {
      JWT.AccessToken.verify(token, key)
    }, { instanceOf: TypeError, message: '"issuer" option is required to validate a JWT Access Token' })
  })

  test('profile=at+JWT requires audience option too', t => {
    t.throws(() => {
      JWT.verify(token, key, { profile: 'at+JWT', issuer: 'issuer' })
    }, { instanceOf: TypeError, message: '"audience" option is required to validate a JWT Access Token' })
    t.throws(() => {
      JWT.AccessToken.verify(token, key, { issuer: 'issuer' })
    }, { instanceOf: TypeError, message: '"audience" option is required to validate a JWT Access Token' })
  })

  test('profile=at+JWT mandates exp to be present', t => {
    const err = t.throws(() => {
      JWT.verify(
        JWT.sign({ client_id: 'client_id' }, key, { subject: 'subject', issuer: 'issuer', audience: 'RS', jti: 'random', header: { typ: 'at+JWT' } }),
        key,
        { profile: 'at+JWT', issuer: 'issuer', audience: 'RS' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: '"exp" claim is missing' })
    t.is(err.claim, 'exp')
    t.is(err.reason, 'missing')
  })

  test('profile=at+JWT mandates client_id to be present', t => {
    const err = t.throws(() => {
      JWT.verify(
        JWT.sign({ }, key, { expiresIn: '10m', subject: 'subject', issuer: 'issuer', audience: 'RS', jti: 'random', header: { typ: 'at+JWT' } }),
        key,
        { profile: 'at+JWT', issuer: 'issuer', audience: 'RS' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: '"client_id" claim is missing' })
    t.is(err.claim, 'client_id')
    t.is(err.reason, 'missing')
  })

  test('profile=at+JWT mandates jti to be present', t => {
    const err = t.throws(() => {
      JWT.verify(
        JWT.sign({ }, key, { expiresIn: '10m', subject: 'subject', issuer: 'issuer', audience: 'RS' }),
        key,
        { profile: 'at+JWT', issuer: 'issuer', audience: 'RS' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: '"jti" claim is missing' })
    t.is(err.claim, 'jti')
    t.is(err.reason, 'missing')
  })

  test('profile=at+JWT mandates iat to be present', t => {
    const err = t.throws(() => {
      JWT.verify(
        JWT.sign({ }, key, { expiresIn: '10m', subject: 'subject', issuer: 'issuer', audience: 'RS', iat: false }),
        key,
        { profile: 'at+JWT', issuer: 'issuer', audience: 'RS' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: '"iat" claim is missing' })
    t.is(err.claim, 'iat')
    t.is(err.reason, 'missing')
  })

  test('profile=at+JWT mandates sub to be present', t => {
    const err = t.throws(() => {
      JWT.verify(
        JWT.sign({ client_id: 'client_id' }, key, { expiresIn: '10m', issuer: 'issuer', audience: 'RS', jti: 'random', header: { typ: 'at+JWT' } }),
        key,
        { profile: 'at+JWT', issuer: 'issuer', audience: 'RS' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: '"sub" claim is missing' })
    t.is(err.claim, 'sub')
    t.is(err.reason, 'missing')
  })

  test('profile=at+JWT mandates iss to be present', t => {
    const err = t.throws(() => {
      JWT.verify(
        JWT.sign({ client_id: 'client_id' }, key, { expiresIn: '10m', subject: 'subject', audience: 'RS', jti: 'random', header: { typ: 'at+JWT' } }),
        key,
        { profile: 'at+JWT', issuer: 'issuer', audience: 'RS' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: '"iss" claim is missing' })
    t.is(err.claim, 'iss')
    t.is(err.reason, 'missing')
  })

  test('profile=at+JWT mandates aud to be present', t => {
    const err = t.throws(() => {
      JWT.verify(
        JWT.sign({ client_id: 'client_id' }, key, { expiresIn: '10m', subject: 'subject', issuer: 'issuer', jti: 'random', header: { typ: 'at+JWT' } }),
        key,
        { profile: 'at+JWT', issuer: 'issuer', audience: 'RS' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: '"aud" claim is missing' })
    t.is(err.claim, 'aud')
    t.is(err.reason, 'missing')
  })

  test('profile=at+JWT mandates header typ to be present', t => {
    const err = t.throws(() => {
      JWT.verify(
        JWT.sign({ client_id: 'client_id' }, key, { expiresIn: '10m', subject: 'subject', audience: 'RS', jti: 'random', issuer: 'issuer' }),
        key,
        { profile: 'at+JWT', issuer: 'issuer', audience: 'RS' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: '"typ" header parameter is missing' })
    t.is(err.claim, 'typ')
    t.is(err.reason, 'missing')
  })

  test('profile=at+JWT mandates header typ to be present and of the right value', t => {
    const err = t.throws(() => {
      JWT.verify(
        JWT.sign({ client_id: 'client_id' }, key, { expiresIn: '10m', subject: 'subject', audience: 'RS', jti: 'random', issuer: 'issuer', header: { typ: 'JWT' } }),
        key,
        { profile: 'at+JWT', issuer: 'issuer', audience: 'RS' }
      )
    }, { instanceOf: errors.JWTClaimInvalid, message: 'unexpected "typ" JWT header value' })
    t.is(err.claim, 'typ')
    t.is(err.reason, 'check_failed')
  })
}
