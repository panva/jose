const { readFileSync, writeFileSync } = require('fs')

function formatChangelog(changelog) {
  return changelog.replace(/^### \[/gm, '## [').replace(/([^\r\n])(\r?\n)(?=## )/g, '$1$2$2')
}

function main() {
  const path = './CHANGELOG.md'
  writeFileSync(path, formatChangelog(readFileSync(path, 'utf8')))
}

module.exports = { formatChangelog }

if (require.main === module) {
  main()
}
