const [major, minor] = process.version.substr(1).split('.').map(x => parseInt(x, 10))

module.exports = {
  oaepHash: major > 12 || (major === 12 && minor >= 9)
}
