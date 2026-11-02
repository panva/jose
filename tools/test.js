import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

function discover(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = join(directory, entry.name)
    if (entry.isDirectory()) return discover(file)
    if (!entry.isFile() || !entry.name.endsWith('.test.ts')) return []
    if ('CITGM' in process.env && entry.name === 'remote.test.ts') return []
    return [file]
  })
}

const result = spawnSync(
  process.execPath,
  ['--test', ...process.argv.slice(2), ...discover('test').sort()],
  { stdio: 'inherit' },
)
if (result.error) throw result.error
if (result.signal) process.kill(process.pid, result.signal)
else process.exitCode = result.status ?? 1
