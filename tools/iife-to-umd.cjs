const { readFileSync, writeFileSync } = require('fs')

// esbuild writes its --global-name into the IIFE preamble. The UMD wrapper reuses it as the browser
// global, so it is read back out of the bundle rather than spelled out a second time here - each
// entry point has its own (`jose`, `httpsig`).
const preamble = /^"use strict";\nvar ([A-Za-z_$][\w$]*) = \(\(\) => \{\n/
const trailer = /\}\)\(\);\n$/

const header = (name) => `(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.${name} = factory());
})(this, (function () { 'use strict';
`

const footer = `}));
`

for (const file of process.argv.slice(2)) {
  const original = readFileSync(file, 'utf8')
  const name = original.match(preamble)?.[1]
  if (!name || !trailer.test(original)) {
    throw new Error(`${file}: IIFE wrapper not found, esbuild output format may have changed`)
  }
  const code = original.replace(preamble, '').replace(trailer, '')
  const result = header(name) + code + footer
  if (!result.startsWith('(function (global, factory)')) {
    throw new Error(`${file}: unexpected UMD header`)
  }
  if (!result.endsWith('}));\n')) {
    throw new Error(`${file}: unexpected UMD footer`)
  }
  writeFileSync(file, result)
}
