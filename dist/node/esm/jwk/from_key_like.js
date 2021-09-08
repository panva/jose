import asJWK from '../runtime/key_to_jwk.js';
async function fromKeyLike(key) {
    return asJWK(key);
}
export { fromKeyLike };
export default fromKeyLike;
