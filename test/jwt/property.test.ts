import test from 'ava'
import fc from 'fast-check'

import { SignJWT, jwtVerify } from '../../src/index.js'

const key = new Uint8Array(32)
const timestamp = fc.integer({ min: 946_684_800, max: 4_102_444_800 })
const tolerance = fc.integer({ min: 0, max: 120 })
const boundaryDelta = fc.integer({ min: -3, max: 3 })
const options = { numRuns: 100 }

async function sign(claims: { nbf?: number; exp?: number; iat?: number }) {
  return new SignJWT(claims).setProtectedHeader({ alg: 'HS256' }).sign(key)
}

test('JWT nbf validation accepts exactly through the clock tolerance boundary', async (t) => {
  await fc.assert(
    fc.asyncProperty(timestamp, tolerance, boundaryDelta, async (now, clockTolerance, delta) => {
      const nbf = now + clockTolerance + delta
      const jwt = await sign({ nbf })
      const verification = jwtVerify(jwt, key, {
        clockTolerance,
        currentDate: new Date(now * 1000),
      })

      if (nbf <= now + clockTolerance) {
        const { payload } = await verification
        t.is(payload.nbf, nbf)
      } else {
        const error = await t.throwsAsync(verification, {
          code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
          message: '"nbf" claim timestamp check failed',
        })
        t.like(error, { claim: 'nbf', reason: 'check_failed' })
      }
    }),
    options,
  )
})

test('JWT exp validation rejects exactly at the clock tolerance boundary', async (t) => {
  await fc.assert(
    fc.asyncProperty(timestamp, tolerance, boundaryDelta, async (now, clockTolerance, delta) => {
      const exp = now - clockTolerance + delta
      const jwt = await sign({ exp })
      const verification = jwtVerify(jwt, key, {
        clockTolerance,
        currentDate: new Date(now * 1000),
      })

      if (exp > now - clockTolerance) {
        const { payload } = await verification
        t.is(payload.exp, exp)
      } else {
        const error = await t.throwsAsync(verification, {
          code: 'ERR_JWT_EXPIRED',
          message: '"exp" claim timestamp check failed',
        })
        t.like(error, { claim: 'exp', reason: 'check_failed' })
      }
    }),
    options,
  )
})

test('JWT iat validation enforces both maxTokenAge boundaries with tolerance', async (t) => {
  await fc.assert(
    fc.asyncProperty(
      timestamp,
      tolerance,
      fc.integer({ min: 0, max: 300 }),
      boundaryDelta,
      fc.boolean(),
      async (now, clockTolerance, maxTokenAge, delta, testFutureBoundary) => {
        const age = testFutureBoundary
          ? -clockTolerance + delta
          : maxTokenAge + clockTolerance + delta
        const iat = now - age
        const jwt = await sign({ iat })
        const verification = jwtVerify(jwt, key, {
          clockTolerance,
          currentDate: new Date(now * 1000),
          maxTokenAge,
        })

        if (age < -clockTolerance) {
          const error = await t.throwsAsync(verification, {
            code: 'ERR_JWT_CLAIM_VALIDATION_FAILED',
            message: '"iat" claim timestamp check failed (it should be in the past)',
          })
          t.like(error, { claim: 'iat', reason: 'check_failed' })
        } else if (age - clockTolerance > maxTokenAge) {
          const error = await t.throwsAsync(verification, {
            code: 'ERR_JWT_EXPIRED',
            message: '"iat" claim timestamp check failed (too far in the past)',
          })
          t.like(error, { claim: 'iat', reason: 'check_failed' })
        } else {
          const { payload } = await verification
          t.is(payload.iat, iat)
        }
      },
    ),
    options,
  )
})
