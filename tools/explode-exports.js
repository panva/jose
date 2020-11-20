const { writeFileSync } = require("fs");
const package = require("../package.json");
const glob = require("glob");

const modules = [
  "src/jwe",
  "src/jwk",
  "src/jwks",
  "src/jws",
  "src/jwt",
  "src/util",
];

const all = modules.map((path) => glob.sync(`${path}/**/*.ts`)).flat(Infinity);

const exp = all.reduce((acc, mod) => {
  const len = mod.length;
  const foo = mod.substring(4, len - 3);
  acc["./" + foo] = {
    browser: "./dist/browser/" + foo + ".js",
    import: "./dist/node/esm/" + foo + ".js",
    require: "./dist/node/cjs/" + foo + ".js",
  };
  acc["./webcrypto/" + foo] = {
    import: "./dist/node/webcrypto/esm/" + foo + ".js",
    require: "./dist/node/webcrypto/cjs/" + foo + ".js",
  };
  return acc;
}, {});

package.exports = exp;

writeFileSync("package.json", JSON.stringify(package, null, 2) + "\n");
