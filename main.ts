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
    await client.startup()
    // const result = await client.query('select c from foo;')
    for (const query of [
        'DROP TABLE IF EXISTS foo;',
        'CREATE TABLE foo(x INT PRIMARY KEY, y TEXT);',
        "INSERT INTO foo VALUES (0, 'foo0'), (1, 'foo1');",
        'SELECT * FROM foo;',
        'DROP TABLE foo;',
    ]) {
        console.log('')
        const result = await client.query(query)
        console.log(query)
        console.log(JSON.stringify(result, null, 0))
    }
}

console.log('Its a bright shiny day!')

await testClient(client)
await client.shutdown()

console.log('goodbye!')
