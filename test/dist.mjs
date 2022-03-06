import test from 'ava'

let root
let keyRoot

if ('WEBCRYPTO' in process.env) {
  root = keyRoot = '#dist/webcrypto'
} else if ('CRYPTOKEY' in process.env) {
  root = '#dist'
  keyRoot = '#dist/webcrypto'
} else if ('WEBAPI' in process.env) {
  root = keyRoot = '#dist/webapi'
} else {
  root = keyRoot = '#dist'
}

export { root, keyRoot }

export function conditional({ webcrypto = 1, electron = 1 } = {}) {
  let run = test
  if (
    !webcrypto &&
    ('WEBCRYPTO' in process.env || 'WEBAPI' in process.env || 'CRYPTOKEY' in process.env)
  ) {
    run = run.failing
  }

  if (!electron && 'electron' in process.versions) {
    run = run.failing
  }
  return run
}
