const files = [
  "./test/**/*.test.mjs"
]

if ('CITGM' in process.env) {
  files.push("!**/remote.test.mjs")
}

module.exports = {
  require: [
    "./test/.require.mjs"
  ],
  files
};
