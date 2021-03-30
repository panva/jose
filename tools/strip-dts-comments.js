const { writeFileSync, readFileSync } = require("fs");

const file = "./dist/types/types.d.ts";
const types = readFileSync(file, { encoding: "utf-8" });

const regexJSDocs = /^[\t\s]*\/\*\*[^!#*][\s\S]*?\*\/[\r\n]?/gm;
const regexMultilines = /^[\t\s]*\/\*[^!#*][\s\S]*?\*\/[\r\n]?/gm;
const emptyLines = /^\s*\n/gm;

writeFileSync(
  file,
  types
    .replace(regexJSDocs, "")
    .replace(regexMultilines, "")
    .replace(emptyLines, "")
);
