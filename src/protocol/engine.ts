import { NamedTypedValue } from '../messages/ITypedValue.ts'
import { parseBackendMessage, IBackendMessage } from '../messages/messageFormats.generated.ts'
import { MessageWriterAdapter } from '../messages/messageWriterAdapter.ts'
import { DataTypeAdapter } from '../streams/dataTypeAdapter.ts'
import { delay } from './delay.ts'
import { IProtocol, IState } from './IProtocol.ts'

export class Engine {
    delay_ms = 10
    delay: ReturnType<typeof delay> | null = null
    writeDelay: ReturnType<typeof delay> | null = null
    rxQueue: IBackendMessage[] = []
    txQueue: NamedTypedValue[][] = []
    running = false
    readingPromise: Promise<void> | null = null
    writingPromise: Promise<void> | null = null

    history: IState[] = []

    constructor(
        public dataReader: DataTypeAdapter,
        public messageWriter: MessageWriterAdapter,
        public protocol: IProtocol,
        public state: IState = { name: 'Initial' },
    ) {}

    async start() {
        this.running = true
        this.readingPromise = this.startReading()
        this.writingPromise = this.startWriting()

        while (true) {
            if (this.rxQueue.length === 0 && this.txQueue.length === 0) {
                this.delay = delay(this.delay_ms)
                await this.delay
            } else {
                const message = this.rxQueue.shift()!
                await this.handleMessage(message)
            }
        }
    }

    async handleMessage(message: IBackendMessage) {
        const handler = this.protocol[this.state.name]
        if (typeof handler === 'function') {
            this.history.push(this.state)
            this.state = await handler(this.state, message)
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
                this.messageWriter.writeMessage(message)
            }
        }
    }

    stop(): Promise<unknown[]> {
        this.running = false
        this.messageWriter.release()
        if (this.delay !== null) this.delay.cancel()
        if (this.writeDelay !== null) this.writeDelay.cancel()
        return Promise.all([this.dataReader.release(), this.readingPromise, this.writingPromise])
    }
}
