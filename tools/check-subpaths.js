// Keep npm, JSR, the built artifacts, and every public module's documented import specifier in
// lockstep. A mismatch otherwise shows up as ERR_PACKAGE_PATH_NOT_EXPORTED (or as a missing JSR
// module) only after publication.
import { existsSync, globSync, readFileSync } from 'node:fs'
import { emittedTarget, resolvePackageExport } from './export-map.js'

const { exports: exportsMap, name } = JSON.parse(readFileSync('package.json', 'utf8'))
const { exports: jsrExports } = JSON.parse(readFileSync('jsr.json', 'utf8'))

const jsrSubpaths = Object.keys(jsrExports)
const problems = []

for (const [subpath, target] of Object.entries(exportsMap)) {
  if (
    subpath !== './package.json' &&
    !subpath.includes('*') &&
    target !== null &&
    !Object.hasOwn(jsrExports, subpath)
  ) {
    problems.push(`package.json declares ${subpath}, which is absent from jsr.json`)
  }
}

for (const subpath of jsrSubpaths) {
  const npmTarget = resolvePackageExport(exportsMap, subpath)
  const jsrTarget = jsrExports[subpath]
  if (typeof npmTarget !== 'object' || npmTarget === null) {
    problems.push(
      `package.json#exports[${JSON.stringify(subpath)}] must have types/default targets`,
    )
    continue
  }
  if (typeof jsrTarget !== 'string') {
    problems.push(`jsr.json#exports[${JSON.stringify(subpath)}] must be a source target`)
    continue
  }

  const expected = {
    types: emittedTarget(jsrTarget, 'types'),
    default: emittedTarget(jsrTarget, 'default'),
  }
  for (const condition of ['types', 'default']) {
    if (npmTarget[condition] !== expected[condition]) {
      problems.push(
        `${subpath} ${condition} target is ${JSON.stringify(npmTarget[condition])}; expected ${JSON.stringify(expected[condition])}`,
      )
    } else if (!existsSync(npmTarget[condition])) {
      problems.push(`${subpath} ${condition} target does not exist: ${npmTarget[condition]}`)
    }
  }
  if (!existsSync(jsrTarget)) problems.push(`${subpath} JSR target does not exist: ${jsrTarget}`)
}

// Check emitted files too: a stale build artifact can become public through a wildcard even after
// its source was deleted.
const implementationFiles = new Set([
  ...globSync('src/**/*.ts'),
  ...globSync('dist/webapi/**/*.js'),
  ...globSync('dist/types/**/*.d.ts'),
])
const checkedImplementationSubpaths = new Set()

for (const file of implementationFiles) {
  const subpath = `./${file
    .replace(/^(?:src|dist\/(?:types|webapi))\//u, '')
    .replace(/\.(?:d\.ts|[jt]s)$/u, '')}`
  if (checkedImplementationSubpaths.has(subpath)) continue
  checkedImplementationSubpaths.add(subpath)
  if (Object.hasOwn(jsrExports, subpath)) continue
  const target = resolvePackageExport(exportsMap, subpath)
  if (target !== undefined && target !== null) {
    problems.push(`${subpath} (${file}) is an internal module exposed by a package export pattern`)
  }
}

const declared = new Set(jsrSubpaths.map((key) => (key === '.' ? name : `${name}/${key.slice(2)}`)))

const documentedSpecifierPatterns = [
  /subpath export `'([^']+)'`/g,
  /\bfrom\s+['"](jose(?:\/[^'"]+)?)['"]/g,
  /`(jose(?:\/[a-z0-9_./-]+)?)`/g,
]

function checkDocumentedSpecifiers(file) {
  const source = readFileSync(file, 'utf8')
  for (const pattern of documentedSpecifierPatterns) {
    for (const [, specifier] of source.matchAll(pattern)) {
      if (!declared.has(specifier)) {
        problems.push(`${file}: '${specifier}' is not in package.json#exports`)
      }
    }
  }
}

for (const file of globSync('src/**/*.ts')) {
  checkDocumentedSpecifiers(file)
}

// README.md is authored by hand and docs contains the generated package and subpath pages.
// Checking both catches stale @example imports as well as stale composable-module table entries.
for (const file of ['README.md', ...globSync('docs/**/*.md')]) checkDocumentedSpecifiers(file)

if (problems.length) {
  console.error('Public subpath contract problems:')
  for (const problem of problems) console.error(`  ${problem}`)
  console.error(`\nDeclared: ${[...declared].sort().join(', ')}`)
  process.exit(1)
}

console.log(`OK - npm, JSR, dist, and documented subpaths agree (${declared.size} exports)`)
