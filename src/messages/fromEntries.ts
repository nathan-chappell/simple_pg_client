type TypedValue<T = unknown> = { type: string; value: T }
export type TypedArray<T = unknown> = { sizeType: string; value: T[] }
type Named<T = unknown> = { name: string } & TypedValue<T>
type O = string | number | { [name: string]: O } | Array<O>

function isString(o: unknown): o is string {
    return typeof o === 'string'
}

function isNumber(o: unknown): o is number {
    return typeof o === 'number'
}

function isTypedValue(o: Record<never, never> | TypedValue): o is TypedValue {
    return 'type' in o && typeof o.type === 'string' && 'value' in o
}

function isTypedArray(o: Record<never, never> | TypedArray): o is TypedArray {
    return 'sizeType' in o && typeof o.sizeType === 'string' && 'value' in o && Array.isArray(o.value)
}

function isNamedValue(o: Record<never, never> | Named): o is Named {
    return isTypedValue(o) && 'name' in o && typeof o.name === 'string'
}

function isObjDef(o: Record<never, never>[] | Named[]): o is Named[] {
    return isNamedValue(o[0])
}

// this is for an array like [{type:..., value:...}, {type:..., value:...}]
function isArrayDef(o: Record<never, never>[] | TypedValue[]): o is TypedValue[] {
    return !isNamedValue(o[0]) && (isTypedValue(o[0]) || isTypedArray(o[0]))
}

function isByteStringPairs(o: unknown[][]): o is [number,string][] {
    return typeof o[0][0] === 'number' && typeof o[0][1] === 'string'
}

export function fromEntries(o: unknown): O {
    if (isString(o)) {
        return o
    } else if (isNumber(o)) {
        return o
    } else if (Array.isArray(o) && o.every(isString)) {
        throw new Error('unexpected string[]')
        // return o.map(fromEntries)
    } else if (Array.isArray(o) && o.every(isNumber)) {
        throw new Error('unexpected number[]')
        // return o.map(fromEntries)
    } else if (Array.isArray(o) && isByteStringPairs(o)) {
        return o
    } else if (Array.isArray(o) && isObjDef(o)) {
        return o.reduce(
            (result, item) => ((result[item.name] = fromEntries(item.value)), result),
            {} as { [name: string]: O },
        )
    } else if (!!o && o instanceof Object && isTypedArray(o)) {
        return o.value.map(fromEntries)
    } else if (Array.isArray(o) && isArrayDef(o)) {
        return o.map(item => fromEntries(item.value))
    } else if (!!o && isTypedValue(o) && (typeof o.value === 'string' || typeof o.value === 'number')) {
        return o.value
    } else {
        throw new Error(`Unable to create V from ${JSON.stringify(o, null, 2)}`)
    }
}
