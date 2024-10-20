const { readFileSync, writeFileSync, unlinkSync } = require('fs')

const pkg = JSON.parse(readFileSync('./package.json'))

pkg.devDependencies = undefined
pkg.scripts = undefined
pkg.imports = undefined
pkg.description = undefined
pkg.browser = undefined
pkg.deno = undefined
pkg.main = pkg.exports['.'].node.import
for (const exportPath of Object.keys(pkg.exports)) {
  if (typeof pkg.exports[exportPath] === 'object') {
    const {
      types,
      node: { import: entrypoint },
    } = pkg.exports[exportPath]
    pkg.exports[exportPath] = { types, default: entrypoint }
  }
}
pkg.keywords = undefined

pkg.files.push('!dist/**/package.json')
pkg.files.push('!dist/browser/**/*')
pkg.files.push('!dist/node/cjs/**/*')
pkg.name = 'jose-node-esm-runtime'
pkg.type = 'module'

writeFileSync('./package.json', `${JSON.stringify(pkg, null, 2)}\n`)
unlinkSync('./CHANGELOG.md')
unlinkSync('./README.md')
