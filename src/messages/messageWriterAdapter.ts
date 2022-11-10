import { Byte } from './builtinTypes.generated.ts'
import {
    isByte4Type,
    isITypedByte4Value,
    isITypedNumberValue,
    isITypedStringValue,
    isITypedArray,
    isNumberType,
    isStringType,
    TypedNumber,
    TypedString,
    TypedValue,
} from './ITypedValue.ts'

const l8 = (x: number) => x % 256
const b0 = (x: number) => l8(x >> (8 * 3))
const b1 = (x: number) => l8(x >> (8 * 2))
const b2 = (x: number) => l8(x >> (8 * 1))
const b3 = (x: number) => l8(x >> (8 * 0))

export const toByteArray: (tv: TypedValue) => Byte[] = tv => {
    if (isITypedArray(tv)) {
        return [
            toByteArray({ type: tv.sizeType, value: tv.value.length }),
            ...tv.value.map(toByteArray).flat(),
        ].flat()
    } else if (isITypedByte4Value(tv)) {
        return tv.value
    } else if (isITypedNumberValue(tv) || isITypedStringValue(tv)) {
        switch (tv.type) {
            case 'Int8':
                return [b3].map(b => b(tv.value))
            case 'Int16':
                return [b2, b3].map(b => b(tv.value))
            case 'Int32':
                return [b0, b1, b2, b3].map(b => b(tv.value))
            case 'Char':
            case 'String':
                return [...tv.value].map(c => c.charCodeAt(0))
            default:
                throw new Error(`[toByteArray] couldn't byteify ${JSON.stringify(tv)}`)
        }
    } else {
        throw new Error(`[toByteArray] couldn't byteify ${JSON.stringify(tv)}`)
    }
}

export class MessageWriterAdapter {
    writer: WritableStreamDefaultWriter

    constructor(writable: WritableStream<Byte>) {
        this.writer = writable.getWriter()
    }

    release() {
        this.writer.releaseLock()
    }

    writeMessage(message: TypedValue[]): Promise<void> {
        const lengthIndex = message.findIndex(tv => tv.name === 'length')
        if (lengthIndex === -1) {
            throw new Error(`[MessageWriterAdapter.writeMessage] all messages must have a "length" value`)
        }

        const lengthType = (message[lengthIndex] as TypedNumber).type
        if (lengthType !== 'Int32') {
            throw new Error(`[MessageWriterAdapter.writeMessage] only length types of Int32 are expected`)
        }

        const byteArrays = message.map(toByteArray)
        const length = byteArrays.reduce((acc, a) => acc + a.length, 0)
        byteArrays[lengthIndex] = toByteArray({ type: lengthType, value: length } as TypedNumber)
        const bytes = Uint8Array.from(byteArrays.flat())
        console.log(`writing: ${bytes}`)
        try {
            return this.writer.write(bytes)
        } catch (error) {
            console.log('here')
            console.error(error)
            throw error
        }
    }
}
