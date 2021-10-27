const { execSync } = require('child_process')

const output = execSync(
  `curl -su "${process.env.BROWSERSTACK_USERNAME}:${process.env.BROWSERSTACK_ACCESS_KEY}" -X GET https://api.browserstack.com/5/workers`,
)

const workers = JSON.parse(output)

console.log('workers', workers)

for (const { id } of workers) {
  console.log(
    id,
    JSON.parse(
      execSync(
        `curl -su "${process.env.BROWSERSTACK_USERNAME}:${process.env.BROWSERSTACK_ACCESS_KEY}" -X DELETE https://api.browserstack.com/5/worker/${id}`,
      ),
    ),
  )
}

process.exitCode = 0
