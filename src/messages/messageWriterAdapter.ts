import { Byte } from './builtinTypes.generated.ts'
import { TypedValue } from './fromEntries.ts'
import {
    isByte4Type,
    isNumberType,
    isSizeType,
    isStringType,
    NumberType,
    SizeType,
    StringType,
} from './ITypedValue.ts'

const l8 = (x: number) => x % 256
const b0 = (x: number) => l8(x >> (8 * 3))
const b1 = (x: number) => l8(x >> (8 * 2))
const b2 = (x: number) => l8(x >> (8 * 1))
const b3 = (x: number) => l8(x >> (8 * 0))

export interface ITypedNumberValue {
    name?: string
    type: NumberType
    value: number
}

export function isITypedNumberValue(tv: ITypedValue): tv is ITypedNumberValue {
    return isNumberType((tv as unknown as Record<string, string>).type)
}

export interface ITypedByte4Value {
    name?: string
    type: 'Byte4'
    value: number[]
}

export function isITypedByte4Value(tv: ITypedValue): tv is ITypedByte4Value {
    return isByte4Type((tv as unknown as Record<string, string>).type)
}

export interface ITypedStringValue {
    name?: string
    type: StringType
    value: string
}

export function isITypedStringValue(tv: ITypedValue): tv is ITypedStringValue {
    return isStringType((tv as unknown as Record<string, string>).type)
}

export interface ITypedValueArray {
    name?: string
    sizeType: SizeType
    // NOTE: this type isn't quite right, but it's good enough
    value: (ITypedNumberValue | ITypedStringValue | ITypedValueArray)[]
}

export function isITypedValueArray(tv: ITypedValue): tv is ITypedValueArray {
    return isSizeType((tv as unknown as Record<string, string>).sizeType)
}

export type ITypedValue = ITypedNumberValue | ITypedStringValue | ITypedValueArray | ITypedByte4Value

export const toByteArray: (tv: ITypedValue) => Byte[] = tv => {
    if (isITypedValueArray(tv)) {
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

    writeMessage(message: ITypedValue[]): Promise<void> {
        const lengthIndex = message.findIndex(tv => tv.name === 'length')
        if (lengthIndex === -1) {
            throw new Error(`[MessageWriterAdapter.writeMessage] all messages must have a "length" value`)
        }

        const lengthType = (message[lengthIndex] as ITypedNumberValue).type
        if (lengthType !== 'Int32') {
            throw new Error(`[MessageWriterAdapter.writeMessage] only length types of Int32 are expected`)
        }

        const byteArrays = message.map(toByteArray)
        const length = byteArrays.reduce((acc, a) => acc + a.length, 0)
        byteArrays[lengthIndex] = toByteArray({ type: lengthType, value: length } as ITypedNumberValue)
        const bytes = Uint8Array.from(byteArrays.flat())
        try {
            return this.writer.write(bytes)
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}
