export type NumberType = 'Byte' | 'Int8' | 'Int16' | 'Int32'
export type Byte4Type = 'Byte4'
export type StringType = 'String' | 'Char'
export type SizeType = 'Int16' | 'Int32'

//#region guards
export function isNumberType(type: string): type is NumberType {
    return ['Byte', 'Int8', 'Int16', 'Int32'].indexOf(type) !== -1
}

export function isByte4Type(type: string): type is Byte4Type {
    return ['Byte4'].indexOf(type) !== -1
}

export function isStringType(type: string): type is StringType {
    return ['String', 'Char'].indexOf(type) !== -1
}

export function isSizeType(type: string): type is StringType {
    return ['Int16', 'Int32'].indexOf(type) !== -1
}
//#endregion

export type TTypes = NumberType | StringType | Byte4Type
export type GetType<TType> = TType extends NumberType
    ? number
    : TType extends StringType
    ? string
    : TType extends Byte4Type
    ? [number, number, number, number]
    : never

export type TypedValue_<T> = T extends TTypes ? { type: T; value: GetType<T> } : never
export type TypedArray_<ST, T> = ST extends SizeType
    ? T extends unknown
        ? { sizeType: ST; value: T[] }
        : never
    : never

export type TypedValue = TypedValue_<TTypes>
type TypedValue_not_byte4 = TypedValue_<Exclude<TTypes, 'Byte4'>>
// I coudn't figure out the damn recursion for this type, so I just unrolled it by hand a couple times...
export type TypedArray = TypedArray_<SizeType, TypedValue_not_byte4> | TypedArray_<SizeType, TypedArray_<SizeType, TypedValue_not_byte4>>
export type Named<T> = T extends unknown ? T & { name: string } : never

export type NamedTypedValue = Named<TypedValue | TypedArray>
export type NamedTypedArray = Named<TypedArray>