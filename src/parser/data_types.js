const { Readable } = require("node:stream");

const delay = (t) => new Promise((res) => setTimeout(res, t));

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
 *
 * @param {Buffer} bytes
 */
function bytesToInt16(bytes) {
    const getVal = (i) => (bytes[i * 2 + 0] << 8) | bytes[i * 2 + 1];
    if (bytes.length === 2) {
        return getVal(0);
    } else {
        return [...new Array(bytes.length >> 1)].map((_, i) => getVal(i));
    }
}

/**
 *
 * @param {Buffer} bytes
 */
function bytesToInt32(bytes) {
    const getVal = (i) =>
        (bytes[4 * i + 0] << 24) | (bytes[4 * i + 1] << 16) | (bytes[4 * i + 2] << 8) | bytes[4 * i + 3];
    if (bytes.length === 4) {
        return getVal(0);
    } else {
        return [...new Array(bytes.length >> 2)].map((_, i) => getVal(i));
    }
}

/**
 * @param {Readable} readable
 */
function readInt16(readable, length = 1) {
    return poll(readable, (_stream) => _stream.read(2 * length)).then(bytesToInt16);
}

/**
 * @param {Readable} readable
 */
function readInt32(readable, length = 1) {
    return poll(readable, (_stream) => _stream.read(4 * length)).then(bytesToInt32);
}

/**
 * @param {Readable} readable
 */
function readBytes(readable, length = 1) {
    return poll(readable, (_stream) => _stream.read(length)).then(Array.from);
}

/**
 * @param {Readable} readable
 */
async function readString(readable) {
    chars = [];
    while (!readable.closed) {
        nextChar = await poll(readable, (_stream) => _stream.read(1));
        if (nextChar[0] === 0) {
            return chars.join("");
        } else {
            chars.push(nextChar.toString("ascii"));
        }
    }
}

module.exports = {
    readInt16,
    readInt32,
    readBytes,
    readString,
};
