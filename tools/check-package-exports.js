// Exercise the artifact npm will publish, rather than the working tree. A temporary consumer
// installs the packed tarball, imports every additive subpath in Node.js, and asks TypeScript to
// resolve the same imports through the installed package's export map.
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import ts from 'typescript'
import publish from './publish.cjs'
import { resolvePackageExport } from './export-map.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const temporary = mkdtempSync(join(tmpdir(), 'jose-package-exports-'))
const project = join(temporary, 'consumer')
const staging = join(temporary, 'package')
const { normalizePackageJson } = publish

const entries = [
  ['jose/algorithms/jws', ['ES256']],
  ['jose/algorithms/jwe', ['dir']],
  ['jose/algorithms/jwe/enc', ['A256GCM']],
  ['jose/algorithms/jwe/zip', ['DEF']],
  ['jose/algorithms/key', ['ES256', 'A256GCM']],
  ['jose/composable/jwt/sign', ['composeSignJWT']],
  ['jose/composable/jwt/verify', ['composeJwtVerify']],
  ['jose/composable/jwt/encrypt', ['composeEncryptJWT']],
  ['jose/composable/jwt/decrypt', ['composeJwtDecrypt']],
  ['jose/composable/jws/compact/sign', ['composeCompactSign']],
  ['jose/composable/jws/compact/verify', ['composeCompactVerify']],
  ['jose/composable/jws/flattened/sign', ['composeFlattenedSign']],
  ['jose/composable/jws/flattened/verify', ['composeFlattenedVerify']],
  ['jose/composable/jws/general/sign', ['composeGeneralSign']],
  ['jose/composable/jws/general/verify', ['composeGeneralVerify']],
  ['jose/composable/jwe/compact/encrypt', ['composeCompactEncrypt']],
  ['jose/composable/jwe/compact/decrypt', ['composeCompactDecrypt']],
  ['jose/composable/jwe/flattened/encrypt', ['composeFlattenedEncrypt']],
  ['jose/composable/jwe/flattened/decrypt', ['composeFlattenedDecrypt']],
  ['jose/composable/jwe/general/encrypt', ['composeGeneralEncrypt']],
  ['jose/composable/jwe/general/decrypt', ['composeGeneralDecrypt']],
  ['jose/composable/jwk/embedded', ['composeEmbeddedJWK']],
  ['jose/composable/jwks/local', ['composeLocalJWKSet']],
  ['jose/composable/jwks/remote', ['composeRemoteJWKSet']],
  ['jose/composable/key/import', ['composeKeyImport']],
  ['jose/composable/key/generate/keypair', ['composeGenerateKeyPair']],
  ['jose/composable/key/generate/secret', ['composeGenerateSecret']],
]

const jsr = JSON.parse(readFileSync(join(root, 'jsr.json'), 'utf8'))
const additiveExports = Object.keys(jsr.exports)
  .filter((subpath) => subpath.startsWith('./algorithms/') || subpath.startsWith('./composable/'))
  .map((subpath) => `jose/${subpath.slice(2)}`)
  .sort()
const coveredExports = entries.map(([specifier]) => specifier).sort()
if (JSON.stringify(additiveExports) !== JSON.stringify(coveredExports)) {
  throw new Error('packed-artifact smoke entries do not cover every additive package export')
}

function run(command, args, cwd, capture = false) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, npm_config_cache: join(temporary, 'npm-cache') },
    maxBuffer: 20 * 1024 * 1024,
    stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'pipe',
  })
  if (result.error !== undefined || result.status !== 0) {
    const invocation = [command, ...args].join(' ')
    throw new Error(
      `${invocation} failed${result.error ? `: ${result.error.message}` : ''}\n${result.stdout ?? ''}${result.stderr ?? ''}`,
    )
  }
  return result.stdout
}

function smokeSource(extension) {
  const imports = entries
    .map(([specifier], index) => `import * as entry${index} from '${specifier}'`)
    .join('\n')
  const checks = entries
    .map(([specifier, names], index) =>
      names
        .map(
          (name) =>
            `if (typeof entry${index}.${name} !== 'function') throw new Error(${JSON.stringify(`${specifier} does not export ${name}`)})`,
        )
        .join('\n'),
    )
    .join('\n')
  const references = `void [${entries.map((_, index) => `entry${index}`).join(', ')}]`
  const crossCopy = `
import { ES256 as foreignES256 } from 'jose-copy/algorithms/jws'
import { A256KW as foreignA256KW, dir as foreignDir } from 'jose-copy/algorithms/jwe'
import { A256GCM as foreignA256GCM } from 'jose-copy/algorithms/jwe/enc'
import {
  ES256 as foreignKeyES256,
  A256GCM as foreignKeyA256GCM,
} from 'jose-copy/algorithms/key'
import { composeSignJWT as primaryComposeSignJWT } from 'jose/composable/jwt/sign'
import { composeJwtVerify as primaryComposeJwtVerify } from 'jose/composable/jwt/verify'
import { composeEncryptJWT as primaryComposeEncryptJWT } from 'jose/composable/jwt/encrypt'
import { composeJwtDecrypt as primaryComposeJwtDecrypt } from 'jose/composable/jwt/decrypt'
import { composeCompactDecrypt as primaryComposeCompactDecrypt } from 'jose/composable/jwe/compact/decrypt'
import { composeFlattenedEncrypt as primaryComposeFlattenedEncrypt } from 'jose/composable/jwe/flattened/encrypt'
import { composeFlattenedDecrypt as primaryComposeFlattenedDecrypt } from 'jose/composable/jwe/flattened/decrypt'
import { composeKeyImport as primaryComposeKeyImport } from 'jose/composable/key/import'
import { composeGenerateKeyPair as primaryComposeGenerateKeyPair } from 'jose/composable/key/generate/keypair'
import { composeGenerateSecret as primaryComposeGenerateSecret } from 'jose/composable/key/generate/secret'
import {
  JWEDecryptionFailed as PrimaryJWEDecryptionFailed,
  JWEInvalid as PrimaryJWEInvalid,
} from 'jose/errors'
const ForeignSignJWT = primaryComposeSignJWT(foreignES256)
const ForeignEncryptJWT = primaryComposeEncryptJWT(foreignDir, foreignA256GCM)
if (typeof new ForeignSignJWT().setProtectedHeader !== 'function') throw new Error('cross-copy JWS factory failed')
if (typeof new ForeignEncryptJWT().setProtectedHeader !== 'function') throw new Error('cross-copy JWE factories failed')
const crossCopyPair = await crypto.subtle.generateKey(
  { name: 'ECDSA', namedCurve: 'P-256' },
  false,
  ['sign', 'verify'],
)
const crossCopyJws = await new ForeignSignJWT({ sub: 'cross-copy' })
  .setProtectedHeader({ alg: 'ES256' })
  .sign(crossCopyPair.privateKey)
const primaryJwtVerify = primaryComposeJwtVerify(foreignES256)
const crossCopyClaims = await primaryJwtVerify(crossCopyJws, crossCopyPair.publicKey)
if (crossCopyClaims.payload.sub !== 'cross-copy') throw new Error('cross-copy JWS operation failed')
const primaryGenerateKeyPair = primaryComposeGenerateKeyPair(foreignKeyES256)
const generatedCrossCopyPair = await primaryGenerateKeyPair('ES256', { extractable: true })
const generatedCrossCopyJwk = await crypto.subtle.exportKey('jwk', generatedCrossCopyPair.publicKey)
const primaryKeyImport = primaryComposeKeyImport(foreignKeyES256)
const importedCrossCopyKey = await primaryKeyImport.importJWK({ ...generatedCrossCopyJwk, alg: 'ES256' })
if (importedCrossCopyKey instanceof Uint8Array || importedCrossCopyKey.algorithm.name !== 'ECDSA') {
  throw new Error('cross-copy key import failed')
}
const primaryGenerateSecret = primaryComposeGenerateSecret(foreignKeyA256GCM)
const generatedCrossCopySecret = await primaryGenerateSecret('A256GCM')
if (generatedCrossCopySecret.algorithm.name !== 'AES-GCM') throw new Error('cross-copy secret generation failed')
const crossCopySecret = crypto.getRandomValues(new Uint8Array(32))
const crossCopyJwe = await new ForeignEncryptJWT({ sub: 'cross-copy' })
  .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
  .encrypt(crossCopySecret)
const primaryJwtDecrypt = primaryComposeJwtDecrypt(foreignDir, foreignA256GCM)
const crossCopyPayload = await primaryJwtDecrypt(crossCopyJwe, crossCopySecret)
if (crossCopyPayload.payload.sub !== 'cross-copy') throw new Error('cross-copy JWE operation failed')
const primaryCompactDecrypt = primaryComposeCompactDecrypt(foreignDir, foreignA256GCM)
const malformedProtected = btoa(JSON.stringify({ alg: 'dir', enc: 'A256GCM' }))
  .replaceAll('+', '-')
  .replaceAll('/', '_')
  .replace(/=+$/u, '')
const crossCopyError = await primaryCompactDecrypt(
  \`\${malformedProtected}.AA.AA.AA.AA\`,
  crossCopySecret,
).then(
  () => new Error('cross-copy malformed JWE did not fail'),
  (error) => error,
)
if (!(crossCopyError instanceof PrimaryJWEInvalid)) {
  throw new Error('cross-copy JWEInvalid identity was not preserved')
}
const ForeignFlattenedKwEncrypt = primaryComposeFlattenedEncrypt(foreignA256KW, foreignA256GCM)
const primaryForeignKwDecrypt = primaryComposeFlattenedDecrypt(foreignA256KW, foreignA256GCM)
const crossCopyKwJwe = await new ForeignFlattenedKwEncrypt(new Uint8Array([1]))
  .setProtectedHeader({ alg: 'A256KW', enc: 'A256GCM' })
  .encrypt(crossCopySecret)
delete crossCopyKwJwe.encrypted_key
const foreignHandlerError = await primaryForeignKwDecrypt(crossCopyKwJwe, crossCopySecret).then(
  () => new Error('cross-copy missing JWE Encrypted Key did not fail'),
  (error) => error,
)
if (
  !(foreignHandlerError instanceof PrimaryJWEInvalid) ||
  foreignHandlerError.code !== 'ERR_JWE_INVALID' ||
  foreignHandlerError.message !== 'JWE Encrypted Key missing'
) {
  throw new Error('cross-copy key-management JWEInvalid was not preserved')
}
const tamperedCrossCopyJwe = crossCopyJwe.split('.')
tamperedCrossCopyJwe[4] = \`\${tamperedCrossCopyJwe[4][0] === 'A' ? 'B' : 'A'}\${tamperedCrossCopyJwe[4].slice(1)}\`
const crossCopyDecryptionError = await primaryJwtDecrypt(
  tamperedCrossCopyJwe.join('.'),
  crossCopySecret,
).then(
  () => new Error('cross-copy tampered JWE did not fail'),
  (error) => error,
)
if (!(crossCopyDecryptionError instanceof PrimaryJWEDecryptionFailed)) {
  throw new Error('cross-copy JWEDecryptionFailed identity was not preserved')
}
`
  return `${imports}\n${crossCopy}\n${extension === 'ts' ? references : checks}\n`
}

function isTypeOnlyExport(symbol) {
  return symbol.declarations?.some((declaration) => {
    if (!ts.isExportSpecifier(declaration)) return false
    const exportDeclaration = declaration.parent.parent
    return declaration.isTypeOnly || exportDeclaration.isTypeOnly
  })
}

async function checkValueExportParity(installedPath, installed) {
  const modules = Object.keys(jsr.exports).map((subpath) => {
    const target = resolvePackageExport(installed.exports, subpath)
    if (typeof target !== 'object' || target === null) {
      throw new Error(`installed package export ${subpath} has no types/default targets`)
    }
    return {
      declaration: join(installedPath, target.types),
      implementation: join(installedPath, target.default),
      specifier: subpath === '.' ? 'jose' : `jose/${subpath.slice(2)}`,
    }
  })
  const program = ts.createProgram(
    modules.map(({ declaration }) => declaration),
    {
      module: ts.ModuleKind.NodeNext,
      moduleResolution: ts.ModuleResolutionKind.NodeNext,
      skipLibCheck: false,
      target: ts.ScriptTarget.ESNext,
    },
  )
  const checker = program.getTypeChecker()
  const problems = []

  for (const { declaration, implementation, specifier } of modules) {
    const source = program.getSourceFile(declaration)
    const moduleSymbol = source && checker.getSymbolAtLocation(source)
    if (!moduleSymbol) throw new Error(`TypeScript did not load ${declaration}`)

    const declared = checker
      .getExportsOfModule(moduleSymbol)
      .filter((symbol) => !isTypeOnlyExport(symbol))
      .filter((symbol) => {
        const target =
          symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol
        return Boolean(target.flags & ts.SymbolFlags.Value)
      })
      .map(({ name }) => name)
      .sort()
    const runtime = Object.keys(await import(pathToFileURL(implementation).href)).sort()
    const declarationOnly = declared.filter((name) => !runtime.includes(name))
    const runtimeOnly = runtime.filter((name) => !declared.includes(name))

    if (declarationOnly.length || runtimeOnly.length) {
      problems.push(
        `${specifier}: declaration-only [${declarationOnly.join(', ')}], runtime-only [${runtimeOnly.join(', ')}]`,
      )
    }
  }

  if (problems.length) {
    throw new Error(`declaration/runtime value export mismatch\n${problems.join('\n')}`)
  }
}

try {
  mkdirSync(project)
  mkdirSync(staging)
  const sourcePack = JSON.parse(
    run('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], root, true),
  )
  const sourcePackEntry = Array.isArray(sourcePack) ? sourcePack[0] : Object.values(sourcePack)[0]
  if (!Array.isArray(sourcePackEntry?.files)) {
    throw new Error('npm pack --dry-run did not report its file list')
  }
  for (const { path } of sourcePackEntry.files) {
    if (path === 'package.json' || path === 'CHANGELOG.md') continue
    const destination = join(staging, path)
    mkdirSync(dirname(destination), { recursive: true })
    cpSync(join(root, path), destination)
  }
  const normalized = normalizePackageJson(
    JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')),
  )
  writeFileSync(join(staging, 'package.json'), `${JSON.stringify(normalized, null, 2)}\n`)
  const packed = JSON.parse(
    run(
      'npm',
      ['pack', '--json', '--ignore-scripts', '--pack-destination', temporary],
      staging,
      true,
    ),
  )
  const packedEntry = Array.isArray(packed) ? packed[0] : Object.values(packed)[0]
  if (typeof packedEntry?.filename !== 'string') {
    throw new Error('npm pack did not report its tarball filename')
  }
  const declarationSize = packedEntry.files
    .filter(({ path }) => path.endsWith('.d.ts'))
    .reduce((total, { size }) => total + size, 0)
  const javascriptSize = packedEntry.files
    .filter(({ path }) => path.endsWith('.js'))
    .reduce((total, { size }) => total + size, 0)
  writeFileSync(
    join(project, 'package.json'),
    `${JSON.stringify({ private: true, type: 'module' }, null, 2)}\n`,
  )
  writeFileSync(join(project, 'smoke.mjs'), smokeSource('js'))
  writeFileSync(join(project, 'smoke.ts'), smokeSource('ts'))
  writeFileSync(
    join(project, 'tsconfig.json'),
    `${JSON.stringify(
      {
        files: ['./smoke.ts'],
        compilerOptions: {
          lib: ['ESNext', 'DOM', 'DOM.Iterable'],
          module: 'NodeNext',
          moduleResolution: 'NodeNext',
          noEmit: true,
          skipLibCheck: false,
          strict: true,
          target: 'ESNext',
        },
      },
      null,
      2,
    )}\n`,
  )

  const tarball = join(temporary, packedEntry.filename)
  run(
    'npm',
    ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--no-package-lock', tarball],
    project,
  )
  const installedPath = join(project, 'node_modules/jose')
  const foreignPath = join(project, 'node_modules/jose-copy')
  cpSync(installedPath, foreignPath, { recursive: true })
  run(process.execPath, ['smoke.mjs'], project)
  run(join(root, 'node_modules/.bin/tsc'), ['-p', 'tsconfig.json'], project)

  const installed = JSON.parse(readFileSync(join(installedPath, 'package.json'), 'utf8'))
  if (installed.version === undefined) throw new Error('installed package manifest is missing')
  await checkValueExportParity(installedPath, installed)
  console.log(
    `OK - packed jose ${installed.version} is ${packedEntry.size}/${packedEntry.unpackedSize} bytes (${declarationSize} declarations, ${javascriptSize} JavaScript) across ${packedEntry.entryCount} files; resolves all ${entries.length} additive subpaths, matches declaration/runtime value exports, and composes factories from a second package copy`,
  )
} finally {
  rmSync(temporary, { force: true, recursive: true })
}
