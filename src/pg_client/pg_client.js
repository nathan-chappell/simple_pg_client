const { createConnection } = require('net')
const { Readable, Writable } = require('node:stream')

const { writeMessage } = require('../parser/write_message.js')
const { readMessages } = require('../parser/read_message.js')
const { makeParseInfoTree } = require('../parser/parse_info_tree.js')
const { backEndFormat } = require('../parser/message_format.js')

const backEndFormatTree = makeParseInfoTree(backEndFormat)

/**
 * @typedef {import('./write_message').MessageSpec} MessageSpec
 */

class PgClient {
    /**
     * @param {Readable} readable 
     * @param {Writable} writeable 
     */
    constructor(readable, writeable, defaultMessageHandler = null) {
        this.readable = readable
        this.writeable = writeable
        this.rx = readMessages(this.readable, backEndFormatTree)

        this.handlers = {}
        this.defaultMessageHandler = defaultMessageHandler || (message => console.log(JSON.stringify(message, null, 2)))
    }

    writeMessage(type, message) {
        return writeMessage(this.writeable, type, message)
    }

    logMessage(message) {
        console.log(JSON.stringify(message, null, 2))
    }

    async receive(untilType = null) {
        while (this.readable.readable) {
            const { value } = await this.rx.next()
            const handler = this.handlers[value.messageType] || this.defaultMessageHandler
            handler(value)
            // console.log(JSON.stringify(value))
            if (untilType == null || value.messageType == untilType)
                return value
        }
        console.log('no longer receiving')
    }

    async startup(user, database) {
        if (!user || !database) throw new Error(`Please provide a user and database for startup`)
        const message = [
            { type: 'Int32', value: 196608 },
            { type: 'String', value: 'user' },
            { type: 'String', value: user },
            { type: 'String', value: 'database' },
            { type: 'String', value: database },
            { type: 'Byte1', value: 0 },
        ]
        await this.writeMessage(null, message)
        return this.receive('AuthenticationOk')
        // return this.receive('ReadyForQuery')
    }

    async query(queryString) {
        const message = [
            { type: 'String', value: queryString },
        ]
        // await this.writeMessage('7', message)
        await this.writeMessage('Q', message)
        // await this.receive('ErrorResponse')
        console.log('foobar')
    }
}

/**
 * @callback MessageHandler
 * @param {{messageType: string, message: Array.<MessageSpec>}} response
 * @returns {void}
 */

class TcpPgClient extends PgClient {
    /**
     * @param {{port: number, host: string, defaultMessageHandler: MessageHandler}} options 
     */
    constructor(connectionOptions, defaultMessageHandler = null) {
        const socket = createConnection(connectionOptions)
        super(socket, socket, defaultMessageHandler)
        this.socket = socket
    }

    async close() {
        this.rx.return({ messageType: '__CLOSE__', message: [] })
        // console.log('terminating')
        await this.writeMessage('X', [])
        // console.log('ending')
        this.socket.end()
        // console.log('destroying')
        this.socket.destroy()
    }
}

module.exports = {
    TcpPgClient,
}