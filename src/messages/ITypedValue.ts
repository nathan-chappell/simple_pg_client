export type NumberType = 'Byte' | 'Int8' | 'Int16' | 'Int32'
export type Byte4Type = 'Byte4'
export type StringType = 'String' | 'Char'
export type SizeType = 'Int16' | 'Int32'

export function isNumberType(type: string): type is NumberType {
    return ['Byte', 'Int8', 'Int16', 'Int32'].indexOf(type) !== -1
}

export function isByte4Type(type: string): type is NumberType {
    return ['Byte4'].indexOf(type) !== -1
}

export function isStringType(type: string): type is StringType {
    return ['String', 'Char'].indexOf(type) !== -1
}

export function isSizeType(type: string): type is StringType {
    return ['Int16', 'Int32'].indexOf(type) !== -1
}

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
