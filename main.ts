import { Client, TConnector } from './src/client.ts'
import { mapColumn } from './src/datamapper.ts'
import { IField } from './src/messages/messageFormats.generated.ts'
import { IDataset } from './src/protocol/IProtocol.ts'

const connector: TConnector = ({ hostname, port }) => Deno.connect({ hostname, port })

export const client = new Client(connector, {
    database: 'postgres',
    host: 'localhost',
    password: 'postgres',
    port: 5432,
    username: 'postgres',
})

export const testClient = async (client: Client) => {
    await client.init()
    client.startup()
    console.log('waiting for ready')
    await client.engine!.state.waitFor('Ready')
    console.log('sending query')
    // const result = await client.query('select c from foo;')
    const result = await client.query('SELECT * FROM foo;')
    console.log('query complete')
    console.log(JSON.stringify(result, null, 0))
}

console.debug('Its a bright shiny day!')
