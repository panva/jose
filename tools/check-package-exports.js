// Exercise the artifact npm will publish, rather than the working tree. A temporary consumer
// installs the packed tarball, imports every public entry point in Node.js, asks TypeScript to
// resolve those imports, and compares each module's declared and runtime value exports.
import { spawnSync } from 'node:child_process'
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import ts from 'typescript'
import { resolvePackageExport } from './export-map.js'
import publish from './publish.cjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const temporary = mkdtempSync(join(tmpdir(), 'jose-package-exports-'))
const project = join(temporary, 'consumer')
const staging = join(temporary, 'package')
const { normalizePackageJson } = publish

const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const jsr = JSON.parse(readFileSync(join(root, 'jsr.json'), 'utf8'))
const specifiers = Object.keys(jsr.exports).map((subpath) =>
  subpath === '.' ? packageJson.name : `${packageJson.name}/${subpath.slice(2)}`,
)

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, npm_config_cache: join(temporary, 'npm-cache') },
    maxBuffer: 20 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  if (result.error !== undefined || result.status !== 0) {
    const invocation = [command, ...args].join(' ')
    throw new Error(
      `${invocation} failed${result.error ? `: ${result.error.message}` : ''}\n${result.stdout ?? ''}${result.stderr ?? ''}`,
    )
  }
  return result.stdout
}

function smokeSource() {
  const imports = specifiers
    .map((specifier, index) => `import * as entry${index} from '${specifier}'`)
    .join('\n')
  return `${imports}\nvoid [${specifiers.map((_, index) => `entry${index}`).join(', ')}]\n`
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
    if (
      typeof target !== 'object' ||
      target === null ||
      typeof target.types !== 'string' ||
      typeof target.default !== 'string'
    ) {
      throw new Error(`installed package export ${subpath} has no types/default targets`)
    }
    return {
      declaration: join(installedPath, target.types),
      implementation: join(installedPath, target.default),
      specifier: subpath === '.' ? packageJson.name : `${packageJson.name}/${subpath.slice(2)}`,
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

    if (declarationOnly.length !== 0 || runtimeOnly.length !== 0) {
      problems.push(
        `${specifier}: declaration-only [${declarationOnly.join(', ')}], runtime-only [${runtimeOnly.join(', ')}]`,
      )
    }
  }

  if (problems.length !== 0) {
    throw new Error(`declaration/runtime value export mismatch\n${problems.join('\n')}`)
  }
}

try {
  mkdirSync(project)
  mkdirSync(staging)

  const sourcePack = JSON.parse(
    run('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], root),
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

  const normalized = normalizePackageJson(packageJson)
  writeFileSync(join(staging, 'package.json'), `${JSON.stringify(normalized, null, 2)}\n`)

  const packed = JSON.parse(
    run('npm', ['pack', '--json', '--ignore-scripts', '--pack-destination', temporary], staging),
  )
  const packedEntry = Array.isArray(packed) ? packed[0] : Object.values(packed)[0]
  if (typeof packedEntry?.filename !== 'string') {
    throw new Error('npm pack did not report its tarball filename')
  }

  writeFileSync(
    join(project, 'package.json'),
    `${JSON.stringify({ private: true, type: 'module' }, null, 2)}\n`,
  )
  writeFileSync(join(project, 'smoke.mjs'), smokeSource())
  writeFileSync(join(project, 'smoke.ts'), smokeSource())
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
  run(process.execPath, ['smoke.mjs'], project)
  run(join(root, 'node_modules/.bin/tsc'), ['-p', 'tsconfig.json'], project)

  const installedPath = join(project, 'node_modules', packageJson.name)
  const installed = JSON.parse(readFileSync(join(installedPath, 'package.json'), 'utf8'))
  if (installed.version === undefined) throw new Error('installed package manifest is missing')
  await checkValueExportParity(installedPath, installed)

  console.log(
    `OK - packed jose ${installed.version} imports and type-checks ${specifiers.length} public entry points and matches declaration/runtime value exports (${packedEntry.entryCount} files, ${packedEntry.unpackedSize} bytes unpacked, ${packedEntry.size} bytes tarball)`,
  )
} finally {
  rmSync(temporary, { force: true, recursive: true })
}
