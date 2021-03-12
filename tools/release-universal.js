const { readFileSync, writeFileSync, unlinkSync } = require("fs");
const { execSync } = require("child_process");

const originalPackage = readFileSync("./package.json");
const originalChangelog = readFileSync("./CHANGELOG.md");
const package = JSON.parse(readFileSync("./package.json"));
delete package.devDependencies;
delete package.scripts;
delete package.imports;

writeFileSync("./package.json", JSON.stringify(package, null, 2) + "\n");
unlinkSync("./CHANGELOG.md");

// Release
execSync("npm publish");

writeFileSync("./package.json", originalPackage);
writeFileSync("./CHANGELOG.md", originalChangelog);
