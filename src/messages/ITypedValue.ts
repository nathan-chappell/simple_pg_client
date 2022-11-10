export type NumberType = 'Byte' | 'Int8' | 'Int16' | 'Int32'
export type Byte4Type = 'Byte4'
export type StringType = 'String' | 'Char'
export type SizeType = 'Int16' | 'Int32'

//#region guards
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
//#endregion

type TTypes = NumberType | StringType
type GetType<TType> = TType extends NumberType
    ? number
    : TType extends StringType
    ? string
    : TType extends Byte4Type
    ? [number, number, number, number]
    : never

type TypedValue_<T> = T extends TTypes ? { type: T; value: GetType<T> } : never
type TypedArray_<ST, T> = ST extends SizeType
    ? T extends unknown
        ? { sizeType: ST; value: T[] }
        : never
    : never

type TypedValue = TypedValue_<TTypes>
// I coudn't figure out the damn recursion for this type, so I just unrolled it by hand a couple times...
type TypedArray = TypedArray_<SizeType, TypedValue> | TypedArray_<SizeType, TypedArray_<SizeType, TypedValue>>
type Named<T> = T extends unknown ? T & { name: string } : never

type NamedTypedValue = Named<TypedValue>
type NamedTypedArray = Named<TypedArray>

//#region guards
function isTypedValue(obj: unknown): obj is TypedValue {
    return (
        obj !== null && typeof obj === 'object' && Object.hasOwn(obj, 'type') && Object.hasOwn(obj, 'value')
    )
}

function isNamedTypedValue(obj: unknown): obj is NamedTypedValue {
    return isTypedValue(obj) && Object.hasOwn(obj, 'name')
}

function isTypedArray(obj: unknown): obj is TypedArray {
    return (
        obj !== null &&
        typeof obj === 'object' &&
        Object.hasOwn(obj, 'sizeType') &&
        Object.hasOwn(obj, 'value') &&
        Array.isArray((obj as Record<string, unknown>).value)
    )
}

function isNamedTypedArray(obj: unknown): obj is NamedTypedArray {
    return isTypedArray(obj) && Object.hasOwn(obj, 'name')
}

/*
function is__(obj: unknown): obj is __ {
    return true
}
*/
// let vt1: VT = { type: "Char", value: '' }
// let vt2: VT = { type: "Byte", value: 0 }
// let at1: AT = { sizeType: "Int16", value: [vt1] }
// // let at2: AT = { sizeType: "Int16", value: [vt1, vt2]}
// let at2: AT = { sizeType: "Int16", value: [{ sizeType: "Int16", value: [vt1] }, { sizeType: "Int16", value: [vt1] }] }
//#endregion

export type ITVObject = { [name: string]: string | string[] | number | number[] | ITVObject }

export function objFromItvArray(a: TypedValue[]): string[] | number[]
export function objFromItvArray(a: NamedTypedValue[]): ITVObject
export function objFromItvArray(a: unknown[]): ITVObject | string[] | number[] {
    if (_isINamedTypedValueArray(a)) {
        return a.reduce(
            (obj, { name, value }) => (
                (obj[name] = _isITVArray(value) ? objFromItvArray(value) : value), obj
            ),
            {} as ITVObject,
        )
    } else if (_isITypedValueArray(a)) {
        return a.map(v => v.value)
    } else {
        throw new Error(`failed to get object form ${JSON.stringify(a)}`)
    }
}
