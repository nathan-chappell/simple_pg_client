const { TcpPgClient } = require('./pg_client.js')

const makeTestClient = () => {
    messages = []
    const client = new TcpPgClient(
        {
            port: 5432,
            host: 'localhost',
        },
        response => {
            const getItem = i => `(${i.value}: ${i.type})`
            console.log(`(test) ${response.messageType}: ${response.message.map(getItem)}`)
            messages.push(response)
        },
    )
    client.messages = messages
    return client
}

function test_TcpPgClient() {
    const client = makeTestClient()
    return client.startup('nchappell', 'test').then(ok => {
        if (ok.messageType !== 'AuthenticationOk')
            throw new Error(`invalid ok message: ${JSON.stringify(ok)}`)
    }).finally(() => {
        client.close()
    })
}

function test_TcpPgClient_SimpleQuery() {
    const query = `SELECT * FROM a;`
    const client = makeTestClient()
    return client.startup('nchappell', 'test').then(
        () => client.receive('ReadyForQuery')
    ).then(
        async () => {
            console.log(`sending query: ${query}`)
            await client.query(query)
            // await client.receive()
            console.log(`debug: ${JSON.stringify(client.messages.map(m => m.messageType))}`)
        }
    ).then(async (ok) => {
        console.log('here...')
        await client.receive()
        console.log(JSON.stringify(ok))
        return client
    })
}

test_TcpPgClient()
test_TcpPgClient_SimpleQuery().then(
    client => setTimeout(() => {
        // console.log(JSON.stringify(client.messages, null, 2))
        console.log('test complete...')
        client.close()
    }, 500)
)