const { Readable } = require('node:stream');

const delay = t => new Promise(res => setTimeout(res, t));

/**
 * @callback Reader
 * @param {Readable}
 * @returns {null | any}
 */

/**
 * 
 * @param {Readable} readable 
 * @param {Reader} reader 
 * @param {number} time 
 */
async function poll(readable, reader, time = 10) {
    while (!readable.closed) {
        const result = reader(readable);
        if (result !== null) {
            return result;
        } else {
            await delay(time * (Math.random() / 4 + 1));
        }
    }
    throw new Error("readable closed while polling");
}

/**
 * @param {Readable} readable
 */
function parseInt16(readable) {
    return poll(readable, _stream => _stream.read(2)).then(bytes => (bytes[0] << 8) | bytes[1]);
}

/**
 * @param {Readable} stream
 */
function parseInt32(stream) {
    return poll(stream, _stream => _stream.read(4).then(bytes => (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[0]));
}

module.exports = {
    parseInt16,
    parseInt32,
};