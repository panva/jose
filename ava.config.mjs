const files = ['test/**/*.test.ts']

if ('CITGM' in process.env) {
  files.push("!**/remote.test.ts")
}

export default {
  extensions: {
    ts: 'module',
    mjs: true,
  },
  files,
  workerThreads: false,
  nodeArguments: ['--enable-source-maps'],
}
