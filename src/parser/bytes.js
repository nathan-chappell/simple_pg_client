const { Buffer } = require('node:buffer')

/**
 * @param {Buffer} bytes
 * @returns {number | Array.<number>}
 */
function bytesToInt16(bytes) {
    const getVal = (i) => (bytes[i * 2 + 0] << 8) | bytes[i * 2 + 1]
    if (bytes.length === 2) {
        return getVal(0)
    } else {
        return [...new Array(bytes.length >> 1)].map((_, i) => getVal(i))
    }
}

const lower8 = value => value % 256;

/**
 * @param {number | Array.<number>} values
 * @returns {Array.<number>} bytes
 */
function int16ToBytes(values) {
    if (typeof values == 'number') {
        values = [values]
    }
    const getVal = (i) => [values[i] >> 8, values[i]].map(lower8)
    const bytes = []
    for (let i = 0; i < values.length; ++i)
        bytes.push(...getVal(i))
    return bytes;
}

/**
 * @param {number | Array.<number>} values
 * @returns {Array.<number>} bytes
 */
 function int32ToBytes(values) {
    if (typeof values == 'number') {
        values = [values]
    }
    const getVal = (i) => [values[i] >> 8*3, values[i] >> 8*2, values[i] >> 8*1, values[i]].map(lower8)
    const bytes = []
    for (let i = 0; i < values.length; ++i)
        bytes.push(...getVal(i))
    return bytes;
}

/**
 * @param {Buffer} bytes
 * @returns {number | Array.<number>}
 */
function bytesToInt32(bytes) {
    const getVal = (i) =>
        (bytes[4 * i + 0] << 24) | (bytes[4 * i + 1] << 16) | (bytes[4 * i + 2] << 8) | bytes[4 * i + 3]
    if (bytes.length === 4) {
        return getVal(0)
    } else {
        return [...new Array(bytes.length >> 2)].map((_, i) => getVal(i))
    }
}

module.exports = {
    bytesToInt16,
    int16ToBytes,
    bytesToInt32,
    int32ToBytes,
}