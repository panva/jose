const { execSync } = require('child_process')
const { readFileSync, writeFileSync } = require('fs')

const dryRun = execSync('standard-version --dry-run', { encoding: 'utf-8' })

;/tagging release v(\d+\.\d+\.\d+)/gm.test(dryRun)

const version = RegExp.$1
const tagName = `v${version}`

const path = './src/jwks/remote.ts'
writeFileSync(path, readFileSync(path, { encoding: 'utf-8' }).replace(/v(\d+\.\d+\.\d+)/g, tagName))
execSync(`git add ${path}`, { stdio: 'inherit' })
