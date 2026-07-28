// Prepares the JSDoc in the published declarations for where it is actually read - an editor hover
// - by dropping what is written for the generated documentation and rewriting what only renders
// correctly on a docs page. docs/ is generated from src, so it keeps all of it.
//
//   @example blocks       - 22% of dist/types, and typedoc renders them on the page the reader is
//                           already on. Stripping them is not new: tools/postbump.cjs did it at
//                           release time, but its stripper treated any fence that was not ```js as
//                           the end of the example, so a ```ts one ended removal at the opening
//                           fence and left the body behind. jose 6.2.3 and 6.2.4 ship five orphaned
//                           code blocks and three stray `// @ts-ignore` lines in
//                           dist/types/jwks/remote.d.ts because of it. Doing it here instead puts
//                           the result under the type and packaging gates, and makes a local build
//                           match what is published.
//
//   the subpath note      - "This function is exported (as a named export) from the main 'jose'
//                           module entry point as well as from its subpath export
//                           'jose/jwt/verify'." and its variants. Load-bearing on a docs page,
//                           since typedoc names its folders after source paths and that sentence is
//                           the only place the real specifier appears; noise in an editor hover.
//
//   @ignore and friends   - typedoc acts on them, TypeScript does not, so they reach the reader as
//                           a bare tag that means nothing to them.
//
//   GitHub alerts         - `> [!NOTE]` and the rest of the GFM set render as an admonition on
//                           GitHub and in the docs, and as a literal `[!NOTE]\` in a hover. The
//                           blockquote itself does carry over, so keep it and label it in words.
import { globSync, readFileSync, writeFileSync } from 'node:fs'

const SUBPATH_NOTE = /^(?:This|These)\b[^.]*\bexported\b/
const BLOCK_TAG = /^@(\w+)/
const MARKER_TAG = /^@(?:ignore|internal|private|hidden)\s*$/
/** The five alert types GitHub Flavored Markdown defines. */
const ALERT = /^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\\?\s*$/

/**
 * Splits the text lines of a JSDoc body into paragraphs. Fenced code blocks stay whole, so neither
 * a blank line nor a leading `@` inside one splits a paragraph or reads as a tag.
 */
function paragraphs(lines) {
  const out = []
  let current = []
  let fenced = false

  for (const line of lines) {
    if (line.trimStart().startsWith('```')) fenced = !fenced
    if (!fenced && line.trim() === '') {
      if (current.length) out.push(current)
      current = []
      continue
    }
    current.push(line)
  }
  if (current.length) out.push(current)
  return out
}

/** Turns `> [!NOTE]\` followed by the quote into a quote that opens with `Note:`. */
function relabelAlert(paragraph) {
  const [marker, ...rest] = paragraph
  const type = marker.trim().match(ALERT)?.[1]
  if (!type || !rest.length) return null

  const label = type.charAt(0) + type.slice(1).toLowerCase()
  return [rest[0].replace(/^(\s*>\s*)/, `$1${label}: `), ...rest.slice(1)]
}

function transform(lines) {
  const kept = []
  let changed = false
  // an @example runs until the next block tag that is not itself an @example - its description and
  // its code fence are separate paragraphs, and there may be several in a row
  let inExample = false

  for (const paragraph of paragraphs(lines)) {
    const tag = paragraph[0].match(BLOCK_TAG)?.[1]

    if (tag === 'example') {
      inExample = true
      changed = true
      continue
    }
    if (inExample) {
      if (!tag) {
        changed = true
        continue
      }
      inExample = false
    }
    if (SUBPATH_NOTE.test(paragraph[0]) || MARKER_TAG.test(paragraph[0])) {
      changed = true
      continue
    }

    const relabelled = relabelAlert(paragraph)
    if (relabelled) changed = true
    kept.push(relabelled ?? paragraph)
  }

  return { kept, changed }
}

let touched = 0

for (const file of globSync('dist/types/**/*.d.ts')) {
  const source = readFileSync(file, 'utf8')

  // prettier-plugin-jsdoc puts the summary on the `/**` line when it fits, so both shapes occur
  const updated = source.replace(
    /^([ \t]*)\/\*\*[ \t]?([\s\S]*?)[ \t]*\*\/[ \t]*\n/gm,
    (block, indent, body) => {
      const lines = body.split('\n').map((line) => line.replace(/^[ \t]*\*[ \t]?/, ''))
      while (lines.length && lines.at(-1).trim() === '') lines.pop()

      const { kept, changed } = transform(lines)
      if (!changed) return block

      touched++
      if (!kept.length) return ''

      const flat = kept.flatMap((paragraph, i) => (i ? ['', ...paragraph] : paragraph))
      if (flat.length === 1) return `${indent}/** ${flat[0]} */\n`

      const rendered = flat.map((line) => (line ? `${indent} * ${line}` : `${indent} *`)).join('\n')
      return `${indent}/**\n${rendered}\n${indent} */\n`
    },
  )

  if (updated !== source) writeFileSync(file, updated, 'utf8')
}

console.log(`rewrote ${touched} declaration comment(s) for editor hovers`)
