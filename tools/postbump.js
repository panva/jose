const { x } = require('tar')

const { execSync } = require('child_process')
const { readFileSync, writeFileSync } = require('fs')
const { version } = require('../package.json')

const readme = readFileSync('docs/README.md')
const tagName = `v${version}`
const opts = { stdio: 'inherit' }

execSync('git rm -f docs/**/*.md', opts)
execSync('find docs -type d | grep "docs/" | xargs rm -rf', opts)
execSync('npx patch-package', opts)
execSync(`npm run docs:generate -- --gitRevision ${tagName}`, opts)
writeFileSync('docs/README.md', readme)
execSync('npm pack', opts)
execSync('rm -rf dist', opts)
x({
  f: `jose-${version}.tgz`,
  strip: true,
  filter(loc) {
    return loc.startsWith('package/dist/')
  },
  sync: true,
})
execSync('npm run build:deno', opts)
writeFileSync(
  'dist/deno/README.md',
  readFileSync('docs/readme.md', { encoding: 'utf-8' }).replace(
    /\*\*[\s\S]+```/gm,
    `**\`example\`** Deno import
\`\`\`js
import * as jose from 'https://deno.land/x/jose@${tagName}/index.ts'
\`\`\``,
  ),
)
execSync('npm run build:browser-bundle', opts)
execSync('npm run build:browser-bundle-min', opts)
execSync('npm run build:browser-umd', opts)
execSync(
  `sed -i '' -e 's/](/](https:\\/\\/github.com\\/panva\\/jose\\/blob\\/${tagName}\\/docs\\//g' dist/deno/README.md`,
)
execSync('git add docs/**/*.md', opts)
execSync('git add dist/**/* -f', opts)
