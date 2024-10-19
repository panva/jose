import { t, ClientFunction } from 'testcafe'
import * as fs from 'node:fs'

const script = fs.readFileSync('./tap/run-browser.js', { encoding: 'utf-8' })

fixture('test suite').page('https://important-clam-66.deno.dev')

test('passes tests', async (user) => {
  await ClientFunction(
    () => {
      function escapeHTML(str: string) {
        return str
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;')
      }
      // @ts-expect-error
      document.getElementById('js').innerHTML = escapeHTML(innerHTML)
      document.querySelector('form')?.submit()
    },
    { dependencies: { innerHTML: script } },
  )()

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
