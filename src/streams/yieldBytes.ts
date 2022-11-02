import { Byte } from "../types.ts";

export class YieldBytesError extends Error {}

export async function* yieldBytes(readable: ReadableStream) {
    const reader: ReadableStreamDefaultReader<Iterable<number>> = readable.getReader({ mode: undefined });
    try {
        while (true) {
            const { value, done } = await reader.read();
            if (done) throw new YieldBytesError(`stream is done`);
            yield* value;
        }
    } catch (error) {
        throw new YieldBytesError(error);
    } finally {
        reader.releaseLock();
    }
}

// export async function readNBytes(byteYielder: AsyncGenerator<Byte, void, undefined>, n: number): Promise<Array<Byte>> {
//     const bytes = [];
//     let count = 0;
//     while (count++ < n) {
//         const { value, done } = await byteYielder.next();
//         if (done) {
//             throw new YieldBytesError(`stream is done after ${count}/${n} bytes`);
//         } else {
//             bytes.push(value);
//         }
//     }
//     return bytes;
// }

export async function readBytesWhile(
    byteYielder: AsyncGenerator<Byte, void, undefined>,
    test: (b: Byte) => boolean
): Promise<Array<Byte>> {
    const bytes = [];
    let count = 0;
    while (true) {
        count++;
        const { value, done } = await byteYielder.next();
        if (done) {
            throw new YieldBytesError(`stream is done after ${count} bytes`);
        } else {
            bytes.push(value);
        }
        if (!test(value)) return bytes;
    }
}

export const readNBytes = (byteYielder: AsyncGenerator<Byte, void, undefined>, n: number) => readBytesWhile(byteYielder, () => --n > 0);