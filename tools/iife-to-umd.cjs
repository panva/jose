const { readFileSync, writeFileSync } = require('fs')

const header = `(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.jose = factory());
})(this, (function () { 'use strict';
`

const footer = `}));
`

for (const file of process.argv.slice(2)) {
  let code = readFileSync(file, 'utf8')
  const original = code
  code = code.replace(/^"use strict";\nvar jose = \(\(\) => \{\n/, '')
  code = code.replace(/\}\)\(\);\n$/, '')
  if (code === original) {
    throw new Error(`${file}: IIFE wrapper not found, esbuild output format may have changed`)
  }
  const result = header + code + footer
  if (!result.startsWith('(function (global, factory)')) {
    throw new Error(`${file}: unexpected UMD header`)
  }
  if (!result.endsWith('}));\n')) {
    throw new Error(`${file}: unexpected UMD footer`)
  }
  writeFileSync(file, result)
}
