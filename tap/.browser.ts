import { t, Selector } from 'testcafe'

fixture('test suite').page('https://important-clam-66.deno.dev')

import * as fs from 'node:fs'

const script = fs.readFileSync('./tap/run-browser.js', { encoding: 'utf-8' })

const scriptTag = Selector('script')

test('passes tests', async (user) => {
  await user.typeText('#js', script, { paste: true }).click('[type=submit]')

  await scriptTag()

  let stats
  do {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    stats = await t.eval(() => globalThis.stats)
  } while (!stats)

  const { log } = await t.getBrowserConsoleMessages()
  for (const entry of log) {
    console.log(entry)
  }

  await t.expect(stats?.failed).eql(0)
})
