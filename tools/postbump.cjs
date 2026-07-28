const { x } = require('tar')

const { execSync } = require('child_process')
const { readFileSync, writeFileSync, globSync } = require('fs')
const { version } = require('../package.json')

const opts = { stdio: 'inherit' }

execSync('npm run docs', opts)
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
execSync('npm run build:bundle', opts)
execSync('npm run build:bundle-min', opts)
execSync('npm run build:umd', opts)
execSync('git add -A docs', opts)

const filesToUpdate = [
  { path: './README.md', regex: /jose@v\d+\.\d+\.\d+/gm, replacement: `jose@v${version}` },
  { path: './docs/README.md', regex: /jose@v\d+\.\d+\.\d+/gm, replacement: `jose@v${version}` },
  {
    path: './jsr.json',
    regex: /"version": "\d+\.\d+\.\d+"/gm,
    replacement: `"version": "${version}"`,
  },
]

filesToUpdate.forEach(({ path, regex, replacement }) => {
  writeFileSync(path, readFileSync(path, { encoding: 'utf-8' }).replace(regex, replacement))
  execSync(`git add ${path}`, { stdio: 'inherit' })
})

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

for (const dir of ['types', 'webapi']) {
  execSync(`git add dist/${dir} -f`, opts)
}
