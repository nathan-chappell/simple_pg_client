/* DO NOT EDIT THIS FILE!!!  It has been generated for your pleasure. */
// deno-lint-ignore-file 

import { assert, assertObjectMatch } from 'https://deno.land/std@0.162.0/testing/asserts.ts'
import { DataTypeAdapter } from '../../streams/dataTypeAdapter.ts'
import { isNoticeResponse, parseBackendMessage, NoticeResponse } from '../messageFormats.generated.ts'
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

Deno.test('write/read NoticeResponse', async () => {
    const message: ITypedValue[] = [{"type":"Char","value":"N","name":"messageType"},{"type":"Int32","value":3611361280,"name":"length"}]
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

        assert(isNoticeResponse(actualRead as unknown as NoticeResponse), `typeGuard: isNoticeResponse failed`)

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