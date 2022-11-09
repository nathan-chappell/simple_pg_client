import {
    isNumberType,
    isStringType,
    ITypedValue,
    ITypedValueArray,
    NumberType,
    StringType,
} from '../../../messages/ITypedValue.ts'
import { formats } from '../import/formats.ts'
import { Message } from './Message.ts'
import { MessageInfo } from './MessageInfo.ts'
import { TypeInfo } from './TypeInfo.ts'
/*
from formats:

"type": "Byte[Int32][Int16]",
"type": "IField[Int16]",
"type": "Int16[Int16]",
"type": "Int32[Int16]",
"type": "Byte4",
"type": "Byte1",
"type": "Byte4?",
"type": "Int16",
"type": "Int32",
"type": "Int8",
"type": "String",
*/

// export type NumberType = 'Byte' | 'Int8' | 'Int16' | 'Int32'
// export type StringType = 'String' | 'Char'

const messageInfos = formats.map(format => new MessageInfo(format))
const messages = messageInfos.map(info => new Message(info))
const messagesByName = messages.reduce(
    (byName, m) => ((byName[m.info.name] = m), byName),
    {} as Record<string, Message>,
)

function* getCounter() {
    let i = 0
    while (true) yield i++
}
const count2Char = (n: number) => String.fromCharCode('A'.charCodeAt(0) + (n % 26))

export class TypedValueGenerator {
    counter: Generator<number, void, unknown>
    constructor() {
        this.counter = getCounter()
    }

    get nextCount(): number {
        return this.counter.next().value!
    }

    get nextChar(): string {
        return count2Char(this.nextCount)
    }

    _nextSimpleValue(type: StringType): string
    _nextSimpleValue(type: NumberType): number

    _nextSimpleValue(type: unknown): unknown {
        switch (type) {
            case 'Char':
                return count2Char(this.nextCount)
            case 'String':
                return [...Array(7)].map(_ => this.nextChar).join('')
            case 'Int8':
                return this.nextCount % 2 ** 8
            case 'Int16':
                return this.nextCount ** 5 % 2 ** 16
            case 'Int32':
                return this.nextCount ** 8 % 2 ** 32
            default:
                throw new Error(`Unable to generate nextTypedValue for ${type}`)
        }
    }

    nextTypedValue(typeInfo: TypeInfo): ITypedValue | ITypedValue[] {
        if (typeInfo.with({ optional: false }).tsType === 'Byte4') {
            return { type: 'Byte4', value: [...Array(4)].map(_ => this._nextSimpleValue('Int8')) }
        } else if (!typeInfo.isArray) {
            if (Object.hasOwn(messagesByName, typeInfo.tsType)) {
                return messagesByName[typeInfo.tsType].info.properties
                    .map(p => this.nextTypedValue(p.typeInfo))
                    .flat()
            }

            const type = typeInfo.typeValueType

            if (isNumberType(type)) {
                return { type, value: this._nextSimpleValue(type) }
            } else if (isStringType(type)) {
                return { type, value: this._nextSimpleValue(type) }
            } else {
                throw new Error(`Invalid overload: ${type}`)
            }
        } else {
            const { innerArrayTypeInfo, sizeTypeInfo } = typeInfo

            if (sizeTypeInfo.tsType !== 'Int16' && sizeTypeInfo.tsType !== 'Int32')
                throw new Error(`Invalid size type: ${sizeTypeInfo.rawType}`)
            if (innerArrayTypeInfo.tsType === 'Byte4') throw new Error('Not Implemented')
            return {
                sizeType: sizeTypeInfo.tsType,
                value: [...Array(3)].map(_ => this.nextTypedValue(innerArrayTypeInfo)),
            } as ITypedValueArray
        }
    }

    nextMessage(message: Message): ITypedValue[] {
        return message.info.properties.map(p => ({ ...this.nextTypedValue(p.typeInfo), name: p.name })).flat()
    }
}
