import { globSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'

import { transform } from 'esbuild'

const files = globSync('dist/webapi/**/*.js').filter(
  (file) => !/\.(?:bundle|umd)(?:\.min)?\.js$/u.test(file),
)

const output = await Promise.all(
  files.map(async (file) => {
    const source = await readFile(file, 'utf8')
    const { code } = await transform(source, {
      charset: 'utf8',
      format: 'esm',
      loader: 'js',
      minifyIdentifiers: false,
      minifySyntax: true,
      minifyWhitespace: false,
      sourcefile: file,
      target: 'es2022',
    })

    return { code, file }
  }),
)

await Promise.all(output.map(({ code, file }) => writeFile(file, code)))
