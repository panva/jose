const fs = require('fs')
const { execSync } = require('child_process')

execSync('git show HEAD -- CHANGELOG.md > CHANGELOG.diff')

const tag = execSync('git tag --points-at HEAD').toString().trim()

fs.writeFileSync(
  'notes.md',
  fs
    .readFileSync('CHANGELOG.diff')
    .toString()
    .split('\n')
    .filter((line) => line.startsWith('+') && !line.startsWith('+++'))
    .map((line) => line.slice(1))
    .slice(3)
    .join('\n'),
)

execSync(`gh release create ${tag} -F notes.md --title ${tag} --discussion-category Releases`)
