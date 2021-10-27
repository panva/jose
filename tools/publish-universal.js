const { readFileSync, writeFileSync, unlinkSync } = require('fs')

const pkg = JSON.parse(readFileSync('./package.json'))
delete pkg.devDependencies
delete pkg.scripts
delete pkg.imports

writeFileSync('./package.json', JSON.stringify(pkg, null, 2) + '\n')
unlinkSync('./CHANGELOG.md')
