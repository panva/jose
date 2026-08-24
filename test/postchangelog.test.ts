import { createRequire } from 'node:module'

import test from 'ava'

const { formatChangelog } = createRequire(import.meta.url)('../tools/postchangelog.cjs') as {
  formatChangelog(changelog: string): string
}

test('formats and separates release headings', (t) => {
  const malformed = [
    '# Changelog',
    '',
    '### [2.0.0](new)',
    '',
    '* changed',
    '## [1.0.0](previous)',
    '',
    '* changed before',
    '## 0.9.0 (initial)',
    '',
  ].join('\n')
  const expected = [
    '# Changelog',
    '',
    '## [2.0.0](new)',
    '',
    '* changed',
    '',
    '## [1.0.0](previous)',
    '',
    '* changed before',
    '',
    '## 0.9.0 (initial)',
    '',
  ].join('\n')

  t.is(formatChangelog(malformed), expected)
  t.is(formatChangelog(expected), expected)
})

test('preserves CRLF newlines', (t) => {
  const malformed = '* changed\r\n## [1.0.0](previous)\r\n'
  const expected = '* changed\r\n\r\n## [1.0.0](previous)\r\n'

  t.is(formatChangelog(malformed), expected)
})
