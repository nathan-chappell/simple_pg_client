import { Byte } from "../types.ts";
import { yieldBytes, readNBytes, readBytesWhile } from "./yieldBytes.ts";

export const stringToBytes = (s: string) => [...[...s].map(c => c.charCodeAt(0)), 0];

export class DataTypeAdapter {
    byteYielder: AsyncGenerator<number, void, undefined>;

    constructor(readable: ReadableStream) {
        this.byteYielder = yieldBytes(readable);
    }

    async readInt16(): Promise<Byte> {
        const bytes = await readNBytes(this.byteYielder, 2);
        return (bytes[0] << 8) | bytes[1];
    }

    async readInt32(): Promise<Byte> {
        const bytes = await readNBytes(this.byteYielder, 4);
        return (bytes[0] << (8 * 3)) | (bytes[1] << (8 * 2)) | (bytes[2] << (8 * 1)) | bytes[3];
    }

    async readChar(): Promise<string> {
        const byte = await readNBytes(this.byteYielder, 1);
        return String.fromCharCode(byte[0]);
    }

    async readString(): Promise<string> {
        const bytes = await readBytesWhile(this.byteYielder, byte => byte !== 0)
        return String.fromCharCode(...bytes.slice(0,-1))
    }
}
