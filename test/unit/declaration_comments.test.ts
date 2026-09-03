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
  const publicTypes = join(types, 'types.d.ts')
  const catalog = join(types, 'algorithms', 'jws.d.ts')
  const composable = join(types, 'composable', 'jws', 'compact', 'sign.d.ts')

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
 * @param jws Compact JWS input.
 * @param options Options for this operation.
 * @returns The result.
 * @throws When the input is invalid.
 */
export declare function example<T>(value: T): types.KeyLike
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
export {};
`

  mkdirSync(types, { recursive: true })
  writeFileSync(declaration, input)
  writeFileSync(
    publicTypes,
    `export interface ConsumeFunction<Input, Key, ResolvableKey, Result> {
  /**
   * Processes the JOSE input with a directly supplied key.
   *
   * @param input JOSE input to verify or decrypt.
   * @param key Key or Secret to verify or decrypt with.
   */
  (input: Input, key: Key): Promise<Result>
  /**
   * Processes the JOSE input, resolving the key dynamically.
   *
   * @param input JOSE input to verify or decrypt.
   * @param getKey Function resolving a key or Secret.
   */
  <Resolved extends ResolvableKey>(input: Input, getKey: () => Resolved): Promise<Result>
  /**
   * Accepts either a directly supplied key or a dynamic key resolver.
   *
   * @param input JOSE input to verify or decrypt.
   * @param key Key, Secret, or function resolving one.
   */
  (
    input: Input,
    key: Key | (() => ResolvableKey),
  ): Promise<Result>
}
`,
  )
  mkdirSync(join(types, 'algorithms'))
  writeFileSync(
    catalog,
    `/** Tree-shakeable JWS factories. @module */
import type { JWSAlgorithmFactory } from './types.js'
/** The \`ES256\` JWS algorithm capability factory. */
export declare const ES256: JWSAlgorithmFactory<'ES256'>;
/** The \`HS256\` JWS algorithm capability factory. */
export declare const HS256: JWSAlgorithmFactory<'HS256'>;
/** Represents a JWS algorithm factory. */
export type { JWSAlgorithmFactory } from './types.js'
`,
  )
  writeFileSync(
    join(types, 'algorithms', 'types.d.ts'),
    `/** Internal type machinery explanation. */
export type AlgorithmOf<T> = T
`,
  )
  mkdirSync(join(types, 'composable', 'jws', 'compact'), { recursive: true })
  writeFileSync(
    composable,
    `/** Interface implemented by a composed CompactSign instance. */
export interface CompactSignInstance {
  /** Signs and resolves the JWS. */
  sign(): Promise<string>
}
/** Compact JWS verification result with selected header suggestions. */
export type CompactVerifyResult = { payload: Uint8Array }
/** Key resolver for a composed JWT verifier. */
export interface JWTVerifyGetKey {
  /** Resolves a verification key. */
  get(): Promise<CryptoKey>
}
/** Composes a CompactSign constructor supporting the selected algorithms. */
export declare function composeCompactSign(): CompactSignInstance
`,
  )
  const env = { ...process.env }
  delete env.NODE_OPTIONS
  const output = execFileSync(process.execPath, [processor], { cwd, env, encoding: 'utf8' })

  t.is(output, 'rewrote 13 declaration comment(s) for editor hovers\n')
  const expected = `import type * as t from './types.d.ts'
/**
 * First summary.
 *
 * > Warning: Do not ignore this.
 *
 * @deprecated Use next instead.
 * @param value Input value.
 * @returns The result.
 * @throws When the input is invalid.
 */
export declare function example<T>(value: T): t.KeyLike
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
export {};
`

  t.is(readFileSync(declaration, 'utf8'), expected)
  t.is(
    readFileSync(publicTypes, 'utf8'),
    `export interface ConsumeFunction<Input, Key, ResolvableKey, Result> {
  (input: Input, key: Key): Promise<Result>
  <Resolved extends ResolvableKey>(input: Input, getKey: () => Resolved): Promise<Result>
  (
    input: Input,
    key: Key | (() => ResolvableKey),
  ): Promise<Result>
}
`,
  )
  t.is(
    readFileSync(catalog, 'utf8'),
    `import type { JWSAlgorithmFactory as F } from './types.js'
export declare const ES256: F<'ES256'>,
  HS256: F<'HS256'>;
/** Represents a JWS algorithm factory. */
export type { JWSAlgorithmFactory } from './types.js'
`,
  )
  t.is(
    readFileSync(join(types, 'algorithms', 'types.d.ts'), 'utf8'),
    `export type AlgorithmOf<T> = T
`,
  )
  t.is(
    readFileSync(composable, 'utf8'),
    `export interface CompactSignInstance {
  /** Signs and resolves the JWS. */
  sign(): Promise<string>
}
/** Compact JWS verification result with selected header suggestions. */
export type CompactVerifyResult = { payload: Uint8Array }
/** Key resolver for a composed JWT verifier. */
export interface JWTVerifyGetKey {
  /** Resolves a verification key. */
  get(): Promise<CryptoKey>
}
/** Composes a CompactSign constructor supporting the selected algorithms. */
export declare function composeCompactSign(): CompactSignInstance
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
  t.true(report.includes('- @param jws Compact JWS input.'))
  t.true(report.includes('- @param options Options for this operation.'))
  t.true(report.includes('- @see https://example.com'))
  t.true(report.includes('- @internal'))
  t.false(report.includes('- @deprecated Use next instead.'))
  t.false(report.includes('private.d.ts'))
  t.true(report.endsWith('rewrote 6 declaration comment(s) for editor hovers\n'))
  t.is(readFileSync(declaration, 'utf8'), expected)
})
