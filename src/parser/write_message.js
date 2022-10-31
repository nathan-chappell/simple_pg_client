const { Writable } = require('node:stream')
const { int16ToBytes, int32ToBytes } = require('./bytes.js')

/**
 * @typedef MessageSpec
 * @type {object}
 * @property {string} type
 * @property {number | Array.<number> | string | Array.<string>} value
 */

/**
 * @param {MessageSpec} messageSpec
 * @returns {Array.<number>} Array of bytes.
 */
function getArrayChunk(messageSpec) {
    const v = messageSpec.value
    switch (messageSpec.type) {
        case 'Byte1': return [typeof v === 'string' ? v.charCodeAt(0) : v]
        case 'Byte4': return v
        case 'Byte[]': return [...int32ToBytes(v.length), ...v]
        case 'Byte[][]': return [...int32ToBytes(v.length), ...v.map(a => getArrayChunk({ value: a, type: 'Byte[]' })).flat(3)]
        case 'Int16': return int16ToBytes(v)
        case 'Int16[]': return [int16ToBytes(v.length), int16ToBytes(v)]
        case 'Int32': return int32ToBytes(v)
        case 'String': return [...Array.from(v).map(c => c.charCodeAt(0)), 0]
    }
}

/**
 * @param {string} type
 * @param {Array.<MessageSpec>} message
 */
function getBuffer(type, message) {
    if (type.length > 1) throw new Error(`The type of message must be a string of length 1, got ${type}`)
    typeChunk = [type.charCodeAt(0)]
    messageChunk = message.map(getArrayChunk).flat(3)
    lengthChunk = int32ToBytes(typeChunk.length + messageChunk.length + 4)
    return Buffer.from(Uint8Array.from([typeChunk, lengthChunk, messageChunk].flat(3)), { objectMode: false })
}

/**
 * @param {Writable} writable
 * @param {string} type
 * @param {Array.<MessageSpec>} message
 * @returns {Promise}
 */
function writeMessage(writable, type, message) {
    const buffer = getBuffer(type, message)
    // console.log(`writeMessage: ${buffer.toString('hex')}`)
    let res
    const promise = new Promise(_res => { res = _res })
    // writable.write(buffer, e => res(e))
    writable.write(buffer, e => res(e))
    return promise.then(e => { if (e) { throw e } })
}

module.exports = {
    getBuffer,
    writeMessage,
}