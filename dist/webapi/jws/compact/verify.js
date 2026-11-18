import { prepareVerify, verifyCompact } from "../../lib/jws_verify.js";
async function compactVerify(jws, key, options) {
  const [result] = await verifyCompact(jws, prepareVerify(options), key);
  return result;
}
export {
  compactVerify
};
