// Walk every exported declaration entry as a consumer would. Public declarations must be complete
// without dist/types/lib because that directory is deliberately excluded from the npm artifact.
import { existsSync, readFileSync } from 'node:fs'
import { dirname, relative, resolve, sep } from 'node:path'

const jsr = JSON.parse(readFileSync('jsr.json', 'utf8'))
const declarationRoot = resolve('dist/types')
const entries = Object.values(jsr.exports).map((target) =>
  resolve(target.replace(/^\.\/src\//u, 'dist/types/').replace(/\.ts$/u, '.d.ts')),
)

const queue = entries.map((file) => ({ file, chain: [] }))
const visited = new Set()
const problems = []

function declarationTarget(file, specifier) {
  let target = resolve(dirname(file), specifier)
  if (target.endsWith('.js')) target = `${target.slice(0, -3)}.d.ts`
  if (!target.endsWith('.d.ts')) target = `${target}.d.ts`
  return target
}

while (queue.length !== 0) {
  const { file, chain } = queue.shift()
  if (visited.has(file)) continue
  visited.add(file)

  const display = relative(process.cwd(), file)
  if (!existsSync(file)) {
    problems.push(`${display} is missing (from ${chain.join(' -> ') || 'jsr.json#exports'})`)
    continue
  }

  const declarationPath = relative(declarationRoot, file)
  if (declarationPath === '..' || declarationPath.startsWith(`..${sep}`)) {
    problems.push(`${[...chain, display].join(' -> ')} leaves dist/types`)
    continue
  }
  if (declarationPath === 'lib' || declarationPath.startsWith(`lib${sep}`)) {
    problems.push(`${[...chain, display].join(' -> ')} reaches excluded dist/types/lib`)
    continue
  }

  const source = readFileSync(file, 'utf8')
  for (const match of source.matchAll(/\b(?:from\s+|import\s*\(\s*)['"]([^'"]+)['"]/gu)) {
    const specifier = match[1]
    if (!specifier.startsWith('.')) continue
    queue.push({ file: declarationTarget(file, specifier), chain: [...chain, display] })
  }
}

if (problems.length !== 0) {
  console.error('Published declaration boundary problems:')
  for (const problem of problems) console.error(`  ${problem}`)
  process.exit(1)
}

console.log(`OK - ${entries.length} exported declaration entries are self-contained`)
