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

export type ITVObject = { [name: string]: string | string[] | number | number[] | ITVObject }

function _isStringArray(a: unknown): a is INamedTypedValue[] {
    return Array.isArray(a) && typeof a[0] === 'string'
}

function _isNumberArray(a: unknown): a is number[] {
    return Array.isArray(a) && typeof a[0] === 'number'
}

function _isITVArray(a: unknown): a is INamedTypedValue[] | ITypedValue[] {
    return Array.isArray(a) && typeof a[0] === 'object'
}

function _isINamedTypedValueArray(a: unknown): a is INamedTypedValue[] {
    return Array.isArray(a) && typeof a[0] === 'object' && typeof a[0].name === 'string'
}

function _isITypedValueArray(a: unknown): a is ITypedValue[] {
    return Array.isArray(a) && typeof a[0] === 'object'
}

export function objFromItvArray(a: ITypedValue[]): string[] | number[]
export function objFromItvArray(a: INamedTypedValue[]): ITVObject
export function objFromItvArray(a: unknown[]): ITVObject | string[] | number[] {
    if (_isINamedTypedValueArray(a)) {
        return a.reduce(
            (obj, { name, value }) => ((obj[name] = _isITVArray(value) ? objFromItvArray(value) : value), obj),
            {} as ITVObject,
        )
    } else if (_isITypedValueArray(a)) {
        return a.map(v => v.value)
    } else {
        throw new Error(`failed to get object form ${JSON.stringify(a)}`)
    }
}
