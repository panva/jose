// Every public symbol's JSDoc states where it is importable from - "This function is exported (as a
// named export) from the main 'jose' module entry point as well as from its subpath export
// 'jose/jwt/verify'." and its variants. That sentence is written for the generated documentation,
// which is where typedoc renders it; it is the only place the real specifier appears, since typedoc
// names its folders after source paths.
//
// It is noise in an editor hover, and it is shipped 35 times over because removeComments is false
// for the declaration build. Strip it from dist/types after emit. docs/ is generated from src, so
// it keeps the sentence.
import { globSync, readFileSync, writeFileSync } from 'node:fs'

const NOTE = /^(?:This|These)\b[^.]*\bexported\b/

/** Splits a JSDoc body into paragraphs, keeping fenced code blocks intact. */
function paragraphs(lines) {
  const out = []
  let current = []
  let fenced = false

  for (const line of lines) {
    const text = line.replace(/^\s*\* ?/, '')
    if (text.trimStart().startsWith('```')) fenced = !fenced
    if (!fenced && text.trim() === '') {
      if (current.length) out.push(current)
      current = []
      continue
    }
    current.push({ line, text })
  }
  if (current.length) out.push(current)
  return out
}

let stripped = 0

for (const file of globSync('dist/types/**/*.d.ts')) {
  const source = readFileSync(file, 'utf8')

  const updated = source.replace(
    /^([ \t]*)\/\*\*\n([\s\S]*?)^[ \t]*\*\/\n/gm,
    (block, indent, body) => {
      const kept = paragraphs(body.split('\n').slice(0, -1)).filter(
        (paragraph) => !NOTE.test(paragraph[0].text),
      )
      if (kept.length === paragraphs(body.split('\n').slice(0, -1)).length) return block

      stripped++
      if (!kept.length) return ''

      const rendered = kept
        .map((paragraph) => paragraph.map((l) => l.line).join('\n'))
        .join(`\n${indent} *\n`)
      return `${indent}/**\n${rendered}\n${indent} */\n`
    },
  )

  if (updated !== source) writeFileSync(file, updated, 'utf8')
}

console.log(`stripped the subpath note from ${stripped} declaration comment(s)`)
