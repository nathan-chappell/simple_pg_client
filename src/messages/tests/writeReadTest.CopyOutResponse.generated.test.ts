/* DO NOT EDIT THIS FILE!!!  It has been generated for your pleasure. */
// deno-lint-ignore-file 

import { assert, assertObjectMatch } from 'https://deno.land/std@0.162.0/testing/asserts.ts'
import { DataTypeAdapter } from '../../streams/dataTypeAdapter.ts'
import { isCopyOutResponse, parseBackendMessage, CopyOutResponse } from '../messageFormats.generated.ts'
import { MessageWriterAdapter } from '../messageWriterAdapter.ts'
import { ITypedValue } from '../ITypedValue.ts'
import { WriteReadTester } from '../../streams/WriteReadTester.ts'

const _expected = (o: object[]) => {
    const result: { [k: string]: any } = {}
    for (const [k, v] of Object.entries(o)) {
        result[k] = Array.isArray(v) ? v.map(_expected) : [(v as Record<string,string>).name, (v as Record<string,string>).value]
    }
    return result
}

Deno.test('write/read CopyOutResponse', async () => {
    const message: ITypedValue[] = [{"type":"Char","value":"H","name":"messageType"},{"type":"Int32","value":2562890625,"name":"length"},{"type":"Int8","value":16,"name":"isBinary"},{"sizeType":"Int16","value":[{"type":"Int16","value":43601},{"type":"Int16","value":54560},{"type":"Int16","value":51267}],"name":"formatCodes"}]
    // const expectedRead = Object.fromEntries(message.map(v => [v.name, v.value])) as Record<string, unknown>
    const expectedRead = _expected(message) as Record<string, unknown>

    const writeReadTester = new WriteReadTester()
    let messageWriterAdapter: MessageWriterAdapter | null = null
    let dataTypeAdapter: DataTypeAdapter | null = null

    try {
        messageWriterAdapter = new MessageWriterAdapter(writeReadTester.writable)
        await messageWriterAdapter.writeMessage(message)
        dataTypeAdapter = new DataTypeAdapter(writeReadTester.readable)
        const actualRead = (await parseBackendMessage(dataTypeAdapter)) as unknown as Record<string, unknown>

        assert(isCopyOutResponse(actualRead as unknown as CopyOutResponse), `typeGuard: isCopyOutResponse failed`)

        delete expectedRead.length
        delete actualRead.length

        assertObjectMatch(actualRead, expectedRead)
        assertObjectMatch(expectedRead, actualRead)
    } finally {
        messageWriterAdapter?.release()
        dataTypeAdapter?.release()
    }
})

/* DO NOT EDIT THIS FILE!!!  It has been generated for your pleasure. */
