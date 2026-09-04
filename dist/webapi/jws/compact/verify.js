import { prepareVerify, verifyCompact } from "../../lib/jws_verify.js";
async function compactVerify(jws, key, options) {
  const verified = await verifyCompact(jws, prepareVerify(options), key), result = { payload: verified[0], protectedHeader: verified[1] };
  return typeof key == "function" ? { ...result, key: verified[3] } : result;
}
export {
  compactVerify
};
