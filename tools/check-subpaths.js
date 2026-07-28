// Every public module's JSDoc states the subpath it is reachable from. That sentence is the only
// place in the generated docs where the real specifier appears, and it ships inside the .d.ts, so a
// wrong one sends readers to ERR_PACKAGE_PATH_NOT_EXPORTED. Assert each one is a real export.
import { globSync, readFileSync } from 'node:fs'

const { exports: exportsMap, name } = JSON.parse(readFileSync('package.json', 'utf8'))

const declared = new Set(
  Object.keys(exportsMap)
    .filter((key) => key !== './package.json')
    .map((key) => (key === '.' ? name : `${name}/${key.slice(2)}`)),
)

const pattern = /subpath export `'([^']+)'`/g
const problems = []

for (const file of globSync('src/**/*.ts')) {
  const source = readFileSync(file, 'utf8')
  for (const [, specifier] of source.matchAll(pattern)) {
    if (!declared.has(specifier)) {
      problems.push(`${file}: '${specifier}' is not in package.json#exports`)
    }
  }
}

if (problems.length) {
  console.error('Documented subpath specifiers that do not exist:')
  for (const problem of problems) console.error(`  ${problem}`)
  console.error(`\nDeclared: ${[...declared].sort().join(', ')}`)
  process.exit(1)
}

console.log(`OK - every documented subpath specifier resolves (${declared.size} exports)`)
