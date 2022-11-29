import type { Byte } from './types.ts'
import { readBytesWhile, readNBytes, yieldBytes, YieldBytesError } from './yieldBytes.ts'

export const stringToBytes = (s: string) => [...[...s].map(c => c.charCodeAt(0)), 0]

class NotAnError extends Error {}

export class DataTypeAdapter {
    byteYielder: AsyncGenerator<number, void, undefined>
    reader: ReadableStreamDefaultReader<Iterable<number>>

    constructor(public readable: ReadableStream) {
        this.reader = readable.getReader({ mode: undefined })
        this.byteYielder = yieldBytes(this.reader)
    }

    async release() {
        try {
            // console.log('releasing byteYielder')
            await this.reader.cancel()
            // console.log('canceled')
            await this.byteYielder.throw(new NotAnError())
            // console.log('released')
        } catch (error) {
            // console.log('error caught')
            if (error instanceof NotAnError || error instanceof YieldBytesError) {
                // console.log('successfully released')
                return
            } else {
                console.log('[un]successfully released')
                console.log(error)
                throw error
            }
        }
    }

    async readInt8(): Promise<Byte> {
        const bytes = await readNBytes(this.byteYielder, 1)
        return bytes[0]
    }

    async readInt16(): Promise<Byte> {
        const bytes = await readNBytes(this.byteYielder, 2)
        return bytes[0] * 2 ** 8 + bytes[1]
    }

    async readInt32(): Promise<Byte> {
        const bytes = await readNBytes(this.byteYielder, 4)
        return bytes[0] * 2 ** 24 + bytes[1] * 2 ** 16 + bytes[2] * 2 ** 8 + bytes[3]
    }

    async readChar(): Promise<string> {
        const byte = await readNBytes(this.byteYielder, 1)
        return String.fromCharCode(byte[0])
    }

    async readString(): Promise<string> {
        const bytes = await readBytesWhile(this.byteYielder, byte => byte !== 0)
        return String.fromCharCode(...bytes.slice(0, -1))
    }

    async readByte4(): Promise<Byte[]> {
        const bytes = await readNBytes(this.byteYielder, 4)
        return bytes
    }

    async readByteStringPairs(): Promise<[number, string][]> {
        let byte = await this.readInt8()
        const result: [number, string][] = []
        while (byte !== 0) {
            const value = await this.readString()
            result.push([byte, value])
            byte = await this.readInt8()
        }
        return result
    }

    async readKVPairs(): Promise<[string, string][]> {
        const result: [string, string][] = []
        let key: string = await this.readString()
        while (key !== '') {
            const value = await this.readString()
            result.push([key, value])
            key = await this.readString()
        }
        return result
    }
}
