const { writeFileSync } = require("fs");
const package = require("../package.json");
const glob = require("glob");

const modules = [
  "src/jwe",
  "src/jwk",
  "src/jwks",
  "src/jws",
  "src/jwt",
  "src/key",
  "src/util",
];

const all = modules.map((path) => glob.sync(`${path}/**/*.ts`)).flat(Infinity);

const exp = all.reduce(
  (acc, mod) => {
    if (mod === "src/jwt/produce.ts") {
      return acc;
    }
    const len = mod.length;
    const foo = mod.substring(4, len - 3);
    acc["./" + foo] = {
      browser: "./dist/browser/" + foo + ".js",
      import: "./dist/node/esm/" + foo + ".js",
      require: "./dist/node/cjs/" + foo + ".js",
    };
    return acc;
  },
  { "./package.json": "./package.json" }
);

package.exports = exp;

writeFileSync("package.json", JSON.stringify(package, null, 2) + "\n");
