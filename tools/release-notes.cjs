const fs = require('fs')
const { execSync } = require('child_process')
const { addPendingNotice } = require('./wait-for-npm.cjs')

function extractReleaseNotes(changelog, version) {
  const releaseHeading = `## [${version}]`
  const releaseStart = changelog.indexOf(releaseHeading)

  if (releaseStart === -1) {
    throw new Error(`could not find ${releaseHeading} in CHANGELOG.md`)
  }

  const notesStart = changelog.indexOf('\n', releaseStart) + 1
  const nextRelease = changelog.indexOf('\n## [', notesStart)
  return changelog.slice(notesStart, nextRelease === -1 ? undefined : nextRelease).trim()
}

function main() {
  const tag = execSync('git tag --points-at HEAD').toString().trim()
  const version = tag.replace(/^v/, '')
  const changelog = fs.readFileSync('CHANGELOG.md', 'utf8')
  const notes = extractReleaseNotes(changelog, version)

  fs.writeFileSync('notes.md', addPendingNotice(notes))
  execSync(`gh release create ${tag} -F notes.md --title ${tag} --discussion-category Releases`)
}

module.exports = { extractReleaseNotes }

if (require.main === module) {
  main()
}
