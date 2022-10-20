const files = [
  "./test/**/*.test.mjs"
]

const environmentVariables = {}

if ('CITGM' in process.env) {
  files.push("!**/remote.test.mjs")
}

if ('electron' in process.versions) {
  files.push("!**/rsa-pss.test.mjs")
}

module.exports = {
  require: [
    "./test/.require.mjs"
  ],
  files,
  environmentVariables,
};
