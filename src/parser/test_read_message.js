const { Readable, Writable } = require('node:stream')

const { makeParseInfoTree } = require('./parse_info_tree.js')
const { writeMessage } = require('./write_message.js')
const { readMessages } = require('./read_message.js')
const exp = require('node:constants')

function test_readMessages() {
    const tree = makeParseInfoTree([
        "A1: Byte1('A') Int32 Int32(0) Byte[]",
        "A2: Byte1('A') Int32 Int32(1) Byte[]",
        "B: Byte1('B') Int32 Int16 Byte[][]",
        "C: Byte1('C') Int32 Int16 Int16[] Int32(1234)",
    ])

    // console.log(JSON.stringify(tree, null, 2))

    const message = [
        { type: "Int32", value: 0 },
        { type: "Byte[]", value: [0xab, 0xcd] },
    ]

    /** @type {Readable} */
    let readable

    const writable = new Writable({
        objectMode: false,
        write: (data, encoding, cb) => {
            readable = Readable.from([data], { objectMode: false })
            // console.log(` readMessage: ${data.toString('hex')}`)
            cb()
        }
    })
    writeMessage(writable, 'A', message).then(async () => {
        const gen = readMessages(readable, tree)
        const { value } = await gen.next()
        const messageType = value.messageType
        const expectedMessageType = 'A1'
        const typeSequence = value.message.map(v => v.type).join(',')
        const expectedTypeSequence = 'Byte1,Int32,Int32,Byte[]'
        const valueSequence = value.message.slice(0, -1).map(v => v.value).join(',')
        if (messageType !== expectedMessageType) throw new Error(`Expected messageType ${expectedMessageType}, got ${messageType}`)
        if (typeSequence !== expectedTypeSequence) throw new Error(`Expected typeSequence ${expectedTypeSequence}, got ${typeSequence}`)
    })
}

function test_readMessages_string() {
    const tree = makeParseInfoTree([
        "A1: Byte1('A') Int32 Int32(0) Byte[]",
        "A2: Byte1('A') Int32 Int32(1) String",
    ])

    // console.log(JSON.stringify(tree, null, 2))

    const message = [
        { type: "Int32", value: 1 },
        { type: "String", value: 'foobar' },
    ]

    /** @type {Readable} */
    let readable

    const writable = new Writable({
        objectMode: false,
        write: (data, encoding, cb) => {
            readable = Readable.from([data], { objectMode: false })
            // console.log(` readMessage: ${data.toString('hex')}`)
            cb()
        }
    })
    writeMessage(writable, 'A', message).then(async () => {
        const gen = readMessages(readable, tree)
        const { value } = await gen.next()
        // console.log(JSON.stringify(value,null,2))
        const messageType = value.messageType
        const expectedMessageType = 'A2'
        const typeSequence = value.message.map(v => v.type).join(',')
        const expectedTypeSequence = 'Byte1,Int32,Int32,String'
        const expectedStringValue = 'foobar';
        const stringValue = value.message[3].value;
        if (messageType !== expectedMessageType) throw new Error(`Expected messageType ${expectedMessageType}, got ${messageType}`)
        if (typeSequence !== expectedTypeSequence) throw new Error(`Expected typeSequence ${expectedTypeSequence}, got ${typeSequence}`)
        if (stringValue !== expectedStringValue) throw new Error(`Expected stringValue ${expectedStringValue}, got ${stringValue}`)
    })
}

test_readMessages()
test_readMessages_string()