import { t, Selector } from 'testcafe'
import * as fs from 'node:fs'

const script = fs.readFileSync('./tap/run-browser.js', { encoding: 'utf-8' })

fixture('test suite').page('https://important-clam-66.deno.dev')

test('passes tests', async (user) => {
  const scriptTag = Selector('script')

  await user.typeText('#js', script, { paste: true }).click('[type=submit]')

  await scriptTag()
  let i = 0
  const interval = setInterval(() => {
    t.getBrowserConsoleMessages().then(({ log: messages }) => {
      messages.forEach((message, index) => {
        if (i && index <= i) return
        i++
        console.log(message)
      })
    })
  }, 100)

  let stats
  do {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    stats = await t.eval(() => globalThis.stats)
  } while (!stats)

  clearInterval(interval)

  await t.expect(stats?.failed).eql(0)
})
