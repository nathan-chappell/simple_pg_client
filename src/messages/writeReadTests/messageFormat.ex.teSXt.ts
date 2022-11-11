import { assert, assertObjectMatch } from 'https://deno.land/std@0.162.0/testing/asserts.ts'
import { DataTypeAdapter } from '../../streams/dataTypeAdapter.ts'
import { isReadyForQuery, parseBackendMessage, ReadyForQuery } from './../messageFormats.generated.ts'
import { MessageWriterAdapter } from './../messageWriterAdapter.ts'
import { WriteReadTester } from '../../streams/WriteReadTester.ts'
import { ITypedValue } from "../ITypedValue.ts";

Deno.test('write/read ReadyForQuery', async () => {
    const message: ITypedValue[] = [
        { name: 'messageType', type: 'Char', value: 'Z' },
        { name: 'length', type: 'Int32', value: 6 },
        { name: 'status', type: 'Char', value: '_' },
    ]
    const expectedRead = Object.fromEntries(message.map(v => [v.name, v.value])) as Record<string, unknown>

    const writeReadTester = new WriteReadTester()
    let messageWriterAdapter: MessageWriterAdapter | null = null
    let dataTypeAdapter: DataTypeAdapter | null = null

    try {
        messageWriterAdapter = new MessageWriterAdapter(writeReadTester.writable)
        await messageWriterAdapter.writeMessage(message)
        dataTypeAdapter = new DataTypeAdapter(writeReadTester.readable)
        const actualRead = (await parseBackendMessage(dataTypeAdapter)) as unknown as Record<string, unknown>

        assert(isReadyForQuery(actualRead as unknown as ReadyForQuery), `typeGuard: isReadyForQuery failed`)
        assertObjectMatch(actualRead, expectedRead)
        assertObjectMatch(expectedRead, actualRead)
    } finally {
        messageWriterAdapter?.release()
        dataTypeAdapter?.release()
    }
})
