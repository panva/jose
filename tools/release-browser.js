const { readFileSync, writeFileSync, unlinkSync } = require("fs");
const { execSync } = require("child_process");

const originalREADME = readFileSync("./README.md");
const originalPackage = readFileSync("./package.json");
const originalChangelog = readFileSync("./CHANGELOG.md");
const package = JSON.parse(readFileSync("./package.json"));
delete package.devDependencies;
delete package.scripts;
delete package.imports;

package.description = package.description.replace(
  "Universal ",
  "(Browser Runtime) "
);

for (const exportPath of Object.keys(package.exports)) {
  if (exportPath.startsWith("./webcrypto")) {
    delete package.exports[exportPath];
  } else if (
    typeof package.exports[exportPath] === "object" &&
    "browser" in package.exports[exportPath]
  ) {
    package.exports[exportPath] = package.exports[exportPath].browser;
  }
}

const deletedKeywords = new Set([
  "okp",
  "secp256k1",
  "universal",
  "eddsa",
  "isomorphic",
  "electron",
]);
package.keywords = package.keywords.filter((keyword) => {
  return !deletedKeywords.has(keyword);
});

package.files.push("!dist/node/**/*");
package.files.push("!dist/**/package.json");

package.name = "jose-browser-runtime";
package.type = "module";

writeFileSync("./package.json", JSON.stringify(package, null, 2) + "\n");
writeFileSync(
  "./README.md",
  `# jose

> ${package.description} using Web Cryptography API.

⚠️ This distribution only supports the Browser ESM runtime.
Its purpose is to offer a distribution of \`jose\` with a smaller bundle/install
size before tree-shaking.

For the universal module see [npmjs.com/package/jose](https://www.npmjs.com/package/jose)

## Support

If you or your business use \`jose\`, please consider becoming a [sponsor][support-sponsor] so I can continue maintaining it and adding new features carefree.

## Install

\`\`\`console
npm install jose@npm:${package.name}
\`\`\`

## Documentation

See [${package.homepage.replace("https://", "")}](${package.homepage})

[support-sponsor]: https://github.com/sponsors/panva
`
);
unlinkSync("./CHANGELOG.md");

// Release
execSync("npm publish");

writeFileSync("./package.json", originalPackage);
writeFileSync("./CHANGELOG.md", originalChangelog);
writeFileSync("./README.md", originalREADME);
