import {
    isNumberType,
    isStringType,
    TypedValue,
    TypedArray,
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
    {} as Record<string, Message>
)

export class TypedValueGenerator {
    constructor(public messagesByName: Record<string, Message>) {}

    nextTypedValue(typeInfo: TypeInfo): TypedValue | TypedArray | (TypedValue | TypedArray)[] {
        if (!typeInfo.isArray) {
            // prettier-ignore
            if (typeInfo.with({ optional: false }).tsType === 'Byte4') {
                return { type: 'Byte4', value: [...Array(4)].map(_ => this._nextSimpleValue('Int8')) as unknown as ['Int8','Int8','Int8','Int8'] }
            }
            if (Object.hasOwn(messagesByName, typeInfo.tsType)) {
                return this.nextMessage(messagesByName[typeInfo.tsType])
            }

            const type = typeInfo.typeValueType

            if (isNumberType(type)) {
                if (typeInfo.options.expected !== null) {
                    return { type, value: parseInt(typeInfo.options.expected) } as TypedValue
                } else {
                    return { type, value: this._nextSimpleValue(type) }
                }
            } else if (isStringType(type)) {
                if (typeInfo.options.expected !== null) {
                    return { type, value: typeInfo.options.expected[1] } as TypedValue
                } else {
                    return { type, value: this._nextSimpleValue(type) }
                }
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
            } as TypedArray
        }
    }

    nextMessage(message: Message): (TypedValue | TypedArray)[] {
        return message.info.properties
            .map(p => ({ ...this.nextTypedValue(p.typeInfo), name: p.name }))
            .flat()
    }
}
