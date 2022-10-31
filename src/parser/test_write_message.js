const exp = require("constants")
const { writeMessage, getBuffer } = require("./write_message.js")

function test_getBuffer() {
    const type = 'A'
    const message = [
        { type: "Byte1", value: 'B' },
        { type: "Byte4", value: [0, 1, 2, 3] },
        { type: "Int16", value: 0xabcd },
        { type: "Int32", value: 0x1234abcd },
        { type: "String", value: 'foobar' },
    ]
    const buffer = getBuffer(type, message)
    const expected = [
        0x41,
        0, 0, 0, 0x17, // length 23
        0x42,
        0, 1, 2, 3,
        0xab, 0xcd,
        0x12, 0x34, 0xab, 0xcd,
        ...Array.from('foobar').map(c => c.charCodeAt(0)), 0
    ]
    for (let i = 0; i < expected.length; ++i) {
        if (expected[i] !== buffer[i]) {
            throw new Error(`value mismatch: ${expected[i].toString(16)} ${buffer[i].toString(16)}\ngot: ${buffer.toString('hex')}\nexp: ${expected.map(x => x.toString(16).padStart(2,0)).join('')}`)
        }
    }
}

function test_getBufferByteArray() {
    const type = 'A'
    const message = [
        { type: "Byte[]", value: [0x12,0x34,0xab,0xcd,0xef] },
    ]
    const buffer = getBuffer(type, message)
    const expected = [
        0x41,
        0, 0, 0, 0xe, // length 23
        0, 0, 0, 0x5,
        0x12, 0x34, 0xab, 0xcd, 0xef
    ]
    for (let i = 0; i < expected.length; ++i) {
        if (expected[i] !== buffer[i]) {
            throw new Error(`value mismatch: ${expected[i].toString(16)} ${buffer[i].toString(16)}\ngot: ${buffer.toString('hex')}\nexp: ${expected.map(x => x.toString(16).padStart(2,0)).join('')}`)
        }
    }
}

function test_getBufferByteArrayArray() {
    const type = 'A'
    const message = [
        { type: "Byte[][]", value: [[0x12,0x34], [0xab,0xcd]] },
    ]
    const buffer = getBuffer(type, message)
    const expected = [
        0x41,
        0, 0, 0, 0x15, // length 23
        0, 0, 0, 0x2,
            0, 0, 0, 0x2,
            0x12, 0x34,
            0, 0, 0, 0x2,
            0xab, 0xcd
    ]
    for (let i = 0; i < expected.length; ++i) {
        if (expected[i] !== buffer[i]) {
            throw new Error(`value mismatch: ${expected[i].toString(16)} ${buffer[i].toString(16)}\ngot: ${buffer.toString('hex')}\nexp: ${expected.map(x => x.toString(16).padStart(2,0)).join('')}`)
        }
    }
}

test_getBuffer()
test_getBufferByteArray()
test_getBufferByteArrayArray()