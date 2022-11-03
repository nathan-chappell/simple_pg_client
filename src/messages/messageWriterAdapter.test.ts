import { ITypedValue, MessageWriterAdapter } from './messageWriterAdapter.ts'

Deno.test('simple message write', async () => {
    const writable = new WritableStream({
        write: (chunk, controller) => {},
    })

    const messageWriter = MessageWriterAdapter(writable)
    const message: ITypedValue[] = []
})
