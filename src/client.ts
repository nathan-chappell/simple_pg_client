import { mapColumn } from './datamapper.ts'
import {
    makeExecute,
    makePasswordMessage,
    makeQuery,
    makeStartupMessage,
    makeSync,
    makeTerminate,
} from './messages/messageFormats.generated.ts'
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

    constructor(public connector: TConnector, configuration: Partial<typeof defaultConfiguration>) {
        this.configuration = { ...this.configuration, ...configuration }
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
    }

    async startup() {
        if (!this.engine) throw new Error('[startup] failed due to engine failure.')
        this.engine.state.transition('Initial')
        this.enginePromise = this.engine.start()
        this.engine.txQueue.push(
            makeStartupMessage([
                ['user', this.configuration.username],
                ['database', this.configuration.database],
            ]),
        )
        await this.engine!.state.waitFor('Ready')
    }

    async shutdown(): Promise<void> {
        if (!this.engine) throw new Error('[shutdown] failed due to engine failure.')
        // console.log('shutting down')
        this.engine.state.transition('Shutdown')
        this.engine.txQueue.push(makeTerminate())
        try {
            await this.engine.stop()
            // console.log('[shutdown] engine stopped')
            await this.enginePromise
        } catch (error) {
            console.log('[shutdown] caught error')
            console.log(error)
        }
        // console.log('engine stopped')
    }

    async query(
        query: string,
    ): Promise<{ completionMessages: string[]; rowSets: [string, number | string][][][] }> {
        if (!this.engine) throw new Error('[query] failed due to engine failure.')
        this.engine.state.transition('SimpleQuery')
        // this.engine.txQueue.push(makeSync())
        this.engine.txQueue.push(makeQuery(query))
        await this.engine.state.waitFor('Ready')
        // prettier-ignore
        const mapDataset = (dataset: IDataset) => dataset.rows.map(row =>
            row.map((column, i) => [dataset.fields[i].name, mapColumn(column, dataset.fields[i])] as [ string, string | number])
        )

        const result = {
            completionMessages: [...this.engine!.state.completionMessages],
            rowSets: this.engine!.state.datasets.map(mapDataset),
        }

        this.engine.state.completionMessages = []
        this.engine.state.datasets = []
        return result
    }
}
