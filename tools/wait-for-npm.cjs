const { execFileSync } = require('child_process')
const { name } = require('../package.json')

const NOTICE_START = '<!-- npm-publish-pending:start -->'
const NOTICE_END = '<!-- npm-publish-pending:end -->'
const MAX_WAIT = 60 * 60_000
const RETRY_INTERVAL = 60_000
const REQUEST_TIMEOUT = 15_000

const notice = `${NOTICE_START}
> [!NOTE]
> The npm package has been staged and is pending npm approval. It will become available after publish-time scanning completes.
${NOTICE_END}`

function addPendingNotice(body) {
  if (body.includes(NOTICE_START)) {
    return body
  }

  return `${notice}\n\n${body}`
}

function removePendingNotice(body) {
  const start = body.indexOf(NOTICE_START)
  if (start === -1) {
    return body
  }

  const end = body.indexOf(NOTICE_END, start)
  if (end === -1) {
    throw new Error('npm pending notice is missing its closing marker')
  }

  const afterNotice = end + NOTICE_END.length
  const separatorLength = body.startsWith('\n\n', afterNotice)
    ? 2
    : Number(body.startsWith('\n', afterNotice))

  return `${body.slice(0, start)}${body.slice(afterNotice + separatorLength)}`
}

function ghApi(endpoint, options = {}) {
  const args = ['api']
  if (options.method) {
    args.push('--method', options.method)
  }
  if (options.input) {
    args.push('--input', '-')
  }
  args.push(endpoint)

  return execFileSync('gh', args, {
    encoding: 'utf8',
    input: options.input,
    stdio: ['pipe', 'pipe', 'inherit'],
  })
}

function updateBody(endpoint, body) {
  ghApi(endpoint, {
    method: 'PATCH',
    input: JSON.stringify({ body }),
  })
}

function updateDiscussionBody(discussionId, body) {
  ghApi('graphql', {
    method: 'POST',
    input: JSON.stringify({
      query: `mutation($discussionId: ID!, $body: String!) {
        updateDiscussion(input: { discussionId: $discussionId, body: $body }) {
          discussion { id }
        }
      }`,
      variables: { discussionId, body },
    }),
  })
}

function discussionEndpoint(repository, discussionUrl) {
  const url = new URL(discussionUrl)
  const match = /^\/[^/]+\/[^/]+\/discussions\/(\d+)$/.exec(url.pathname)
  if (!match) {
    throw new Error(`unexpected release discussion URL: ${discussionUrl}`)
  }

  return `repos/${repository}/discussions/${match[1]}`
}

function updateReleaseBodies(repository, tag, transform) {
  const releaseEndpoint = `repos/${repository}/releases/tags/${encodeURIComponent(tag)}`
  const release = JSON.parse(ghApi(releaseEndpoint))
  if (!release.discussion_url) {
    throw new Error(`release ${tag} does not have a linked discussion`)
  }

  const linkedDiscussionEndpoint = discussionEndpoint(repository, release.discussion_url)
  const discussion = JSON.parse(ghApi(linkedDiscussionEndpoint))
  const releaseBody = transform(release.body || '')
  const discussionBody = transform(discussion.body || '')

  if (releaseBody !== release.body) {
    updateBody(`repos/${repository}/releases/${release.id}`, releaseBody)
  }
  if (discussionBody !== discussion.body) {
    updateDiscussionBody(discussion.node_id, discussionBody)
  }
}

function markReleasePending(repository, tag) {
  updateReleaseBodies(repository, tag, addPendingNotice)
}

function finalizeRelease(repository, tag) {
  updateReleaseBodies(repository, tag, removePendingNotice)
}

async function isPublished(version) {
  const response = await fetch(
    `https://registry.npmjs.org/${encodeURIComponent(name)}/${encodeURIComponent(version)}`,
    {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT),
    },
  )

  if (response.status === 404) {
    return false
  }
  if (!response.ok) {
    throw new Error(`npm registry returned ${response.status} ${response.statusText}`)
  }

  const manifest = await response.json()
  return manifest.version === version
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  const repository = process.env.GITHUB_REPOSITORY
  const tag = process.env.RELEASE_TAG || process.env.GITHUB_REF_NAME
  if (!repository || !tag) {
    throw new Error('GITHUB_REPOSITORY and RELEASE_TAG or GITHUB_REF_NAME must be set')
  }

  const match = /^v(\d+\.\d+\.\d+)$/.exec(tag)
  if (!match) {
    throw new Error(`unexpected release tag: ${tag}`)
  }
  const version = match[1]

  const deadline = Date.now() + MAX_WAIT
  let attempt = 1

  while (Date.now() < deadline) {
    let published = false
    try {
      published = await isPublished(version)
    } catch (error) {
      console.warn(`npm availability check failed: ${error.message}`)
    }

    if (published) {
      finalizeRelease(repository, tag)
      console.log(`${name}@${version} is available on npm; removed the pending notice`)
      return
    }

    if (attempt === 1) {
      markReleasePending(repository, tag)
      console.log(`npm pending notice is present on release ${tag} and its discussion`)
    }

    const remaining = deadline - Date.now()
    if (remaining > 0) {
      console.log(`${name}@${version} is not available on npm; retrying in one minute`)
      await wait(Math.min(RETRY_INTERVAL, remaining))
      attempt++
    }
  }

  throw new Error(
    `${name}@${version} was not available on npm after ${attempt} attempts in one hour`,
  )
}

module.exports = {
  addPendingNotice,
  discussionEndpoint,
  removePendingNotice,
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
