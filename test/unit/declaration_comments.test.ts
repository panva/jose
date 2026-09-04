import test from 'ava'
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const processor = fileURLToPath(new URL('../../tools/declaration-comments.js', import.meta.url))

test('tools/declaration-comments.js', (t) => {
  const cwd = mkdtempSync(join(tmpdir(), 'jose-declaration-comments-'))
  const types = join(cwd, 'dist', 'types')
  const declaration = join(types, 'example.d.ts')

  t.teardown(() => rmSync(cwd, { recursive: true }))
  const input = `/**
 * Module documentation.
 *
 * @module
 */
import type * as types from './types.d.ts'
/**
 * First summary.
 *
 * Extended documentation only needed on the generated documentation page.
 *
 * > [!WARNING]\\
 * > Do not ignore this.
 *
 * This function is exported from the main module entry point as well as from its subpath export.
 *
 * @example
 *
 * \`\`\`ts
 * @deprecated This is example code, not a tag.
 * \`\`\`
 *
 * @typeParam T Type parameter documentation.
 * @see https://example.com
 * @deprecated Use next instead.
 * @param value Input value.
 * @param options JWS Verify options.
 * @param protectedHeader JWS Protected Header. Must contain an "alg" property.
 * @returns The result.
 * @throws When the input is invalid.
 */
export declare function example<T>(
  value: T,
  options?: unknown,
  protectedHeader?: unknown,
): types.KeyLike
/**
 * > [!NOTE]
 * > Alerts can precede a summary.
 *
 * Summary after the alert.
 */
export interface AlertFirst {}
export interface Options {
  /**
   * Member summary with contractual behavior.
   *
   * Extended generated documentation.
   *
   * @see https://example.com/options
   */
  option?: boolean
}
/**
 * Internal helper summary.
 *
 * Additional internal documentation.
 *
 * @internal
 */
export interface InternalHelper {}
`

  mkdirSync(types, { recursive: true })
  writeFileSync(declaration, input)
  const errorTypes = join(types, 'util')
  mkdirSync(errorTypes)
  const errors = join(errorTypes, 'errors.d.ts')
  writeFileSync(
    errors,
    `export declare class JOSEError {
  /**
   * A unique error code for {@link JOSEError}. Each subclass sets its own.
   */
  code: string
}
export declare class JWTExpired extends JOSEError {
  /** A unique error code for {@link JWTExpired}. */
  code: string
}
`,
  )
  const env = { ...process.env }
  delete env.NODE_OPTIONS
  const output = execFileSync(process.execPath, [processor], { cwd, env, encoding: 'utf8' })

  t.is(output, 'rewrote 6 declaration comment(s) for editor hovers\n')
  const expected = `import type * as t from './types.d.ts'
/**
 * First summary.
 *
 * > Warning: Do not ignore this.
 *
 * @deprecated Use next instead.
 * @param value Input value.
 * @param protectedHeader JWS Protected Header. Must contain an "alg" property.
 * @returns The result.
 * @throws When the input is invalid.
 */
export declare function example<T>(
  value: T,
  options?: unknown,
  protectedHeader?: unknown,
): t.KeyLike
/**
 * > Note: Alerts can precede a summary.
 *
 * Summary after the alert.
 */
export interface AlertFirst {}
export interface Options {
  /** Member summary with contractual behavior. */
  option?: boolean
}
/** Internal helper summary. */
export interface InternalHelper {}
`

  t.is(readFileSync(declaration, 'utf8'), expected)
  t.is(
    readFileSync(errors, 'utf8'),
    `export declare class JOSEError {
  /**
   * A unique error code for {@link JOSEError}. Each subclass sets its own.
   */
  code: string
}
export declare class JWTExpired extends JOSEError {
  code: string
}
`,
  )
  t.is(
    execFileSync(process.execPath, [processor], { cwd, env, encoding: 'utf8' }),
    'rewrote 0 declaration comment(s) for editor hovers\n',
  )
  t.is(readFileSync(declaration, 'utf8'), expected)

  writeFileSync(declaration, input)
  const privateTypes = join(types, 'lib')
  mkdirSync(privateTypes)
  writeFileSync(
    join(privateTypes, 'private.d.ts'),
    `/**
 * Private declaration documentation.
 *
 * @module
 */
export interface PrivateDeclaration {}
`,
  )

  const report = execFileSync(process.execPath, [processor], {
    cwd,
    env: { ...env, JOSE_DEBUG_TYPES: '1' },
    encoding: 'utf8',
  })

  t.true(report.startsWith('stripped published declaration documentation\n\n'))
  t.true(report.includes('dist/types/example.d.ts:1\n- Module documentation.'))
  t.true(
    report.includes('- Extended documentation only needed on the generated documentation page.'),
  )
  t.true(report.includes('- @example'))
  t.true(report.includes('- @typeParam T Type parameter documentation.'))
  t.true(report.includes('- @see https://example.com'))
  t.true(report.includes('- @internal'))
  t.false(report.includes('- @deprecated Use next instead.'))
  t.false(report.includes('private.d.ts'))
  t.true(report.endsWith('rewrote 6 declaration comment(s) for editor hovers\n'))
  t.is(readFileSync(declaration, 'utf8'), expected)
})
