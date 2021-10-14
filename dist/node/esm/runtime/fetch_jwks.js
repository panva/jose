import { get as http } from 'http';
import { get as https } from 'https';
import { once } from 'events';
import { JOSEError, JWKSTimeout } from '../util/errors.js';
import { concat, decoder } from '../lib/buffer_utils.js';
const protocols = {
    'https:': https,
    'http:': http,
};
const fetchJwks = async (url, timeout, options) => {
    if (protocols[url.protocol] === undefined) {
        throw new TypeError('Unsupported URL protocol.');
    }
    const { agent } = options;
    const req = protocols[url.protocol](url.href, {
        agent,
        timeout,
    });
    const [response] = (await Promise.race([once(req, 'response'), once(req, 'timeout')]));
    if (!response) {
        req.destroy();
        throw new JWKSTimeout();
    }
    if (response.statusCode !== 200) {
        throw new JOSEError('Expected 200 OK from the JSON Web Key Set HTTP response');
    }
    const parts = [];
    for await (const part of response) {
        parts.push(part);
    }
    try {
        return JSON.parse(decoder.decode(concat(...parts)));
    }
    catch {
        throw new JOSEError('Failed to parse the JSON Web Key Set HTTP response as JSON');
    }
};
export default fetchJwks;
