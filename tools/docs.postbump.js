require("./explode-exports");
const { execSync } = require("child_process");
const { readFileSync, writeFileSync } = require("fs");
const { version } = require("../package.json");

const readme = readFileSync("docs/README.md");
const tagName = `v${version}`;

execSync("git rm docs/**/*.md");
execSync('find docs -type d | grep "docs/" | xargs rm -rf');
execSync(`npm run docs:generate -- --gitRevision ${tagName}`);
writeFileSync("docs/README.md", readme);
execSync("git add docs/**/*.md");
