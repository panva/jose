import assert from 'node:assert/strict'
import type { AssertPredicate } from 'node:assert'

type CapturedError = Error & { code?: string }

// Property and regular expression matchers must still reject non-Error thrown values.
export function errorLike(expected: AssertPredicate): (error: unknown) => boolean {
  return (error) => {
    assert.ok(error instanceof Error)
    assert.throws(() => {
      throw error
    }, expected)
    return true
  }
}

// Node's assertions validate exceptions without returning them. These helpers retain the
// validated exception for tests that also inspect its properties.
export function captureError(
  block: () => unknown,
  expected: AssertPredicate = Error,
): CapturedError {
  let caught: unknown
  assert.throws(() => {
    try {
      block()
    } catch (error) {
      caught = error
      throw error
    }
  }, errorLike(expected))
  return caught as CapturedError
}

export async function captureRejection(
  block: Promise<unknown> | (() => Promise<unknown>),
  expected: AssertPredicate = Error,
): Promise<CapturedError> {
  let caught: unknown
  await assert.rejects(async () => {
    try {
      await (typeof block === 'function' ? block() : block)
    } catch (error) {
      caught = error
      throw error
    }
  }, errorLike(expected))
  return caught as CapturedError
}
