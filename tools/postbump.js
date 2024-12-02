const { x } = require('tar')
const { globSync } = require('glob')

const { execSync } = require('child_process')
const { readFileSync, writeFileSync } = require('fs')
const { version } = require('../package.json')

const readme = readFileSync('docs/README.md')
const tagName = `v${version}`
const opts = { stdio: 'inherit' }

try {
  execSync('git rm -f docs/**/*.md', opts)
} catch {}
execSync('find docs -type d | grep "docs/" | xargs rm -rf', opts)
execSync('npx patch-package', opts)
execSync('npm run runtime-browser', opts)
execSync(`npm run docs:generate -- --gitRevision ${tagName}`, opts)
globSync('docs/**/*.md').forEach((file) => {
  const content = readFileSync(file, 'utf-8')
  const updatedContent = content.replaceAll('\\<`ArrayBufferLike`\\>', '')

  writeFileSync(file, updatedContent, 'utf-8')
})
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
  readFileSync('docs/readme.md', { encoding: 'utf-8' })
    .replace(/^`jose` is distributed.+$\n\n/m, '')
    .replace(
      /\*\*[\s\S]+```/gm,
      `**\`example\`** Deno import
\`\`\`js
import * as jose from 'https://deno.land/x/jose@${tagName}/index.ts'
\`\`\``,
    )
    .replace(/(\]\()(?!https)/gm, `](https://github.com/panva/jose/blob/${tagName}/docs/`),
)
execSync('npm run build:browser-bundle', opts)
execSync('npm run build:browser-bundle-min', opts)
execSync('npm run build:browser-umd', opts)
execSync('git add docs/**/*.md', opts)

for (const path of ['./README.md', './docs/README.md']) {
  writeFileSync(
    path,
    readFileSync(path, { encoding: 'utf-8' }).replace(/jose@v\d+\.\d+\.\d+/gm, `jose@v${version}`),
  )
  execSync(`git add ${path}`, { stdio: 'inherit' })
}

const ts = globSync('dist/**/**.ts')

function filterExamples(file) {
  let inExample = false
  return file
    .split('\n')
    .filter((line) => {
      let remove = inExample
      if (line.includes('* @example')) {
        remove = inExample = true
      } else if (line.includes('```') && !line.includes('```js')) {
        inExample = false
      } else if (inExample) {
        remove = true
      }
      return remove === false
    })
    .join('\n')
}

function trimExcessComment(file) {
  let previousWasEmpty = false
  return file
    .split('\n')
    .filter((line) => {
      let remove = false
      if (line.trim() === '*' && previousWasEmpty) {
        remove = true
      } else if (line.trim() === '*' || line.trim() === '/**') {
        previousWasEmpty = true
      } else {
        previousWasEmpty = false
      }

      return remove === false
    })
    .join('\n')
}

for (const file of ts) {
  writeFileSync(file, trimExcessComment(filterExamples(readFileSync(file, { encoding: 'utf-8' }))))
}

execSync('git add dist/**/* -f', opts)
