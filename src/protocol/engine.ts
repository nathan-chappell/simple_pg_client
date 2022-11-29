import { NamedTypedValue } from '../messages/ITypedValue.ts'
import { parseBackendMessage, IBackendMessage } from '../messages/messageFormats.generated.ts'
import { MessageWriterAdapter } from '../messages/messageWriterAdapter.ts'
import { DataTypeAdapter } from '../streams/dataTypeAdapter.ts'
import { delay } from './delay.ts'
import { IProtocol, ProtocolState } from './IProtocol.ts'

export class Engine {
    delay_ms = 10
    delay: ReturnType<typeof delay> | null = null
    writeDelay: ReturnType<typeof delay> | null = null
    rxQueue: IBackendMessage[] = []
    txQueue: NamedTypedValue[][] = []
    running = false
    readingPromise: Promise<void> | null = null
    writingPromise: Promise<void> | null = null

    constructor(
        public dataReader: DataTypeAdapter,
        public messageWriter: MessageWriterAdapter,
        public protocol: IProtocol,
        public sendPassword: () => void,
        public state: ProtocolState = new ProtocolState('Initial', sendPassword),
    ) {}

    async start() {
        this.running = true
        this.readingPromise = this.startReading()
        this.writingPromise = this.startWriting()

        while (this.running) {
            if (this.rxQueue.length === 0) {
                this.delay = delay(this.delay_ms)
                await this.delay
            } else {
                const message = this.rxQueue.shift()!
                try {
                    this.handleMessage(message)
                } catch (error) {
                    console.error(error)
                    throw error
                }
            }
        }
    }

    handleMessage(message: IBackendMessage) {
        // console.debug(`[Engine] handleMessage (${message.messageType})[${message.length}]`)
        const handler = this.protocol[this.state.name]
        if (typeof handler === 'function') {
            handler(this.state, message)
        } else {
            throw new Error(`No handler found for state ${this.state.name}`)
        }
    }

    async startReading() {
        while (this.running) {
            const message = await parseBackendMessage(this.dataReader)
            this.rxQueue.push(message)
        }
    }

    async startWriting() {
        while (this.running) {
            if (this.txQueue.length === 0) {
                this.writeDelay = delay(this.delay_ms)
                await this.writeDelay
            } else {
                const message = this.txQueue.shift()!
                await this.messageWriter.writeMessage(message)
            }
        }
    }

    async stop(): Promise<void> {
        // console.debug('[Engine] stop')
        this.running = false
        this.messageWriter.release()

        if (this.delay !== null) this.delay.cancel()
        await this.delay
        if (this.writeDelay !== null) this.writeDelay.cancel()
        await this.writeDelay

        // console.debug('[Engine] delays awaited')

        await this.dataReader.release()
        // console.debug('[Engine] dataReader released')

        // const logError = (e: Error) => { console.log(e) }
        const logError = (e: Error) => { }
        await Promise.all([
            this.readingPromise?.catch(logError),
            this.writingPromise?.catch(logError)
        ])
        // console.debug('[Engine] done reading/writing')
    }
}
