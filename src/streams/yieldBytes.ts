import type { Byte } from './types.ts'

export class YieldBytesError extends Error {}

// export async function* yieldBytes(readable: ReadableStream) {
export async function* yieldBytes(reader: ReadableStreamDefaultReader<Iterable<number>>) {
    try {
        while (true) {
            const { value, done } = await reader.read()
            // console.log(`[yieldBytes] read`)
            if (done) throw new YieldBytesError(`stream is done`)
            yield* value
        }
    // } catch (error) {
    //     console.log(`[yieldBytes] caught error: ${error}`)
    } finally {
        // console.log(`[yieldBytes] releasing lock`)
        reader.releaseLock()
    }
}

export async function readBytesWhile(
    byteYielder: AsyncGenerator<Byte, void, undefined>,
    test: (b: Byte) => boolean,
): Promise<Array<Byte>> {
    const bytes = []
    let count = 0
    while (true) {
        count++
        const { value, done } = await byteYielder.next()
        if (done) {
            throw new YieldBytesError(`stream is done after ${count} bytes`)
        } else {
            bytes.push(value)
        }
        if (!test(value)) return bytes
    }
}

export const readNBytes = (byteYielder: AsyncGenerator<Byte, void, undefined>, n: number) => {
    return readBytesWhile(byteYielder, () => --n > 0)
}
