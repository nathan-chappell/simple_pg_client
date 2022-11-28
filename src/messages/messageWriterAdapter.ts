import { Byte } from './builtinTypes.generated.ts'
import { TypedArray } from './fromEntries.ts'
// import { TypedValue } from './fromEntries.ts'
import {
    isByte4Type,
    isNumberType,
    isSizeType,
    isStringType,
    NamedTypedArray,
    NamedTypedValue,
    NumberType,
    SizeType,
    StringType,
    TypedValue,
} from './ITypedValue.ts'

const l8 = (x: number) => x % 256
const b0 = (x: number) => l8(x >> (8 * 3))
const b1 = (x: number) => l8(x >> (8 * 2))
const b2 = (x: number) => l8(x >> (8 * 1))
const b3 = (x: number) => l8(x >> (8 * 0))

function isTypedValue(tv: TypedValue | TypedArray): tv is TypedValue {
    return 'type' in tv
}

function isTypedArray(tv: TypedValue | TypedArray): tv is TypedArray {
    return 'sizeType' in tv
}

export const toByteArray: (tv: TypedValue | TypedArray) => Byte[] = tv => {
    if (isTypedArray(tv)) {
        return [
            toByteArray({ type: tv.sizeType as SizeType, value: tv.value.length }),
            ...(tv.value as (TypedValue | TypedArray)[]).map(toByteArray).flat(),
        ].flat()
    } else if (tv.type === 'Byte4') {
        return tv.value
    } else if (tv.type === 'KVPairs') {
        const makeStr = (value: string) => ({ type: 'String', value } as TypedValue)
        return [...tv.value.flatMap(pair => pair.map(makeStr).map(toByteArray)), toByteArray(makeStr(''))]
    } else if (isNumberType(tv.type) || isStringType(tv.type)) {
        switch (tv.type) {
            case 'Int8':
                return [b3].map(b => b(tv.value))
            case 'Int16':
                return [b2, b3].map(b => b(tv.value))
            case 'Int32':
                return [b0, b1, b2, b3].map(b => b(tv.value))
            case 'Char':
                return [tv.value.charCodeAt(0)]
            case 'String':
                return [...[...tv.value].map(c => c.charCodeAt(0)), 0]
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

    writeMessage(message: NamedTypedValue[]): Promise<void> {
        const lengthIndex = message.findIndex(tv => tv.name === 'length')
        if (lengthIndex === -1) {
            throw new Error(`[MessageWriterAdapter.writeMessage] all messages must have a "length" value`)
        }

        const lengthType = (message[lengthIndex] as TypedValue).type
        if (lengthType !== 'Int32') {
            throw new Error(`[MessageWriterAdapter.writeMessage] only length types of Int32 are expected`)
        }

        const byteArrays = message.map(toByteArray)
        const length = byteArrays.reduce((acc, a) => acc + a.length, 0)
        byteArrays[lengthIndex] = toByteArray({ type: lengthType, value: length } as TypedValue)
        const bytes = Uint8Array.from(byteArrays.flat())
        try {
            return this.writer.write(bytes)
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}
