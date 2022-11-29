import { Client, TConnector } from './src/client.ts'

const connector: TConnector = ({ hostname, port }) => Deno.connect({ hostname, port })

export const client = new Client(connector, {
    database: 'postgres',
    host: 'localhost',
    password: 'postgres',
    port: 5432,
    username: 'postgres'
});

export const testClient = async (client: Client) => {
    await client.init()
    client.startup()
    console.log('waiting for ready')
    await client.engine!.state.waitFor('Ready')
    console.log('sending query')
    const result = await client.query('select c from foo;')
    console.log('query complete')
    console.log(result)
}

console.debug('Its a bright shiny day!')