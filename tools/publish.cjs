const { readFileSync, writeFileSync, unlinkSync } = require('fs')

function normalizePackageJson(packageJson) {
  const normalized = { ...packageJson }
  delete normalized.devDependencies
  delete normalized.scripts
  delete normalized.imports
  return normalized
}

if (require.main === module) {
  const pkg = normalizePackageJson(JSON.parse(readFileSync('./package.json')))
  writeFileSync('./package.json', `${JSON.stringify(pkg, null, 2)}\n`)
  unlinkSync('./CHANGELOG.md')
}

module.exports = { normalizePackageJson }
