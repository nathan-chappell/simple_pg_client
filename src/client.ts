import { makePasswordMessage, makeQuery, makeStartupMessage } from './messages/messageFormats.generated.ts'
import { MessageWriterAdapter } from './messages/messageWriterAdapter.ts'
import { Engine } from './protocol/engine.ts'
import { frontendProtocol } from './protocol/frontendProtocol.ts'
import { IDataset } from './protocol/IProtocol.ts'
import { DataTypeAdapter } from './streams/dataTypeAdapter.ts'

export interface IReadWriteable {
    readable: ReadableStream<Uint8Array>
    writable: WritableStream<Uint8Array>
}

export type TConnector = ({ hostname, port }: { hostname: string; port: number }) => Promise<IReadWriteable>

export const defaultConfiguration = {
    database: 'postgres',
    username: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
}

export class Client {
    public configuration = defaultConfiguration
    public engine: Engine | null = null
    public enginePromise: Promise<void> | null = null
    // public initPromise: Promise<void>

    constructor(public connector: TConnector, configuration: Partial<typeof defaultConfiguration>) {
        this.configuration = { ...this.configuration, ...configuration }
        // this.initPromise = this.init()
    }

    async init() {
        const readWritable = await this.connector({
            hostname: this.configuration.host,
            port: this.configuration.port,
        })
        const dataReader = new DataTypeAdapter(readWritable.readable)
        const messageWriter = new MessageWriterAdapter(readWritable.writable)
        this.engine = new Engine(dataReader, messageWriter, frontendProtocol, () => {
            messageWriter.writeMessage(makePasswordMessage(this.configuration.password))
        })
        console.debug('[init] complete')
        console.debug(readWritable.readable)
        console.debug(readWritable.writable)
    }

    startup() {
        if (!this.engine) throw new Error('[startup] failed due to engine failure.')
        this.enginePromise = this.engine.start()
        this.engine.state.name = 'Initial'
        this.engine.txQueue.push(
            makeStartupMessage([
                ['user', this.configuration.username],
                ['database', this.configuration.database],
            ])
        )
    }

    async query(query: string): Promise<{ completionMessages: string[]; datasets: IDataset[] }> {
        if (!this.engine) throw new Error('[query] failed due to engine failure.')
        this.engine.state.transition('SimpleQuery')
        this.engine.txQueue.push(makeQuery(query))
        await this.engine.state.waitFor('Ready')
        return {
            completionMessages: this.engine!.state.completionMessages,
            datasets: this.engine!.state.datasets,
        }
    }
}
