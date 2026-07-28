const { execSync } = require('child_process')
const { globSync, readdirSync, readFileSync, rmSync, writeFileSync } = require('fs')
const { version } = require('../package.json')

const opts = { stdio: 'inherit' }

// docs/README.md is hand-written, typedoc must not clobber it
const readme = readFileSync('docs/README.md')

for (const entry of readdirSync('docs')) {
  if (entry === 'README.md') continue
  rmSync(`docs/${entry}`, { recursive: true, force: true })
}

execSync('npx patch-package', opts)
execSync(`npm run docs:generate -- --gitRevision v${version}`, opts)

globSync('docs/**/*.md').forEach((file) => {
  const content = readFileSync(file, 'utf-8')
  const updatedContent = content.replaceAll('\\<`ArrayBufferLike`\\>', '')

  writeFileSync(file, updatedContent, 'utf-8')
})

writeFileSync('docs/README.md', readme)
