import type { Byte } from './types.ts'
import { readBytesWhile, readNBytes, yieldBytes } from './yieldBytes.ts'

export const stringToBytes = (s: string) => [...[...s].map(c => c.charCodeAt(0)), 0]

class NotAnError extends Error {}

export class DataTypeAdapter {
    byteYielder: AsyncGenerator<number, void, undefined>

    constructor(readable: ReadableStream) {
        this.byteYielder = yieldBytes(readable)
    }

    async release() {
        try {
            await this.byteYielder.throw(new NotAnError())
        } catch (error) {
            if (error instanceof NotAnError) {
                return
            } else {
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
}
