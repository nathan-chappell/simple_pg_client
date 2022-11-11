export type NumberType = 'Byte' | 'Int8' | 'Int16' | 'Int32'
export type Byte4Type = 'Byte4'
export type StringType = 'String' | 'Char'
export type SizeType = 'Int16' | 'Int32'

export interface ITypedValue {
    value: string | number
    // type?: 'Int8' | 'Int16' | 'Int32' |
    type?: StringType | NumberType
}

export interface INamedTypedValue {
    name: string
    value: string | string[] | number | number[] | ITypedValue[]
    type?: unknown
}
