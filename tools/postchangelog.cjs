const { readFileSync, writeFileSync } = require('fs')

function formatChangelog(changelog) {
  return changelog.replace(/### \[/g, '## [').replace(/([^\n])\n(?=## \[)/g, '$1\n\n')
}

function main() {
  const path = './CHANGELOG.md'
  writeFileSync(path, formatChangelog(readFileSync(path, 'utf8')))
}

module.exports = { formatChangelog }

if (require.main === module) {
  main()
}
