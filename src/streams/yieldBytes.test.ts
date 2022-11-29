import { assert, assertEquals, assertInstanceOf } from 'https://deno.land/std@0.161.0/testing/asserts.ts'
import { readNBytes, yieldBytes, YieldBytesError } from './yieldBytes.ts'

Deno.test('yieldBytes', async () => {
    const bytes = Uint8Array.from([0x40, 0x20, 0x10, 127])
    const readable = new ReadableStream({
        start: controller => controller.enqueue(bytes),
    })
    const reader = readable.getReader({mode: undefined})
    const yielder = yieldBytes(reader)
    const receivedBytes = await readNBytes(yielder, 4)
    assertEquals(receivedBytes.length, bytes.length)
    for (let i = 0; i < bytes.length; ++i) {
        assertEquals(bytes[i], receivedBytes[i])
    }
})

Deno.test('yieldBytes => error', async () => {
    const bytes = Uint8Array.from([0x40, 0x20, 0x10, 127])
    const readable = new ReadableStream({
        start: controller => controller.enqueue(bytes),
    })
    const reader = readable.getReader({mode: undefined})
    const yielder = yieldBytes(reader)
    let error = null
    try {
        await Promise.all([readNBytes(yielder, 5), yielder.throw('unlock please')])
    } catch (e) {
        error = e
    }
    // assertInstanceOf(error, Error)
    console.log(error)
    assert(error === 'unlock please')
})
